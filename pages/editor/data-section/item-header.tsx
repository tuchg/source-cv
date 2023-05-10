import { FC } from "react"
import { ResumeItem } from "@/types"
import { get } from "lodash-es"
import { useTranslation } from "react-i18next"
import { useSnapshot } from "valtio"

import { Label } from "@/components/ui/label"
import { appStore } from "../"

export interface ItemHeaderProps {
  itemKey: string
  isGroup: boolean
}

export const ItemHeader: FC<ItemHeaderProps> = ({ itemKey, isGroup }) => {
  const { label, bindingKey } = useSnapshot<ResumeItem>(
    get(appStore.appModelWithReactive.data, itemKey)!
  )
  const { t } = useTranslation()
  return <Label className="capitalize text-md">{label ?? t(bindingKey)}</Label>
}
