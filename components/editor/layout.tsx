import {Allotment} from "allotment"
import {Outlet} from "react-router"

import {EditorHeader} from "@/components/editor/header"
import {Sidebar} from "@/components/editor/sidebar"
import {PreviewSection} from "@/pages/preview-section";
import {Suspense} from "react";

interface LayoutProps {
  children: React.ReactNode
}

export function EditorLayout() {
  return (
    <div className="mx-auto flex h-screen flex-col">
      <EditorHeader/>
      <main className="flex-1 flex-row flex">

        <Allotment snap>
          <Suspense fallback={<div>数据加载。。。</div>}>
            <Outlet/>
          </Suspense>
          <Suspense fallback={<div>应用中。。。</div>}>
            <PreviewSection/>
          </Suspense>
        </Allotment>
      </main>
    </div>
  )
}
