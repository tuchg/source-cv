/**
 *
 * ResumeItem interface that holds information about an item in a resume.
 */
export interface ResumeItem {
  id: string
  kind: ResumeItemKind
  content: string | string[] | Date | Date[] | number
  label: string
  icon: string
  sort: number
  isEnable: boolean
  isDraggable: boolean
  /** with template */
  bindingKey: string
  isEditable: boolean

  [property: string]: any
}

export interface ResumeText extends ResumeItem {
  kind: ResumeItemKind.Text
  content: string
}

export interface ResumeTags extends ResumeItem {
  kind: ResumeItemKind.Tags
  content: string[]
}

export interface ResumeList extends ResumeItem {
  kind: ResumeItemKind.List
  content: string[]
}

export interface ResumeTextArea extends ResumeItem {
  kind: ResumeItemKind.TextArea
  content: string
}

export interface ResumeLink extends ResumeItem {
  kind: ResumeItemKind.Link
  content: string
}

export interface ResumeImage extends ResumeItem {
  kind: ResumeItemKind.Image
  content: string
}

export interface ResumeNumber extends ResumeItem {
  kind: ResumeItemKind.Number
  content: number
}

export interface ResumeDate extends ResumeItem {
  kind: ResumeItemKind.Date
  content: Date
}

export interface ResumeDateRange extends ResumeItem {
  kind: ResumeItemKind.DateRange
  content: Date[]
}

export interface ResumeEmail extends ResumeItem {
  kind: ResumeItemKind.Email
  content: string
}

export interface ResumePhone extends ResumeItem {
  kind: ResumeItemKind.Phone
  content: string
}

export enum ResumeItemKind {
  Text,
  Tags,
  TextArea,
  Link,
  Image,
  Number,
  Date,
  DateRange,
  Email,
  Phone,
  List,
  None,
}
