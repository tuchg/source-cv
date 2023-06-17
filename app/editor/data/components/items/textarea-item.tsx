import { FC } from "react"
import { useRewrite } from "@/services/space"
import { settingsStore } from "@/store"
import { appStore } from "@/store/model"
import { ResumeTextArea } from "@/types"
import { get, set } from "lodash-es"
import { RingLoader } from "react-spinners"
import { useSnapshot } from "valtio"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ItemProps } from "../item-body"

export const TextareaItem: FC<ItemProps> = ({ itemKey }) => {
  const { content } = useSnapshot<ResumeTextArea>(
    get(appStore.appModelWithReactive.data, itemKey)!
  )

  const { trigger, isMutating } = useRewrite()

  const onRewrite = async () => {
    const result = await trigger({
      text: content,
      jd: appStore.appModelWithReactive.data.meta._extra.jd ?? "",
      lang: settingsStore.lang,
    })

    console.log("润色结果：", result)
    set(appStore.appModelWithReactive.data, `${itemKey}.content`, result)
  }

  return (
    <div className="relative">
      <Textarea
        className="h-32 pr-[3rem]"
        value={content as string}
        onChange={(event) =>
          set(
            appStore.appModelWithReactive.data,
            `${itemKey}.content`,
            event.target.value
          )!
        }
      />
      <div className="absolute top-1 right-1 flex flex-row">
        <Button onClick={onRewrite} size="sm" variant="ghost">
          {isMutating ? <RingLoader size={20} /> : <Icons.wand size={18} />}
        </Button>
      </div>
    </div>
  )
}
