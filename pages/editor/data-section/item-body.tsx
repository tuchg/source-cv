import {FC} from "react"
import {ResumeItem, ResumeItemKind} from "@/types"
import {get} from "lodash-es"
import {useSnapshot} from "valtio"

import {ImgItem} from "./items/img-item"
import {TagsItem} from "./items/tags-item"
import {TextItem} from "./items/text-item"
import {TextareaItem} from "./items/textarea-item"
import {appStore} from "@/store";
import {ListItem} from "./items/list-item";

export const ItemBody: FC<ItemProps> = ({itemKey}) => {
  const {kind} = useSnapshot<ResumeItem>(
    get(appStore.appModelWithReactive.data, itemKey)!
  )
  switch (kind) {
    case ResumeItemKind.Text:
      return <TextItem itemKey={itemKey}/>
    case ResumeItemKind.TextArea:
      return <TextareaItem itemKey={itemKey}/>
    case ResumeItemKind.Image:
      return <ImgItem itemKey={itemKey}/>
    case ResumeItemKind.Link:
    case ResumeItemKind.Email:
    case ResumeItemKind.Phone:
    case ResumeItemKind.Date:
    case ResumeItemKind.DateRange:
      return <TextItem itemKey={itemKey}/>
    case ResumeItemKind.Tags:
      return <TagsItem itemKey={itemKey}/>
    case ResumeItemKind.List:
      return <ListItem itemKey={itemKey}/>

    default:
      return <div></div>
  }
}

export interface ItemProps {
  itemKey: string
}
