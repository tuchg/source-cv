import { appStore } from "@/store/model"
import { ResumeItem, ResumeList } from "@/types"
import { get } from "lodash-es"
import { useSnapshot } from "valtio"

import { EditableText } from "@/components/editable-text"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { List } from "@/components/ui/typography"

export const ListItem = ({ itemKey }) => {
  const { content } = useSnapshot<ResumeList>(
    get(appStore.appModelWithReactive.data, itemKey)!
  )

  const handleAddContent = () => {
    get(appStore.appModelWithReactive.data, itemKey).content.push("新亮点")
  }

  const handleDelContent = (index: number) => {
    get(appStore.appModelWithReactive.data, itemKey).content.splice(index, 1)
  }

  return (
    <List>
      {content.map((item, index) => (
        <li key={index}>
          <div className="flex flex-row justify-between items-center">
            <EditableText modelKey={itemKey} propKey={`content[${index}]`} />
            <Button
              className="h-8"
              variant="ghost"
              onClick={() => handleDelContent(index)}
            >
              <Icons.del size={16} />
            </Button>
          </div>
        </li>
      ))}
      <li key="add" className="flex">
        <Button className="h-8" variant="secondary" onClick={handleAddContent}>
          <Icons.plus size={16} />
        </Button>
      </li>
    </List>
  )
}
