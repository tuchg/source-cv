import {proxy} from "valtio";
import {ResumeModel} from "@/lib/resume/resume-model";

export const appStore = ResumeModel.loadResume()

export const settingsStore = proxy({
  template: "jsonresume-theme-onepage-plus",
  html: "",
  lang: "en",
})

export const terminalChannel = proxy({msg: "", status: "初始化容器中。。。"})

export const curSection = proxy({curr: "basics"})
export const previewSectionSize = proxy({width: 0, height: 0})

export const guideContent = proxy({msg: ""})

