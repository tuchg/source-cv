import React, { useEffect, useRef } from "react"
import { Terminal } from "xterm"

import "xterm/css/xterm.css"
import { terminalChannel } from "@/store"
import { useSafeState } from "ahooks"
import { CircleLoader } from "react-spinners"
import { subscribe, useSnapshot } from "valtio"
import { FitAddon } from "xterm-addon-fit"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const TerminalLoader = ({}) => {
  const terminalRef = useRef(null)
  const { status } = useSnapshot(terminalChannel)

  useEffect(() => {
    const terminal = new Terminal({ theme: { background: "#616161" } })
    const fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)

    if (terminalRef.current) {
      terminal.open(terminalRef.current)
      fitAddon.fit()

      subscribe(terminalChannel, () => {
        terminal.write(terminalChannel.msg)
      })
      // // 模拟终端进度更新，这里使用定时器进行演示
      // const timer = setInterval(() => {
      //   const progress = Math.floor(Math.random() * 100);
      //   terminal.write(`Progress: ${progress}%\r\n`);
      //
      //   // 当进度达到100时，关闭对话框
      //   if (progress === 100) {
      //     clearInterval(timer);
      //   }
      // }, 500);
    }

    return () => {
      // 在组件卸载时清理终端实例
      terminal.dispose()
    }
  }, [])

  return (
    <Card className=" my-[15rem] mx-auto w-[35rem]">
      <CardHeader>
        <CardTitle className="inline-flex items-center">
          模版加载中，请稍后 <CircleLoader className="m-auto block" />
        </CardTitle>
        <CardDescription>{status}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <div
            style={{ height: "5rem" }}
            className="terminal-container"
            ref={terminalRef}
          ></div>
        </p>
      </CardContent>
    </Card>
  )
}

export default TerminalLoader
