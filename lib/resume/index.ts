import {
  AppResumeSchema,
  ResumeItem,
  ResumeItemKind,
  ResumeSchema,
  SectionExtra,
} from "@/types"
import {randomId} from "@/lib/utils";
const newItem = (prop?: Partial<ResumeItem>) =>
  ({
    sort: i,
    isEnable: true,
    isDraggable: true,
    isEditable: true,
    ...prop,
  } as ResumeItem)

const newGroupExtra = (prop?: Record<string, any>) =>
  ({
    id: randomId(),
    sort: i,
    isEnable: true,
    isDraggable: true,
    isEditable: true,
    ...prop,
  } as ResumeItem)
const newSectionExtra = (prop?: Record<string, any>) =>
  ({
    ...prop,
  } as SectionExtra)

let i = 0

/**
 * Converts the original data-section structure (ResumeSchema) to the transformed data-section structure (AppResumeSchema)
 * @param data-section - the original data-section structure
 * @returns the transformed data-section structure
 */
export function intoApplication(data: ResumeSchema): AppResumeSchema {
  // @ts-ignore
  const transformedData: AppResumeSchema = {}
  for (const key in data) {
    // @ts-ignore
    let content = data[key]
    if (Array.isArray(content)) {
      if (content.every((item) => typeof item === "object")) {
        content = content.map((item) => {
          let label = ""
          if (item.hasOwnProperty("name")) {
            label += ` ${item.name}`
          }
          if (item.hasOwnProperty("network")) {
            label += ` ${item.network}`
          }
          if (item.hasOwnProperty("organization")) {
            label += ` ${item.organization}`
          }
          if (item.hasOwnProperty("position")) {
            label += ` ${item.position}`
          }
          if (item.hasOwnProperty("title")) {
            label += ` ${item.title}`
          }
          if (item.hasOwnProperty("language")) {
            label += ` ${item.language}`
          }
          if (item.hasOwnProperty("institution")) {
            label += ` ${item.institution}`
          }
          return { ...intoApplication(item), _extra: newGroupExtra({ label }) }
        })
      } else {

        if (key==='highlights'){

        }
        content = {
          kind:key==='highlights'? ResumeItemKind.List:ResumeItemKind.Tags,
          bindingKey: key,
          content,
        }
      }
    } else if (typeof content === "object") {
      let _extra = {}
      if (key === "meta") {
        _extra = newSectionExtra()
      } else {
        _extra = newGroupExtra()
      }
      content = { ...intoApplication(content), _extra }
    } else {
      let kind: ResumeItemKind
      let sort = i
      switch (key) {
        case "url":
          kind = ResumeItemKind.Link
          break
        case "email":
          kind = ResumeItemKind.Email
          break
        case "phone":
          kind = ResumeItemKind.Phone
          break
        case "image":
          kind = ResumeItemKind.Image
          sort = 0
          break
        case "number":
          kind = ResumeItemKind.Number
          break
        case "summary":
        case "reference":
        case "description":
          kind = ResumeItemKind.TextArea
          break
        case "startDate":
          sort = 2
        case "endDate":
          sort = 3
        case "releaseDate":
        case "date":
          kind = ResumeItemKind.Date
          break
        default:
          kind = ResumeItemKind.Text
      }
      content = newItem({
        id: randomId(),
        kind,
        content,
        sort,
        bindingKey: key,
      })
    }
    // @ts-ignore
    transformedData[key] = content
  }
  return transformedData
}

/**
 * The `fromApplication` function converts an `AppResumeSchema` into its original `ResumeSchema` format.
 *
 * @param data - The `AppResumeSchema` to be converted.
 *
 * @returns A `ResumeSchema` in its original format.
 */
export function fromApplication(data: AppResumeSchema): ResumeSchema {
  return Object.keys(data)
    .filter((key) => key !== "_extra")
    .reduce((acc, key) => {
      // @ts-ignore
      let value = data[key]
      if (Array.isArray(value)) {
        value = value.map((item) =>
          typeof item === "object" ? fromApplication(item) : item
        )
      } else if (typeof value === "object") {
        value = value.kind ? value.content : fromApplication(value)
      }
      return { ...acc, [key]: value.content ?? value }
    }, {} as ResumeSchema)
}

export function flattenResumeSchema(jsonObj: Record<any, any>, prefix = "") {
  let flatJSON = ""

  for (let key in jsonObj) {
    if (["meta", "$schema"].includes(key)) continue
    if (jsonObj.hasOwnProperty(key)) {
      let newKey = prefix ? `${prefix}.${key}` : key

      if (typeof jsonObj[key] === "object" && jsonObj[key] !== null) {
        // Object.assign(flatJSON, flattenResumeSchema(jsonObj[key], newKey));
        flatJSON += `${flattenResumeSchema(jsonObj[key], newKey)}`
      } else {
        // @ts-ignore
        // flatJSON[newKey] = jsonObj[key];
        flatJSON += `${prefix}:${jsonObj[key]}\n`
      }
    }
  }

  return flatJSON
}



