import { AppResumeSchema } from "@/types"
import useSWR from "swr"

export const useResumeSchemaKeys = () => {
  return useSWR<(keyof AppResumeSchema)[]>(["schema-keys"], async () => {
    return [
      "basics",
      "projects",
      "work",
      "education",
      "awards",
      "publications",
      "skills",
      "languages",
      "interests",
      "volunteer",
      "references",
    ]
  })
}
