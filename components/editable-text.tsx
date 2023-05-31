import {useState} from "react"

import {Icons} from "@/components/icons"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {useSnapshot} from "valtio";
import {get, set} from "lodash-es";
import {appStore} from "@/store";
import {Textarea} from "@/components/ui/textarea";

export function EditableText({modelKey, propKey}) {
  const data = useSnapshot(get(appStore.appModelWithReactive.data, modelKey))
  const [isEditing, setIsEditing] = useState(false)

  const handleEditClick = () => {
    setIsEditing(true)
  }

  // @ts-ignore
  const handleTextChange = (e) => {
    // appStore.appModelWithReactive.data.meta._extra.title = e.target.value
    set(appStore.appModelWithReactive.data, `${modelKey}.${propKey}`, e.target.value)
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
      <div className="flex-1 flex flex-row justify-between space-x-1 items-center">
        {/*<Button className="h-8 px-1" variant="ghost"> <Icons.work size={16}/></Button>*/}
        {isEditing ? (
          <>
            {get(data,propKey).length>20?
              <Textarea
                value={get(data,propKey)}
                onChange={handleTextChange}
                onKeyDown={handleKeyPress}
              />:
              <Input
                className="w-40 h-8"
                value={get(data,propKey)}
                onChange={handleTextChange}
                onKeyDown={handleKeyPress}
              />
            }

            <Button className="h-8" variant="ghost" onClick={handleSaveClick}>
              <Icons.check size={16}/>
            </Button>
          </>
        ) : (
          <>
            <Label className="mr-1" onDoubleClick={handleEditClick}>
              {get(data,propKey)}
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
  )
}
