import DataSidebar from "@/app/editor/data/sidebar"
import { useTranslation } from "react-i18next"

import { DataSubSection } from "./components/sub-section"

const DataSection = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full flex-row">
      <DataSidebar />
      <DataSubSection />
    </div>
  )
}

export default DataSection
