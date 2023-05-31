import {describe, it} from "vitest"

import {
  flattenResumeSchema,
  fromApplication,
  intoApplication,
} from "@/lib/resume"
import {initialValue} from "@/lib/store"
import {executeGPT} from "@/lib/gpt/drafter";


describe("resume", () => {
  it('should be run', function () {
    executeGPT()
  });
})
