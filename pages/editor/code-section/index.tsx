import React, {useEffect, useRef} from "react"
import {useTemplate} from "@/hooks/use-template"
import MonacoEditor, {Monaco} from "@monaco-editor/react"
import {useSnapshot} from "valtio"

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {appStore, settingsStore} from "../index"

export default function () {
  const {template} = useSnapshot(settingsStore)
  const json = useSnapshot(appStore.schemaModel)
  const {data:html} = useTemplate(template)
  const editorRef = useRef(null)

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    editorRef.current = editor
    const handler = editor.onDidChangeModelDecorations((_) => {
      handler.dispose()
      editor.getAction("editor.action.formatDocument").run()
    })
  }

  return (
    <Tabs defaultValue="password" className="mb-1 w-full">
      <TabsList>
        <TabsTrigger value="account">JSON</TabsTrigger>
        <TabsTrigger value="password">HTML</TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <MonacoEditor
          language="json"
          height={1000}
          value={JSON.stringify(json.data, null, 2)}
          onChange={(e) => {
            appStore.schemaModel.data = JSON.parse(e)
          }}
          options={{
            automaticLayout: true,
            bracketPairColorization: {
              enabled: true,
            },
          }}
          onMount={handleEditorDidMount}
        />
      </TabsContent>

      <TabsContent value="password">
        <MonacoEditor
          language="html"
          value={html}
          height={1000}
          options={{
            automaticLayout: true,
            bracketPairColorization: {
              enabled: true,
            },
          }}
          onMount={handleEditorDidMount}
        />
      </TabsContent>
    </Tabs>
  )
}
