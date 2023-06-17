import { initialValue } from "@/services/data"
import { AppResumeSchema, ResumeSchema } from "@/types"
import { set } from "lodash-es"
import { proxy, subscribe } from "valtio"

import { fromApplication, intoApplication } from "@/lib/resume"
import { getResume, syncResumes } from "@/lib/resume/database"

export class ResumeModel {
  /**
   *  a reactive model of the application state
   */
  // @ts-ignore
  appModelWithReactive: { data: AppResumeSchema }

  /**
   *  a reactive model of the resume template
   *
   */
  // @ts-ignore
  schemaModel: { data: ResumeSchema }

  /**
   * a non-reactive model of the resume template
   */

  opsLog: OpsLog = { kind: OpsKind.INIT, time: Date.now() }

  private static LOCAL_KEY = "local-resume"
  private static OPS_KEY = "ops-logs"

  constructor(resume: any) {
    if (!resume) {
      resume = intoApplication(initialValue)
      console.log("initializing resume", resume)
    } else {
      resume = JSON.parse(resume)
    }
    this.appModelWithReactive = proxy({ data: resume as AppResumeSchema })
    this.schemaModel = proxy({ data: {} as ResumeSchema })

    subscribe(this.appModelWithReactive, async (ops) => {
      console.log("ops", ops)
      this.syncSchema()
      await this.persist()
    })

    this.syncSchema(true)
  }

  static loadResume() {
    const data = localStorage.getItem(this.LOCAL_KEY)
    return new ResumeModel(data)
  }

  syncSchema(first?: boolean, path?: string, value?: unknown) {
    if (path && value) {
      set(this.schemaModel.data, path, value)
    } else {
      console.log("syncing schema")
      this.schemaModel.data = fromApplication(this.appModelWithReactive.data)
      if (!first && this.appModelWithReactive.data) {
        syncResumes(this.appModelWithReactive.data)
      }
    }
  }

  async persist() {
    this.opsLog = { ...this.opsLog, time: Date.now() }

    localStorage.setItem(ResumeModel.OPS_KEY, JSON.stringify(this.opsLog))
    localStorage.setItem(
      ResumeModel.LOCAL_KEY,
      JSON.stringify(this.appModelWithReactive.data)
    )
    // TODO: save to db
  }
}

export enum OpsKind {
  INIT,
  UPDATE,
  DELETE,
}

export interface OpsLog {
  kind: OpsKind
  time: number
}

export const takeResume = (id: string) => {
  appStore.appModelWithReactive.data = getResume(id)!
}

export const schemaToResume = () => {
  if (appStore.schemaModel.data)
    appStore.appModelWithReactive.data = intoApplication(
      appStore.schemaModel.data
    )
}

export const appStore = ResumeModel.loadResume()
