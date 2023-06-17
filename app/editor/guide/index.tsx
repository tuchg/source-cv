import React, { useEffect, useRef, useState } from "react"
import { guideContent, settingsStore } from "@/store"
import { appStore } from "@/store/model"
import { BotIcon, SidebarCloseIcon } from "lucide-react"
import { BeatLoader } from "react-spinners"
import { useSnapshot } from "valtio"

import { guideResume } from "@/lib/gpt/gpt-langchain"
import { flattenResumeSchema } from "@/lib/resume"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const Guide = () => {
  const { jd, lang } = useSnapshot(
    appStore.appModelWithReactive.data.meta._extra
  )

  const [, setSaveLoading] = useState(false)
  const [guideLoading, setGuideLoading] = useState(false)
  const { msg } = useSnapshot(guideContent)
  const msgRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    msgRef.current!.scrollTop = msgRef.current!.scrollHeight
  }, [msg])

  const onMake = async () => {
    setSaveLoading(true)
    // await draftResume(jd,lang, appStore.schemaModel.data)
    setSaveLoading(false)
  }
  const onGuide = async () => {
    setGuideLoading(true)
    guideContent.msg = ""
    await guideResume(
      jd!,
      flattenResumeSchema(appStore.schemaModel.data),
      settingsStore.lang
    )
    setGuideLoading(false)
  }

  return (
    <div className="grid w-full gap-3 m-1 container">
      <div className=" relative flex items-center p-3 border-b border-gray-300">
        <img
          className="object-cover w-10 h-10 rounded-full"
          src="https://poe.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FchatGPTAvatar.04ed8443.png&w=48&q=75"
          alt="username"
        />
        <span className="block ml-2 font-bold text-gray-600">
          ChatGPT AI简历辅导
        </span>
        <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3" />
        <div className="absolute right-0 mr-3"></div>
      </div>
      <div className="flex justify-between self-center">
        <Label htmlFor="message-2">岗位描述</Label>
        <SidebarCloseIcon size={16} />
      </div>
      <Textarea
        value={jd}
        onChange={(e) =>
          (appStore.appModelWithReactive.data.meta._extra.jd = e.target.value)
        }
        className="h-[15rem]"
        placeholder="输入想要应聘的工作描述"
        id="message-2"
      />
      <p className="text-sm text-slate-500">
        <BotIcon size={18} className="inline-block mr-1" />
      </p>
      <div className="flex justify-between space-x-4">
        <Button onClick={onGuide} className="w-full" variant="secondary">
          {" "}
          {guideLoading ? (
            <BeatLoader className="m-auto block" size={8} color="#fff" />
          ) : (
            "简历指导建议"
          )}{" "}
        </Button>
      </div>

      <Textarea
        ref={msgRef}
        readOnly
        className="resize-none bg-white leading-7 h-[20rem] border border-dashed border-blue-600 first-line:indent-2 focus:ring-transparent"
        value={msg}
      />
    </div>
  )
}

export default Guide
