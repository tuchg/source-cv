import { describe, it } from "vitest"

import { executeGPT } from "@/lib/gpt/drafter"
import {
  flattenResumeSchema,
  fromApplication,
  intoApplication,
} from "@/lib/resume"
import { initialValue } from "@/lib/store"

describe("resume", () => {
  it("should be run", function () {
    executeGPT()
  })
})
