import { FC, useState } from "react"
import { curSection } from "@/pages/editor/data-section/index"
import { ResumeItem } from "@/types"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion"
import { get, set } from "lodash-es"
import { CheckCheck, PlusSquare } from "lucide-react"
import { useSnapshot } from "valtio"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { appStore } from "../index"
import { Item } from "./item"
import { ItemHeader } from "./item-header"

export const DataSubSection: FC<DataSubSectionProps> = ({ ...props }) => {
  const { curr } = useSnapshot(curSection)
  const section = useSnapshot(get(appStore.appModelWithReactive.data, curr))
  const [isAdding, setIsAdding] = useState(false)

  const renderGroup = () => {
    function onNewGroup() {
      if (isAdding) {
        onSave()
      } else {
        setIsAdding(true)
        set(appStore.appModelWithReactive.data, curr, [
          ...section,
          cloneObject(section[0]),
        ] as ResumeItem[])
      }
    }

    function onSave() {
      // set(appStore.appModelWithReactive.data, `${sectionKey}`, [...section, cloneObject(section[0])] as ResumeItem[])
      setIsAdding(false)
    }

    return (
      <Accordion type="single" collapsible defaultValue={"0"}>
        {(section as ResumeItem[]).map((item, i) => {
          const groupKey = `${curr}[${i}]._extra`
          return (
            <AccordionItem value={i.toString()} key={groupKey}>
              <AccordionTrigger className="capitalize">
                <ItemHeader itemKey={groupKey} isGroup />
              </AccordionTrigger>
              <AccordionContent>{renderItems(item, true, i)}</AccordionContent>
            </AccordionItem>
          )
        })}

        <div className="flex mt-2">
          <Button className="flex-1" variant={"ghost"} onClick={onNewGroup}>
            {isAdding ? <CheckCheck size={24} /> : <PlusSquare size={24} />}
          </Button>
        </div>
      </Accordion>
    )
  }
  const renderItems = (
    item: ResumeItem,
    inGroup: boolean = false,
    index?: number
  ) => (
    <div className="grid grid-cols-4 max-sm:grid-cols-2  gap-2 p-1">
      {Object.keys(item)
        .filter((key) => key !== "_extra")
        .sort((a, b) => item[a].sort - item[b].sort)
        .map((propKey, i) => {
          const itemKey = `${curr}${inGroup ? `[${index}]` : ""}.${propKey}`
          return <Item className="col-span-2" key={itemKey} itemKey={itemKey} />
        })}
    </div>
  )

  return (
    <ScrollArea className="flex-1 m-1">
      {Array.isArray(section)
        ? renderGroup()
        : renderItems(section as ResumeItem)}
    </ScrollArea>
  )
}

export interface DataSubSectionProps {
  // sectionKey: string
}

function cloneObject(obj: any) {
  const clone = {}
  if (Array.isArray(obj)) {
    return
  }
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (typeof obj[prop] === "object") {
        // @ts-ignore
        clone[prop] = cloneObject(obj[prop])
      } else {
        let value = obj[prop]
        if (prop === "content" || prop === "label") {
          if (Array.isArray(value)) {
            value = []
          }
          value = ""
        } else if (prop === "id" || prop === "sort") {
          value = value + 1
        }
        // @ts-ignore
        clone[prop] = value // 忽略值
      }
    }
  }
  return clone
}
