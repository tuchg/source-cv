import {
  ResumeDate,
  ResumeEmail,
  ResumeImage,
  ResumeItem,
  ResumeLink,
  ResumeNumber,
  ResumePhone,
  ResumeTags,
  ResumeText,
  ResumeTextArea,
} from "./resume-item"
import { ResumeSchema } from "./resume-schema"

/**
 * The final schema type that can be used in the application
 */
export type AppResumeSchema = IntoApplicationSchema<
  ResumeSchema & { meta: SectionExtra },
  never
> & {
  meta: {
    _extra: AppResumeDBMeta
  }
}
export type AppResumeDBMeta={
  id: number
  title: string
  description: string
  preview: string
  lang: string
  create_at?: Date
  update_at?: Date
}
/**
 * Convert a schema to the corresponding schema that can be used in the application
 *
 * @template T the original schema type
 */
type IntoApplicationSchema<T, P> = T extends (infer U)[]
  ? TransformItem<U>[]
  : T extends object
  ? {
      [K in keyof T]: IntoApplicationSchema<T[K], K>
    }
  : TransformValue<P>

/**
 * Convert a type to the corresponding type that can be used in the application
 *
 * @template T the original type
 */
export type TransformItem<T> = {
  [P in keyof T]: TransformValue<P>
} & GroupExtra

/**
 * Transform the type of property based on the property key
 *
 * @template T the type of the property value
 * @template K the key of the property
 */
type TransformValue<K> = K extends "url"
  ? ResumeLink
  : K extends "email"
  ? ResumeEmail
  : K extends "phone"
  ? ResumePhone
  : K extends "image"
  ? ResumeImage
  : K extends "summary"
  ? ResumeTextArea
  : K extends "number"
  ? ResumeNumber
  : K extends "date" | "endDate" | "startDate"
  ? ResumeDate
  : K extends string[]
  ? ResumeTags
  : ResumeText

/**
 * The extra properties that are added to the schema
 */
export interface GroupExtra {
  _extra: Omit<ResumeItem, "content" | "kind">
}

/**
 * The extra properties that are added to the schema
 */
export interface SectionExtra {
  _extra: { [K in keyof ResumeSchema]: Omit<GroupExtra["_extra"], "id"> }
}
