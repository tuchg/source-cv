import { useEffect, useRef, useState } from "react"
import { useTemplate } from "@/hooks/use-template"
import { proxy, useSnapshot } from "valtio"

import { appStore, settingsStore } from "./editor"

const width = 794
const height = 1123
const ori = Math.sqrt(width ** 2 + height ** 2)
export const previewSectionSize = proxy({ width: 0, height: 0 })

export const PreviewSection = () => {
  const { data: resume } = useSnapshot(appStore.schemaModel)

  const { template } = useSnapshot(settingsStore)
  const { data: html, isLoading } = useTemplate(template)
  const { width: secWidth, height: secHeight } = useSnapshot(previewSectionSize)

  const [scale, setScale] = useState(0.8)
  const wrapperRef = useRef<HTMLDivElement>(
    document.getElementsByClassName("preview")[0] as HTMLDivElement
  )
  const transformRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!secWidth && !secHeight) return
    let newScale = Number.parseFloat(
      (Math.sqrt(secWidth ** 2 + secHeight ** 2) / ori).toPrecision(2)
    )
    const offset = newScale > 0.5 ? 0.2 : 0.1
    setScale(newScale + offset)
  }, [secWidth, secHeight])

  return (
    <div
      className="p-2 bg-gray h-full w-[1080px] overflow-scroll"
      ref={wrapperRef}
    >
      <div
        ref={transformRef}
        className={`${
          scale > 0.8 ? "origin-[top_center]" : "origin-top-left"
        } overflow-auto`}
        style={{
          transform: `scale(${scale})`,
          boxShadow: "0 0 0.5cm rgba(0, 0, 0, 0.5)",
        }}
      >
        <iframe
          title=""
          srcDoc={html}
          id={previewSectionId}
          // className=" max-w-screen-lg aspect-[21/29.7] z-10 border-0 w-[21cm] min-h-[200vh] overflow-hidden mx-auto">
          className=" aspect-[21/29.7] z-10 border-0 min-h-[200vh] overflow-hidden mx-auto  max-w-screen-lg"
        ></iframe>
      </div>
    </div>
  )
}

PreviewSection.whyDidYouRender = false

const previewSectionId = "preview-area"
export const print = () => {
  // todo: pref->use previewRef
  const iframe = (document.getElementById(
    previewSectionId
  ) as HTMLIFrameElement)!.contentWindow!
  iframe.focus()
  iframe.print()
}

export const share = () => {
  // 获取 iframe 元素
  const iframe = document.getElementById(previewSectionId) as HTMLIFrameElement

  // 获取 iframe 中的文档对象
  const iframeDoc = iframe.contentDocument || iframe.contentWindow!.document

  // 获取 iframe 中的 HTML 内容
  const iframeHtml = iframeDoc.documentElement.outerHTML

  // 使用 window.open() 方法将 HTML 内容打开到新窗口
  window.open()?.document.write(iframeHtml)
}
