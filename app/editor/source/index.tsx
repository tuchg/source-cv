import React, { Suspense, useRef } from "react"
import { useTemplate } from "@/hooks/use-template"
import { settingsStore } from "@/store"
import { appStore } from "@/store/model"
import MonacoEditor, { Monaco } from "@monaco-editor/react"
import { useSnapshot } from "valtio"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Source = () => {
  return (
    <Tabs defaultValue="account" className="mb-1 w-full">
      <TabsList>
        <TabsTrigger value="account">JSON</TabsTrigger>
        <TabsTrigger value="password">HTML</TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <JSONEditor />
      </TabsContent>

      <TabsContent value="password">
        <Suspense fallback={<div>Loading..</div>}>
          <HTMLEditor />
        </Suspense>
      </TabsContent>
    </Tabs>
  )
}

function JSONEditor() {
  const editorRef = useRef(null)
  const json = useSnapshot(appStore.schemaModel)

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    editorRef.current = editor
    const handler = editor.onDidChangeModelDecorations((_: unknown) => {
      handler.dispose()
      editor.getAction("editor.action.formatDocument").run()
    })
  }

  // useEffect(()=>{
  //   console.log(json.data)
  // },[json])
  return (
    <MonacoEditor
      language="json"
      height={1000}
      value={JSON.stringify(json.data, null, 2)}
      onChange={(e) => {
        appStore.schemaModel.data = JSON.parse(e as string)
      }}
      options={{
        automaticLayout: true,
        bracketPairColorization: {
          enabled: true,
        },
      }}
      onMount={handleEditorDidMount}
    />
  )
}

function HTMLEditor() {
  const { template } = useSnapshot(settingsStore)

  const editorRef = useRef(null)
  const { html } = useTemplate(template)

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    editorRef.current = editor
    const handler = editor.onDidChangeModelDecorations((_: unknown) => {
      handler.dispose()
      editor.getAction("editor.action.formatDocument").run()
    })
  }

  return (
    <MonacoEditor
      language="html"
      height={1000}
      value={html}
      onChange={(e) => (settingsStore.html = e as string)}
      options={{
        automaticLayout: true,
        bracketPairColorization: {
          enabled: true,
        },
      }}
      onMount={handleEditorDidMount}
    />
  )
}

export default Source
