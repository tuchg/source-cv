import { FC, useState } from "react"
import { appStore } from "@/store/model"
import { ResumeItem, ResumeTags } from "@/types"
import { get, set } from "lodash-es"
import { useSnapshot } from "valtio"

import { Icons } from "@/components/icons"
import { ItemProps } from "../item-body"

export const TagsItem: FC<ItemProps> = ({ itemKey }) => {
  const { content } = useSnapshot<ResumeTags>(
    get(appStore.appModelWithReactive.data, itemKey)!
  )

  const [isEditing, setIsEditing] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [editValue, setEditValue] = useState("")
  const [newTagValue, setNewTagValue] = useState("")

  const handleTagClick = (index: number) => {
    setIsEditing(true)
    setEditIndex(index)
    setEditValue(content[index])
  }

  const handleInputChange = (event) => {
    setEditValue(event.target.value)
  }

  const handleInputBlur = () => {
    // Update the tag in the content array
    set(
      appStore.appModelWithReactive.data,
      `${itemKey}.content[${editIndex}]`,
      editValue
    )
    setIsEditing(false)
    setEditIndex(null)
  }

  const handleDelete = (index) => {
    // Remove the tag from the content array
    ;(
      get(appStore.appModelWithReactive.data, `${itemKey}.content`)! as string[]
    ).splice(index, 1)
  }

  const handleNewTagChange = (event) => {
    setNewTagValue(event.target.value)
  }

  const handleAddTag = () => {
    ;(
      get(appStore.appModelWithReactive.data, `${itemKey}.content`)! as string[]
    ).push(newTagValue)
    setNewTagValue("")
  }

  return (
    <div>
      {(content as string[])?.map((item, index) => (
        <div
          key={index}
          className="m-1 justify-between text-xs inline-flex items-center font-bold leading-sm px-3 py-1 bg-blue-200 text-blue-700 rounded-full"
          onClick={() => handleTagClick(index)}
        >
          {index === editIndex ? (
            <textarea
              value={editValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              autoFocus
            />
          ) : (
            <>
              {item}
              <button className="ml-2" onClick={() => handleDelete(index)}>
                <Icons.del />
              </button>
            </>
          )}
        </div>
      ))}
      <div className="flex flex-row mt-2">
        <input
          type="text"
          value={newTagValue}
          onChange={handleNewTagChange}
          placeholder="输入新标签"
        />
        <button onClick={handleAddTag}>
          <Icons.plus />
        </button>
      </div>
    </div>
  )
}
