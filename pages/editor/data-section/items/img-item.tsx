import { FC } from "react"
import { ResumeItem } from "@/types"
import { get, set } from "lodash-es"
import { useSnapshot } from "valtio"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { appStore } from "../../index"
import { ItemProps } from "../item-body"

export const ImgItem: FC<ItemProps> = ({ itemKey }) => {
  const { content } = useSnapshot<ResumeItem>(
    get(appStore.appModelWithReactive.data, itemKey)!
  )
  const handleAvatarClick = () => {
    // 打开文件选择器
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.addEventListener("change", handleFileSelected)
    input.click()
  }
  const handleFileSelected = (event: any) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        set(appStore.appModelWithReactive.data, itemKey + ".content", reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Avatar className="h-[8rem] w-[8rem]" onClick={handleAvatarClick}>
      <AvatarImage src={content as string} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}
