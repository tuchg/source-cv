import { FC } from "react"
import { ResumeItem } from "@/types"
import { get } from "lodash-es"
import { useSnapshot } from "valtio"

import { appStore } from "../../index"
import { ItemProps } from "../item-body"

export const TagsItem: FC<ItemProps> = ({ itemKey }) => {
  const { content } = useSnapshot<ResumeItem>(
    get(appStore.appModelWithReactive.data, itemKey)!
  )

  return (
    <div>
      {(content as string[]).map((item, index) => (
        <div
          key={index}
          className="m-1 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-blue-200 text-blue-700 rounded-full"
        >
          {item}
        </div>
      ))}
    </div>
  )
}
