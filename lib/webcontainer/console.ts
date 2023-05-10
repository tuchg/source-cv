import { WebContainerProcess } from "@webcontainer/api"

export function pipeToConsole(process: WebContainerProcess) {
  process.output.pipeTo(
    new WritableStream({
      write(data) {
        console.log(data)
      },
    })
  )
}
