import { FC, HTMLAttributes } from "react"
import { appStore } from "@/store/model"
import { ResumeItem, ResumeItemKind } from "@/types"
import { get } from "lodash-es"
import { useSnapshot } from "valtio"

import { cn } from "@/lib/utils"
import { ItemBody } from "./item-body"
import { ItemHeader } from "./item-header"

export const Item: FC<ItemProps> = ({ className, itemKey }) => {
  const { kind } = useSnapshot<ResumeItem>(
    get(appStore.appModelWithReactive.data, itemKey)!
  )
  return (
    <div
      className={cn(
        "grid w-full items-center gap-1.5",
        className,
        [ResumeItemKind.TextArea, ResumeItemKind.List].includes(kind)
          ? "col-span-4"
          : "max-w-sm"
      )}
    >
      <ItemHeader itemKey={itemKey} isGroup={false} />
      <ItemBody itemKey={itemKey} />
    </div>
  )
}

export interface ItemProps extends HTMLAttributes<HTMLDivElement> {
  itemKey: string
}
