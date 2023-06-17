import { proxy } from "valtio"

export const settingsStore = proxy({
  template: "jsonresume-theme-onepage-plus",
  lang: "en",
  html: "",
})

export const terminalChannel = proxy({ msg: "", status: "初始化容器中。。。" })

export const curSection = proxy({ curr: "basics" })
export const previewSectionSize = proxy({ width: 0, height: 0 })
export const guideContent = proxy({ msg: "" })
