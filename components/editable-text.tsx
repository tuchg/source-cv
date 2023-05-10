import {useState} from "react"

import {Icons} from "@/components/icons"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {useSnapshot} from "valtio";
import {appStore} from "@/pages/editor";
import {set} from "lodash-es";

export function EditableText() {
  const {title: text} = useSnapshot(appStore.appModelWithReactive.data.meta._extra)
  const [isEditing, setIsEditing] = useState(false)

  const handleEditClick = () => {
    setIsEditing(true)
  }

  // @ts-ignore
  const handleTextChange = (e) => {
    appStore.appModelWithReactive.data.meta._extra.title = e.target.value
  }

  const handleSaveClick = () => {
    setIsEditing(false)
  }

  const handleKeyPress = (e: any) => {
    switch (e.key) {
      case "Enter":
        handleSaveClick()
        break
      case "Escape":
        setIsEditing(false)
        break
    }
  }

  return (
    <div>
      <div className="flex flex-row justify-between space-x-1 items-center">
        {/*<Button className="h-8 px-1" variant="ghost"> <Icons.work size={16}/></Button>*/}
        {isEditing ? (
          <>
            <Input
              className="w-40 h-8"
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyPress}
            />
            <Button className="h-8" variant="ghost" onClick={handleSaveClick}>
              <Icons.check size={16}/>
            </Button>
          </>
        ) : (
          <>
            <Label className="mr-1" onDoubleClick={handleEditClick}>
              {text}
            </Label>
            <Button
              className="h-8 pl-0"
              variant="ghost"
              onClick={handleEditClick}
            >
              <Icons.edit size={16}/>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
