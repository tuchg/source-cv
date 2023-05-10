import { describe, it } from "vitest"

import {
  flattenResumeSchema,
  fromApplication,
  intoApplication,
} from "@/lib/resume"
import { initialValue } from "@/lib/store"
