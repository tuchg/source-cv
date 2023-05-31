import {useEffect} from "react"
import {ResumeSchema} from "@/types"
import useSWR from "swr"
import {useSnapshot} from "valtio"

import {generateResume,} from "@/lib/webcontainer"
import {appStore, settingsStore} from "@/store";
import {mappingTypes} from "@/lib/resume/database";

export const useTemplate = (name: string) => {
  const {data: json} = useSnapshot(appStore.schemaModel)
  const {lang} = useSnapshot(settingsStore)

  const {data} = useSWR({key: "template", args: {name, json}},
    ({args}) => {
      return generateResume(args.name, args.json as ResumeSchema)
    })


  useEffect(() => {
    settingsStore.html = lang === '简体中文' ? chineseify(data as string) : data as string
  }, [data, lang])


  return useSnapshot(settingsStore)
}
/**
 * 文本是html，不要干扰到html属性,将HTML标签文本以MAPPING_TYPES为key进行替换
 * @param html
 * @returns
 */
const chineseify = (html: string) => {
// 执行批量替换
  const replace = html.replace(/>([^<]+)</g, function (match, p1) {
    for (const key in mappingTypes) {
      console.log(key, match)
      if (mappingTypes.hasOwnProperty(key) && p1.toLowerCase().includes(key)) {
        return '>' + p1.replace(new RegExp(key, "gi"), mappingTypes[key] as string) + '<';
      }
    }
    return match;
  });
  return replace
}
