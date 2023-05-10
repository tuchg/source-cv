import useSWR from "swr"
import useSWRMutation from "swr/mutation"

import {intoApplication} from "@/lib/resume"
import {
  DBItem,
  deleteResume,
  dupResume, fetchResumesDB,
  listResumes,
  saveResume,
} from "@/lib/resume/database"
import {initialValue} from "@/lib/store"
import {AppResumeDBMeta} from "@/types";

export const useResumes = (lang?: string) =>
  useSWR(`resumes`, () => {
    return new Promise((r) => r(listResumes(lang)))
  })

export const useResumesDB = (lang?: string) =>
  useSWR<DBItem[]>(`resumes-db`, () => {
    return new Promise((r) => r(fetchResumesDB()))
  })

export const useDupResume = () =>
  useSWRMutation(
    `resumes`,
    (url, {arg}: { arg: { id: number; lang?: string } }) => {
      return new Promise((resolve) => {
        dupResume(arg.id, arg.lang)
        resolve(1)
      })
    }
  )

export const useDelResume = () =>
  useSWRMutation(`resumes`, (url, {arg}: { arg: { id: number } }) => {
    return new Promise((resolve) => {
      deleteResume(arg.id)
      resolve(1)
    })
  })

export const useNewResume = () =>
  useSWRMutation(`resumes`, (url, {arg}: { arg: AppResumeDBMeta }) => {
    return new Promise((resolve) => {
      saveResume(intoApplication(initialValue), arg)
      resolve(1)
    })
  })
