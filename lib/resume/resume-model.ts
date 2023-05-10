import {AppResumeSchema, ResumeSchema} from "@/types"
import {join, set} from "lodash-es"
import {proxy, subscribe} from "valtio"

import {initialValue} from "../store"
import {fromApplication, intoApplication} from "./index"
import {appStore} from "@/pages/editor";
import {getResume} from "@/lib/resume/database";

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

  opsLog: OpsLog = {kind: OpsKind.INIT, time: Date.now()}

  private static LOCAL_KEY = "local-resume"
  private static OPS_KEY = "ops-logs"

  constructor(resume: any) {
    if (!resume) {
      resume = intoApplication(initialValue)
      console.log("initializing resume", resume)
    } else {
      resume = JSON.parse(resume)
    }
    this.appModelWithReactive = proxy({data: resume as AppResumeSchema})
    this.schemaModel = proxy({data: {} as ResumeSchema})


    subscribe(this.appModelWithReactive, async (ops) => {
      // ops
      //   .filter((op) => op[1].pop() === "content")
      //   .forEach(([_, path, val]) =>
      //     this.syncSchema(join(path, "."), val)
      //   )
      console.log("ops", ops)
      this.syncSchema()
      await this.persist()
    })

    this.syncSchema()
  }


  static loadResume() {
    const data = localStorage.getItem(this.LOCAL_KEY)
    return new ResumeModel(data)
  }

  syncSchema(path?: string, value?: unknown) {
    if (path && value) {
      set(this.schemaModel.data, path, value)
    } else {
      this.schemaModel.data = fromApplication(this.appModelWithReactive.data)
    }
  }

  async persist() {
    this.opsLog = {...this.opsLog, time: Date.now()}

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


export const takeResume = (id: number) => {
  appStore.appModelWithReactive.data = getResume(id)!
}
