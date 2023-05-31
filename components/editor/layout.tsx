import {Allotment} from "allotment"
import {Outlet} from "react-router"
import "allotment/dist/style.css";
import {EditorHeader} from "@/components/editor/header"
import {Suspense, useState} from "react";
import TerminalLoader from "@/components/term-loader";
import {PreviewSection} from "@/pages/preview-section";

export function EditorLayout() {
  const [isReverse,setIsReverse]=useState(false)
  const panes=[
    <Suspense key="0"  fallback={<div>数据加载。。。</div>}>
      <Outlet/>
    </Suspense>
      ,
    <Suspense key="1"  fallback={<TerminalLoader/>}>
      <PreviewSection/>
      {/*<TerminalLoader/>*/}
    </Suspense>
  ]

  const handleSwap=()=>{
    console.log("swap",panes)
    setIsReverse(!isReverse)
  }

  return (
    <div className="mx-auto flex h-screen flex-col">
      <EditorHeader onSwap={handleSwap}/>
      <main className="flex-1 flex-row flex">
        <Allotment snap >
          {isReverse?panes.reverse():panes}
        </Allotment>
      </main>
    </div>
  )
}
