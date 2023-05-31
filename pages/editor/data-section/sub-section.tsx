import {FC, useState} from "react"
import {ResumeItem} from "@/types"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion"
import {get, set} from "lodash-es"
import {CheckCheck, PlusSquare} from "lucide-react"
import {useSnapshot} from "valtio"

import {Button} from "@/components/ui/button"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Item} from "./item"
import {ItemHeader} from "./item-header"
import {randomId} from "@/lib/utils";
import {appStore, curSection} from "@/store";
import {Icons} from "@/components/icons";

export const DataSubSection: FC<DataSubSectionProps> = ({...props}) => {
  const {curr} = useSnapshot(curSection)
  const section = useSnapshot(get(appStore.appModelWithReactive.data, curr))
  const [accordionValue, setAccordionValue] = useState("0")
  const [isAdding, setIsAdding] = useState(false)

  const renderGroup = () => {
    function onNewGroup() {
      if (isAdding) {
        onSave()
      } else {
        setIsAdding(true)
        let cloneObject1 = cloneObject(section[0])! as ResumeItem;
        cloneObject1._extra.label = "新建项"
        cloneObject1._extra.id = randomId()

        console.log(cloneObject1)
        // set(appStore.appModelWithReactive.data, curr, [
        //   ...section,
        //   cloneObject1,
        // ] as ResumeItem[])
        let group = get(appStore.appModelWithReactive.data, curr);
        group
          .push(cloneObject1)
        setAccordionValue((section.length).toString())
      }
    }

    function onSave() {
      // set(appStore.appModelWithReactive.data, `${sectionKey}`, [...section, cloneObject(section[0])] as ResumeItem[])
      setIsAdding(false)
    }

    function onGroupOpenChange(groupKey: string) {
      if (accordionValue===groupKey){
        setAccordionValue("")
      }else{
        setAccordionValue(groupKey)
      }
    }

    function onGroupDel(groupKey: string,index:number) {
      get(appStore.appModelWithReactive.data, curr)!.splice(index,1)
    }

    return (
      <Accordion type="single" collapsible value={accordionValue} onValueChange={setAccordionValue}>
        {(section as ResumeItem[]).map((item, i) => {
          const groupKey = `${curr}[${i}]._extra`
          return (
            <AccordionItem value={i.toString()} key={groupKey}>
              <AccordionTrigger asChild>
                <ItemHeader itemKey={groupKey} isGroup onOpenChange={() => onGroupOpenChange(i.toString())}
                            onDel={() => onGroupDel(groupKey,i)}/>
              </AccordionTrigger>
              <AccordionContent asChild>{renderItems(item, true, i)}</AccordionContent>
            </AccordionItem>
          )
        })}

        <div className="flex mt-4">
          <Button className="flex-1" variant={"ghost"} onClick={onNewGroup}>
            {isAdding ? <CheckCheck size={24}/> : <PlusSquare size={24}/>}
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
          return <Item className="col-span-2" key={itemKey} itemKey={itemKey}/>
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
          } else {
            value = ""
          }
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
