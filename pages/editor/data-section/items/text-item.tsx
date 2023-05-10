import { ChangeEvent, FC } from "react"
import { ResumeItem } from "@/types"
import { get, set } from "lodash-es"
import { useSnapshot } from "valtio"

import { Input } from "@/components/ui/input"
import { appStore } from "../../index"
import { ItemProps } from "../item-body"

export const TextItem: FC<ItemProps> = ({ itemKey }) => {
  const { content } = useSnapshot<ResumeItem>(
    get(appStore.appModelWithReactive.data, itemKey)!
  )

  function changeContent(e: ChangeEvent<HTMLInputElement>) {
    set(appStore.appModelWithReactive.data, `${itemKey}.content`, e.target.value)!
  }

  return <Input defaultValue={content as string} onChange={changeContent} />
}
