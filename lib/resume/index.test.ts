import { isObject } from "lodash-es"
import { describe, expect, it } from "vitest"

import { initialValue } from "../store"
import { flattenResumeSchema, fromApplication, intoApplication } from "./index"

describe("intoApplication", () => {
  const data = intoApplication(initialValue)
  it("should return an object", () => {
    expect(typeof data).toBe("object")
  })

  it("should return an object with the same keys as the input", () => {
    expect(Object.keys(data)).toEqual(Object.keys(initialValue))
  })

  it("shouldn't transform outer object", () => {
    expect(
      Object.keys(data).map((key) =>
        // @ts-ignore
        key == "$schema" ? undefined : data[key].kind
      )
    ).toEqual(Object.keys(data).map((_) => undefined))
  })

  it("should transform inner objects", () => {
    expect(Array.isArray(data.projects)).toBe(true)
    expect(Array.isArray(data.awards)).toBe(true)
    expect(Array.isArray(data.languages)).toBe(true)
    expect(Array.isArray(data.skills)).toBe(true)
    expect(Array.isArray(data.certificates)).toBe(true)
    expect(Array.isArray(data.education)).toBe(true)
    expect(Array.isArray(data.interests)).toBe(true)
    expect(Array.isArray(data.publications)).toBe(true)
    expect(Array.isArray(data.references)).toBe(true)
    expect(Array.isArray(data.volunteer)).toBe(true)
    expect(Array.isArray(data.work)).toBe(true)

    expect(typeof data.basics).toBe("object")
    expect(typeof data.meta).toBe("object")

    expect(typeof data.basics.email).toBe("object")
    expect(typeof data.basics.email.kind).toBe("number")
    expect(typeof data.work[0].highlights).toBe("object")
  })

  it("should transform nested objects", () => {
    expect(typeof data.basics.location).toBe("object")
    expect(typeof data.basics.profiles).toBe("object")
    expect(typeof data.basics.location.address).toBe("object")
    expect(typeof data.basics.location.address.kind).toBe("number")
  })

  it("_extra", () => {
    Object.entries(data)
      .filter(([_, value]) => Array.isArray(value))
      .forEach(([_, value]) =>
        value.forEach((obj: any) => expect(isObject(obj._extra)).toBe(true))
      )
  })
})

describe("fromApplication", () => {
  const data = fromApplication(intoApplication(initialValue))

  it("should return an object", () => {
    expect(typeof data).toBe("object")
  })

  it("should return an object with the same keys as the input", () => {
    expect(Object.keys(data)).toEqual(Object.keys(initialValue))
  })

  it("should return an object with the same values as the input", () => {
    expect(data).toEqual(initialValue)
  })

  it("non _extra", () => {
    expect(isObject(data.basics._extra)).toBe(false)

    Object.entries(data)
      .filter(([_, value]) => Array.isArray(value))
      .forEach(([_, value]) =>
        value.forEach((obj: any) => expect(isObject(obj._extra)).toBe(false))
      )
  })

  it("should ", function () {
    console.log(
      flattenResumeSchema(fromApplication(intoApplication(initialValue)))
    )
  })
})
