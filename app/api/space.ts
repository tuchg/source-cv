import { AppResumeDBMeta } from "@/types"
import useSWR from "swr"
import useSWRMutation from "swr/mutation"

import { draftResume } from "@/lib/gpt/drafter"
import { rewrite } from "@/lib/gpt/rewriter"
import { intoApplication } from "@/lib/resume"
import {
  DBItem,
  deleteResume,
  dupResume,
  fetchResumesDB,
  listMyTemplates,
  listResumes,
  saveResume,
} from "@/lib/resume/database"
import { initialValue } from "@/lib/store"

export const useResumes = (lang?: string) =>
  useSWR(`resumes`, () => {
    return new Promise((r) => r(listResumes(lang)))
  })
export const useMyTemplates = () =>
  useSWR(`my-templates`, () => {
    return new Promise((r) => r(listMyTemplates()))
  })
export const useResumesDB = (lang?: string) =>
  useSWR<DBItem[]>(`resumes-db`, () => {
    return new Promise((r) => {
      r(fetchResumesDB())
    })
  })

export const useDupResume = () =>
  useSWRMutation(
    `resumes`,
    (url, { arg }: { arg: { id: number; lang?: string } }) => {
      return new Promise((resolve) => {
        dupResume(arg.id, arg.lang)
        resolve(1)
      })
    }
  )

export const useDelResume = () =>
  useSWRMutation(`resumes`, (url, { arg }: { arg: { id: number } }) => {
    return new Promise((resolve) => {
      deleteResume(arg.id)
      resolve(1)
    })
  })

export const useNewResume = () =>
  useSWRMutation(`resumes`, (url, { arg }: { arg: AppResumeDBMeta }) => {
    return new Promise((resolve) => {
      saveResume(intoApplication(initialValue), arg)
      resolve(1)
    })
  })

export const useNewAIResume = () =>
  useSWRMutation(`resumes`, (url, { arg }: { arg: AppResumeDBMeta }) => {
    return new Promise(async (resolve) => {
      const resumeData = await draftResume(arg.jd!, arg.lang, initialValue)
      saveResume(intoApplication(resumeData), arg)
      resolve(1)
    })
  })
export const useRewrite = () =>
  useSWRMutation(
    `rewrite`,
    (url, { arg }: { arg: { text: string; jd: string; lang: string } }) => {
      return new Promise(async (resolve) => {
        const resumeData = await rewrite(arg.text, arg.jd!, arg.lang)
        resolve(resumeData)
      })
    }
  )
