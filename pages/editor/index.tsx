import { Allotment } from "allotment"

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { DataSection } from "./data-section"
import GPTSection from "./gpt-section"
import {
  PreviewSection,
  previewSectionSize,
  print,
  share,
} from "../preview-section"
import "allotment/dist/style.css"
import { Suspense, useRef, useState } from "react"
import { useSize } from "ahooks"
import { proxy } from "valtio"

import { ResumeModel } from "@/lib/resume/resume-model"
import ChatSection from "./chat-section"
import CodeSection from "./code-section"

export const appStore = ResumeModel.loadResume()
export const settingsStore = proxy({
  template: "jsonresume-theme-stackunderflow",
})

export const Editor = () => {
  const containerRef = useRef(null)
  const containerSize = useSize(containerRef)
  const [section, switchSection] = useState("")
  const [transfer, setTransfer] = useState(false)

  const onPanelChange = (sizes: number[]) => {
    if (!containerSize?.width || !containerSize?.height) return

    previewSectionSize.width = containerSize!.width - sizes[0]
    previewSectionSize.height = containerSize!.height - sizes[1]
  }
  const dataSection = () => {
    switch (section) {
      case "gen":
        return <GPTSection />
      case "interview":
        return <ChatSection />
      case "code":
        return <CodeSection />
      default:
        return <DataSection />
    }
  }

  const elems = [
    <Allotment.Pane key="1" className="pt-1 px-2">
      {dataSection()}
    </Allotment.Pane>,
    <Allotment.Pane key="2" className="pt-1 px-2">
      <Suspense fallback={<div className="mx-auto">Loading</div>}>
        <PreviewSection />
      </Suspense>
    </Allotment.Pane>,
  ]

  return (
    <div
      className="overflow-auto h-screen w-full bg-fixed bg-cover overflow-x-hidden bg-[center_bottom]"
      ref={containerRef}
      style={{
        backgroundImage: "url('https://webcontainers.io/img/0001-8-2.jpg')",
      }}
    >
      <Menubar className="m-1">
        <MenubarMenu>
          <MenubarTrigger onClick={() => switchSection("")}>
            Data
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger onClick={() => switchSection("code")}>
            Source
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger onClick={() => setTransfer(!transfer)}>
            Swap
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger> Copilot</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => switchSection("gen")}>
              简历指导
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => switchSection("interview")}>
              面试模拟
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger onClick={print}>Print</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger onClick={share}>Share</MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Template</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => (settingsStore.template = "apage")}>
              APAGE
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => (settingsStore.template = "kendall")}>
              KENALL
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <Allotment snap onChange={onPanelChange}>
        {transfer ? elems.reverse() : elems}
      </Allotment>
    </div>
  )
}
