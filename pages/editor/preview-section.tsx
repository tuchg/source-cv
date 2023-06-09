import { useEffect, useRef, useState } from "react"
import { useTemplate } from "@/hooks/use-template"
import { appStore, previewSectionSize, settingsStore } from "@/store"
import { drawHTML } from "rasterizehtml"
import { proxy, useSnapshot } from "valtio"

import { tryTemplate } from "@/lib/resume/database"

const width = 794
const height = 1123
const ori = Math.sqrt(width ** 2 + height ** 2)

export const PreviewSection = () => {
  const { template } = useSnapshot(settingsStore)

  const { html } = useTemplate(template)

  const { data } = useSnapshot(appStore.schemaModel)

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

  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef) {
      // TODO: When the result is too large, it will exceed the size limit of the local storage.
      console.log("通知更新")
      console.log("开始截图")
      const canvas = document.getElementById("canvas")
      drawHTML(html, canvas as HTMLCanvasElement).then(function (result) {
        tryTemplate(template, result.image.src)
      })

      // html2canvas(iframeRef.current!.contentDocument.body,
      //   {
      //     // useCORS: true,
      //     allowTaint: true,
      //   }
      // )
      //   .then(canvas => {
      //     tryTemplate(template, canvas.toDataURL())
      //   })
    }
  }, [html])

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
          ref={iframeRef}
          title=""
          srcDoc={html}
          id={previewSectionId}
          // className=" max-w-screen-lg aspect-[21/29.7] z-10 border-0 w-[21cm] min-h-[200vh] overflow-hidden mx-auto">
          className=" aspect-[21/29.7] z-10 border-0 min-h-[200vh] overflow-hidden mx-auto  max-w-screen-lg"
        />
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
