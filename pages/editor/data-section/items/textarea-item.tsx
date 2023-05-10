import { FC } from "react"
import { ResumeItem } from "@/types"
import { get, set } from "lodash-es"
import { proxy, useSnapshot } from "valtio"

import { Textarea } from "@/components/ui/textarea"
import { appStore } from "../../index"
import { ItemProps } from "../item-body"

export const TextareaItem: FC<ItemProps> = ({ itemKey }) => {
  const { content } = useSnapshot<ResumeItem>(
    get(appStore.appModelWithReactive.data, itemKey)!
  )

  return (
    <Textarea
      className="h-96 w-11/12"
      defaultValue={content as string}
      onChange={(event) =>
        set(
          appStore.appModelWithReactive.data,
          `${itemKey}.content`,
          event.target.value
        )!
      }
    />
  )
}
