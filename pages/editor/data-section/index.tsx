import { Suspense } from "react"
import { DataSidebar } from "@/pages/editor/data-section/data-sidebar"
import { useTranslation } from "react-i18next"
import { proxy } from "valtio"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataSubSection } from "./sub-section"


export const DataSection = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full flex-row">
      <DataSidebar />
      <DataSubSection />
    </div>
  )
}
