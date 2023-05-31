import {FC, forwardRef} from "react"
import {ResumeItem} from "@/types"
import {get} from "lodash-es"
import {useTranslation} from "react-i18next"
import {useSnapshot} from "valtio"

import {Label} from "@/components/ui/label"
import {appStore} from "@/store";
import {IconDropdown} from "react-day-picker";
import {Separator} from "@/components/ui/separator";
import {Icons} from "@/components/icons";
import {EditableText} from "@/components/editable-text";
import {Button} from "@/components/ui/button";

export const ItemHeader: FC<ItemHeaderProps> = forwardRef(({itemKey, isGroup, onOpenChange, onDel}) => {
  const {label, bindingKey} = useSnapshot<ResumeItem>(
    get(appStore.appModelWithReactive.data, itemKey)!
  )

  const {t} = useTranslation()

  return <div>
    {isGroup ? <div className="mx-2 my-1 flex-1 w-full flex flex-row items-center justify-between">
        <EditableText modelKey={itemKey} propKey={"label"}/>
        <Button className="flex-1" variant="ghost" onClick={onOpenChange}> </Button>
        <Button variant="ghost" onClick={onDel}>
          <Icons.del size={16}/>
        </Button>
      </div> :
      <Label className="capitalize text-md">{label ?? t(bindingKey)}</Label>
    }
    {isGroup && <Separator/>}

  </div>
})
ItemHeader.displayName = "ItemHeader"

export interface ItemHeaderProps {
  itemKey: string
  isGroup: boolean,
  onOpenChange?: () => void
  onDel?: () => void
}
