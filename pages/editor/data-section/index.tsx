import { Suspense } from "react"
import { DataSidebar } from "@/pages/editor/data-section/data-sidebar"
import { useTranslation } from "react-i18next"
import { proxy } from "valtio"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useResumeSchemaKeys } from "../utils/use-item"
import { DataSubSection } from "./sub-section"

// create a derived proxy
// const deriveModel = derive({
//     keys: (get) => new Promise((r) =>
//         setTimeout(() => r(Object.keys(snapshot(get(appStore.appModelWithReactive)))
//             .filter(key => ![""].includes(key))
//         ), 1000)
//     ),
// })

export const curSection = proxy({ curr: "basics" })

export const DataSection = () => {
  const { t } = useTranslation()
  // const {data: keys} = useResumeSchemaKeys()
  // const {keys} = useSnapshot(deriveModel)

  return (
    <div className="flex h-full flex-row">
      <DataSidebar />
      <DataSubSection />
    </div>
  )
}
