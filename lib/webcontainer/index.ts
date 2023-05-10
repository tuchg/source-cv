import { ResumeSchema } from "@/types"
import { WebContainer } from "@webcontainer/api"

import { pipeToConsole } from "./console"

let container: WebContainer
let themeStates: Map<string, boolean> = new Map()

export async function generateResume(name: string, resume: ResumeSchema) {
  try {
    await initWebContainer()
    await syncResumeChange(resume)
    await installTheme(name)
    return buildResume(name)
  } catch (error) {
    console.error("Builder >>>", error)
  }
}

export async function initWebContainer() {
  if (!container) {
    container = await WebContainer.boot()
    await container.mount(files)
    // Install resume-cli
    const process = await container.spawn("npm", ["install", "resume-cli"])
    pipeToConsole(process)
    await process.exit
  }
}

export async function syncResumeChange(resume: ResumeSchema) {
  return container.fs.writeFile("resume.json", JSON.stringify(resume))
}

export async function installTheme(theme: string) {
  if (themeStates.get(theme)) {
    return
  }
  const process = await container.spawn("npm", ["install", theme])
  pipeToConsole(process)
  await process.exit
  themeStates.set(theme, true)
}

export async function buildResume(theme: string) {
  // or serve
  const devProcess = await container.spawn("resume", [
    "export",
    "-f",
    "html",
    "-t",
    `./node_modules/${theme}/`,
    "resume.html",
  ])
  pipeToConsole(devProcess)
  const devStatus = await devProcess.exit

  if (devStatus === 0) {
    return container.fs.readFile("resume.html", "utf8")
  }
  return ""
}

/** @satisfies {import('@webcontainer/api').FileSystemTree} */
const files = {
  "package.json": {
    file: {
      contents: `{
  "name": "resume-app",
  "type": "module",
  "dependencies": {}}`,
    },
  },
}
