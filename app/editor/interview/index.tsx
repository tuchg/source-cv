import { useState } from "react"
import { appStore } from "@/store/model"
import { useMount } from "ahooks"
import { CircleDot } from "lucide-react"
import { useSnapshot } from "valtio"

import { firstAsk, resp } from "@/lib/gpt/interviewer"
import { flattenResumeSchema } from "@/lib/resume"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const Interview = () => {
  const [state, setState] = useState(true)
  const { jd } = useSnapshot(appStore.appModelWithReactive.data.meta._extra)

  return (
    <div className="container mx-auto m-1 w-full">
      <div className=" relative flex items-center p-3 border-b border-gray-300">
        <img
          className="object-cover w-10 h-10 rounded-full"
          src="https://github.com/shadcn.png"
          onClick={() => setState(true)}
          alt="username"
        />
        <span className="block ml-2 font-bold text-gray-600">
          ChatGPT AI面试官
        </span>
        <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3" />
        <div className="absolute right-0 mr-3">
          <Button variant="outline" onClick={() => setState(false)}>
            {jd?.length && !state ? (
              "职位：后台开发"
            ) : (
              <>
                {" "}
                <CircleDot size={14} /> <span>准备好了</span>
              </>
            )}
          </Button>
        </div>
      </div>
      {state ? <StartSection /> : <ChatArea />}
    </div>
  )
}

// @ts-ignore
const StartSection = () => {
  const { jd } = useSnapshot(appStore.appModelWithReactive.data.meta._extra)

  return (
    <div className="grid w-full gap-3 pt-2">
      <div className="flex justify-between self-center">
        <Label htmlFor="message-2">请输入你想要面试的岗位描述</Label>
      </div>
      <Textarea
        value={jd}
        onChange={(e) =>
          (appStore.appModelWithReactive.data.meta._extra.jd = e.target.value)
        }
        className="h-[40vh]"
        placeholder="Type your JD here."
        id="message-2"
      />
      <p className="text-sm text-slate-500">
        我将以根据岗位描述结合个人简历进行模拟面试，准备好后请点击按钮，开始面试
      </p>
    </div>
  )
}

// @ts-ignore
const ChatArea = () => {
  const [messages, setMessages] = useState([""])
  const [question, setQuestion] = useState("")
  const { jd } = useSnapshot(appStore.appModelWithReactive.data.meta._extra)

  useMount(async () => {
    const res = await firstAsk(
      jd!,
      flattenResumeSchema(appStore.schemaModel.data)
    )
    setMessages([res.response])
  })

  const onSend = async () => {
    setMessages([...messages, question])
    const res = await resp(question)
    setMessages([...messages, question, res.response])
    setQuestion("")
  }

  return (
    <>
      <div className="relative w-full p-6 overflow-y-auto h-[80vh]">
        <ul className="space-y-2">
          {messages.map((message, index) => (
            <li
              key={index}
              className={`flex ${index % 2 ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-xl px-4 py-2 text-gray-700 rounded  shadow ${
                  index % 2 ? "" : "bg-gray-50"
                }`}
              >
                <span className="block">{message}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
        <Button variant={"ghost"} size={"sm"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </Button>
        <Button variant={"ghost"} size={"sm"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </Button>

        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Message"
          className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              setQuestion("")
              await onSend()
            }
          }}
          name="message"
          required
        />

        <Button variant={"ghost"} size={"sm"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </Button>

        <Button type="submit" variant={"ghost"} onClick={onSend} size={"sm"}>
          <svg
            className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </Button>
      </div>
    </>
  )
}

export default Interview
