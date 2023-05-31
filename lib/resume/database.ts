import {AppResumeDBMeta, AppResumeSchema} from "@/types"

import {translator} from "@/lib/gpt/translator"
import {fromApplication, intoApplication} from "@/lib/resume/index"
import dayjs from "dayjs";
import {get, set} from "lodash-es";
import {randomId} from "@/lib/utils";

/**
 * TODO: temporary database
 */
interface Database {
  resumes: AppResumeSchema[]
  images: Map<string, Blob>
}

const resumesKEY = "resume-database"

export const resumesDB = (): Database["resumes"] => {
  let newVar = localStorage.getItem(resumesKEY)
    ? JSON.parse(localStorage.getItem(resumesKEY) as string)
    : [];
  return newVar.filter(r => r && r.meta._extra.user === localStorage.getItem("user-name"))
}


export const listResumes = (lang?: string) => {
  return resumesDB()
    .filter((resume) => (lang ? resume.meta._extra.lang === lang : true))
    .map((_resume) => {
      const resume = _resume.meta._extra
      // @ts-ignore
      resume.preview = getImage(resume.preview)
      return resume
    })
}

export const getResumeMeta = (resumeId: string) => getResume(resumeId)?.meta._extra

export const getResume = (id: string) => {
  return resumesDB().find((resume) => resume.meta._extra.id === id)
}

export const saveResume = (resume: AppResumeSchema, arg?: AppResumeDBMeta, lang?: string) => {
  const resumes = resumesDB()
  const index = resumes.findIndex(
    (item) => item.meta._extra.id === resume.meta._extra.id
  )
  resume.meta._extra = {...resume.meta._extra, ...arg}

  // resume.meta._extra.lang = lang ? lang : "zh"
  resume.meta._extra.user = localStorage.getItem("user-name")
  syncResumeAssign(resume)
  if (index === -1) {
    resume.meta._extra.create_at = new Date()
    resume.meta._extra.update_at = resume.meta._extra.create_at
    resumes.push(resume)
  } else {
    resume.meta._extra.update_at = new Date()
    resumes[index] = resume
  }
  localStorage.setItem(resumesKEY, JSON.stringify(resumes))
}

export const syncResumes = (resume: AppResumeSchema) => {
  const db = resumesDB()
  const index = db.findIndex(
    (item) => item.meta._extra.id === resume.meta._extra.id
  )
  if (index !== -1) {
    db[index] = resume
  }
  localStorage.setItem(resumesKEY, JSON.stringify(db))
}

export const deleteResume = (id: number) => {
  const resumes = resumesDB()
  const index = resumes.findIndex((item) => item.meta._extra.id === id)
  if (index !== -1) {
    // delImage(resumes[index].meta._extra.preview)
    resumes.splice(index, 1)
  }
  localStorage.setItem(resumesKEY, JSON.stringify(resumes))
}

export const dupResume = (id: number, lang?: string) => {
  const resumes = resumesDB()
  const resume = getResume(id)
  if (resume) {
    if (lang) {
      const newResume = intoApplication(translator(fromApplication(resume), lang))
      resume.meta._extra.id = randomId()
      resume.meta._extra.create_at = new Date()
      resume.meta._extra.update_at = resume.meta._extra.create_at
      syncResumeAssign(resume)
      resumes.push(newResume)
    } else {
      resume.meta._extra.id = randomId()
      resume.meta._extra.lang = "zh"
      resume.meta._extra.update_at = new Date()
      resume.meta._extra.title += resume.meta._extra.id
      syncResumeAssign(resume)
      resumes.push(resume)
    }
  }

  localStorage.setItem(resumesKEY, JSON.stringify(resumes))
}

export const syncResumeAssign = (resume: AppResumeSchema) => {
  const resumeId = resume.meta._extra.id
  Object.keys(resume).filter((key) => !['meta', '$schema'].includes(key))
    .forEach((key) => {
      // @ts-ignore
      const item = resume[key] as any;
      if (item instanceof Array) {
        item.forEach((i) => {
          i._extra.assign = [resumeId]
          i._extra.id = randomId()
        })
      } else if (Object.keys(item).includes('_extra')) {
        item._extra.assign = [resumeId]
        item._extra.id = randomId()
      }
    })

}

export const saveImage = (name: string, blob: string) => {
  localStorage.setItem(name, blob)
}

export const getImage = (name: string) => {
  return localStorage.getItem(name)
}

export const delImage = (name: string) => {
  localStorage.removeItem(name)
}


export const fetchResumesDB = (): DBItem[] => {
  const resumes = resumesDB()
  // .filter((resume) => resume.meta._extra.lang === "zh")

  let result: DBItem[] = [];

  resumes.forEach((item) => {
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        const r = {
          type: mappingTypes[key],
          updateAt: dayjs(item.meta._extra.update_at).format("YYYY-MM-DD hh:mm:ss"),
        }
        switch (key) {
          case 'basics':
            Object.keys(item[key]).length > 0 && result.push({
              ...r,
              id: item[key]._extra.id,
              name: item[key].name.content,
              desc: item[key].label.content,
              assign: item[key]._extra.assign
            });
            break
          case "work":
            item[key].forEach((work) => {
              result.push({
                ...r,
                // id: result.length + 1,
                id: work._extra.id,
                name: work.name.content,
                desc: work.position.content,
                assign: work._extra.assign
              });
            });
            break
          case "volunteer":
            item[key].forEach((volunteer) => {
              result.push({
                ...r,
                id: volunteer._extra.id,
                name: volunteer.organization.content,
                desc: volunteer.position.content,
                assign: volunteer._extra.assign
              });
            })
            break
          case "education":
            item[key].forEach((education) => {
              result.push({
                ...r,
                id: education._extra.id,
                name: education.institution.content,
                desc: education.studyType.content,
                assign: education._extra.assign
              });
            });
            break
          case "awards":
            item[key].forEach((award) => {
              result.push({
                ...r,
                id: award._extra.id,
                name: award.title.content,
                desc: award.awarder.content,
                assign: award._extra.assign
              });
            });
            break
          case "publications":
            item[key].forEach((publication) => {
              result.push({
                ...r,
                id: publication._extra.id,
                name: publication.name.content,
                desc: publication.publisher.content,
                assign: publication._extra.assign
              });
            });
            break
          case "skills":
            item[key].forEach((skill) => {
              result.push({
                ...r,
                id: skill._extra.id,
                name: skill.name.content,
                desc: skill.level.content,
                assign: skill._extra.assign
              });
            });
            break
          case "languages":
            item[key].forEach((language) => {
              result.push({
                ...r,
                id: language._extra.id,
                name: language.language.content,
                desc: language.fluency.content,
                assign: language._extra.assign
              });
            });
            break
          case "interests":
            item[key].forEach((interest) => {
              result.push({
                ...r,
                id: interest._extra.id,
                name: interest.name.content,
                desc: interest.keywords.content,
                assign: interest._extra.assign
              });
            });
            break
          case "references":
            item[key].forEach((reference) => {
              result.push({
                ...r,
                id: reference._extra.id,
                name: reference.name.content,
                desc: reference.reference.content,
                assign: reference._extra.assign
              });
            });
            break
          case "projects":
            item[key].forEach((project) => {
              result.push({
                ...r,
                id: project._extra.id,
                name: project.name.content,
                desc: project.highlights.content,
                assign: project._extra.assign
              });
            });
            break
          case "certificates":
            item[key].forEach((certificate) => {
              result.push({
                ...r,
                id: certificate._extra.id,
                name: certificate.name.content,
                desc: certificate.issuer.content,
                assign: certificate._extra.assign
              });
            });
            break

        }
      }
    }
  });
  const uniqueArray = result.reduce((accumulator, current) => {
    const existingItem = accumulator.find(item => item.id === current.id);
    if (!existingItem) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);
  return uniqueArray
}

export interface DBItem {
  id?: string,
  type?: string,
  // assign to resume
  assign?: string[],
  updateAt?: Date,

  [property: string]: any,
}


export const reassignToResume = (itemIds: string[], resumeIds: string[]) => {
  itemIds.forEach((itemId) => {
    const {path, data: item} = findItemAndOwner(itemId)
    item._extra.assign = resumeIds

    const resumes = resumesDB()
    resumes.map((r) => {
      if (resumeIds.includes(r.meta._extra.id)) {
        console.log('path', path)
        let newPath = path as unknown as string;
        if (newPath.endsWith(']')) {
          // const index = path.match(/\[(\d+)\]/)?.[1]
          // const newIndex=parseInt(index)+1
          // newPath=path.replace(/\[(\d+)\]/,`[${newIndex}]`)
          newPath = newPath.slice(0, -3)
          const arr = get(r, newPath)
          let find = arr.findIndex((i) => i._extra.id === item._extra.id);
          if (find) {
            set(r, `${newPath}[${find}]`, item)
          } else {
            get(r, newPath).push(item)
          }
        } else {
          set(r, newPath, item)
        }
      }
      console.log('changed', r)
      return r
    })
    console.log("syncChangeToResumes", resumes)
    localStorage.setItem(resumesKEY, JSON.stringify(resumes))
  })
}

export const copyAssignToResume = (itemIds: string[], resumeIds: string[]) => {
  console.log(itemIds)
  itemIds.forEach((itemId) => {
    const {path, data: item, owners} = findItemAndOwner(itemId)
    const resumes = resumesDB()
    resumes.map((r) => {
      if (resumeIds.includes(r.meta._extra.id)) {
        item._extra.assign = [r.meta._extra.id]
        item._extra.id = randomId()
        let newPath = path as unknown as string;
        if (newPath.endsWith(']')) {
          newPath = newPath.slice(0, -3)
          get(r, newPath).push(item)
        } else {
          set(r, newPath, item)
        }
      }
      console.log('changed', r)
      return r
    })
    console.log("syncChangeToResumes", resumes)
    localStorage.setItem(resumesKEY, JSON.stringify(resumes))
  })
}

export const deleteResumeItems = (items: string[]) => {
  const resumes = resumesDB()
  // .filter((resume) => resume.meta._extra.lang === "zh")
  resumes.forEach((o) => {
    Object.keys(o).filter((key) => !['meta', '$schema'].includes(key))
      .forEach((key) => {
        const item = o[key] as any;
        if (item instanceof Array) {
          o[key] = item.filter((i) => !items.includes(i._extra.id))
        } else if (Object.keys(item).includes('_extra')) {
          if (items.includes(item._extra.id)) {
            o[key] = {}
          }
        }
      })
  });
  localStorage.setItem(resumesKEY, JSON.stringify(resumes))
}


export const findItemAndOwner = (id: string) => {
  const resumes = resumesDB()
  // .filter((resume) => resume.meta._extra.lang === "zh")
  let path: string | undefined = undefined
  let data: DBItem | undefined = undefined
  console.log(resumes)
  const owners = []
  resumes.forEach((o) => {
    const item = Object.keys(o).filter((key) => !['meta', '$schema'].includes(key))
      .find((key) => {
        const item = o[key] as any;
        if (item instanceof Array) {
          return item.find((i, index) => {
            const compare = i._extra.id === id
            if (compare) {
              path = `${key}[${index}]`
              data = i
            }
            return compare
          })
        } else if (Object.keys(item).includes('_extra')) {
          const compare = item._extra.id === id
          if (compare) {
            path = `${key}`
            data = item
          }
          return compare
        }
      })
    if (item) {
      console.log("found", item)
      owners.push({
        id: o.meta._extra.id,
        name: o.meta._extra.title,
        preview: o.meta._extra.preview,
        lang: o.meta._extra.lang,
      })
    }
  })
  return {path, data, owners}
}

export const syncChangeToResumes = (changed, resumeIds) => {
  console.log(changed, resumeIds)
  const resumes = resumesDB()
  resumes.map((r) => {
    if (resumeIds.includes(r.meta._extra.id)) {
      set(r, changed.path, changed.change)
    }
    console.log('changed', r)
    return r
  })
  console.log("syncChangeToResumes", resumes)
  localStorage.setItem(resumesKEY, JSON.stringify(resumes))
}

const templatesKEY = "templates-database"


const templatesDB = () => {
  const templates = localStorage.getItem(templatesKEY)
  if (templates) {
    return JSON.parse(templates)
  } else {
    return []
  }
}


export const tryTemplate = (templateName: string, templatePreview: string) => {
  let db = templatesDB() as any[];
  const newPos = db.findIndex((t) => t.name === templateName)

  saveImage(templateName, templatePreview)

  const newTemplate = {
    id: randomId(),
    user: localStorage.getItem('user-name'),
    name: templateName,
    update_at: Date.now(),
  }
  if (newPos === -1) {
    db.push(newTemplate)
  } else {
    db[newPos] = newTemplate
  }
  localStorage.setItem(templatesKEY, JSON.stringify(db))
}

export const listMyTemplates = () => {
  return templatesDB()
    .filter((t) => t.user === localStorage.getItem('user-name'))
    .map((t) => {
      t.preview = localStorage.getItem(t.name)
      return t
    })
}

export const delMyTemplate = (templateId: string) => {
  const db = templatesDB()
  const newPos = db.findIndex((t) => t.id === templateId)
  if (newPos !== -1) {
    db.splice(newPos, 1)
    localStorage.setItem(templatesKEY, JSON.stringify(db))
  }
}


export const mappingTypes = {
  "basics": "基本信息",
  "name": "姓名",
  "label": "职位",
  "email": "邮箱",
  "phone": "电话",
  "url": "链接",
  "personal summary":"个人介绍",
  "summary": "简介",
  "image": "头像",
  "location": "地址",
  "address": "详细地址",
  "city": "城市",
  "region": "地区",
  "countryCode": "国家代码",
  "postalCode": "邮编",
  "profiles": "社交网络",
  "network": "社交平台",
  "username": "用户名",
  "certificates": "证书",
  "date": "日期",
  "issuer": "颁发机构",
  "education": "教育经历",
  "area": "领域",
  "courses": "课程",
  "endDate": "结束日期",
  "institution": "学校",
  "score": "成绩",
  "startDate": "开始日期",
  "studyType": "学位",
  "interests": "兴趣爱好",
  "keywords": "关键词",
  "languages": "语言",
  "fluency": "熟练程度",
  "meta": "元信息",
  "canonical": "规范链接",
  "lastModified": "最后修改时间",
  "version": "版本",
  "projects": "项目",
  "description": "项目描述",
  "entity": "相关公司/实体",
  "highlights": "亮点",
  "roles": "角色",
  "type": "类型",
  "publications": "出版物",
  "publisher": "出版商",
  "releaseDate": "发布日期",
  "references": "推荐人",
  "reference": "推荐语",
  "skills": "技能",
  "level": "熟练程度",
  "volunteer work": "志愿者经历",
  "volunteer": "志愿者经历",
  "organization": "组织",
  "position": "职位",
  "work experience": "工作经历",
  "experience": "工作经验",
  "work": "工作经历",
  "awards": "奖项",
  "awarder": "颁发者",
  "title": "奖项名称",
  "about":"关于",
}
