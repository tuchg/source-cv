import { useEffect } from "react"
import { appStore } from "@/pages/editor"
import { ResumeSchema } from "@/types"
import useSWR from "swr"
import { useSnapshot } from "valtio"

import {
  buildResume,
  generateResume,
  installTheme,
  syncResumeChange,
} from "@/lib/webcontainer"

export const useTemplate = (name: string) => {
  const { data: resume } = useSnapshot(appStore.schemaModel)
  return useSWR(["themes", name, resume], ([_, name_, resume_]) =>
    generateResume(name_, resume_ as ResumeSchema)
  )
}
