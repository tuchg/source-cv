import { WebContainerProcess } from "@webcontainer/api"
import {terminalChannel} from "@/store";

export function pipeToConsole(process: WebContainerProcess) {
  process.output.pipeTo(
    new WritableStream({
      write(data) {
        console.log(data)
        terminalChannel.msg=data
      },
    })
  )
}
