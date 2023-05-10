import {AppResumeDBMeta, AppResumeSchema} from "@/types"

import {translator} from "@/lib/gpt/translator"
import {fromApplication, intoApplication} from "@/lib/resume/index"

/**
 * TODO: temporary database
 */
interface Database {
  resumes: AppResumeSchema[]
  images: Map<string, Blob>
}

const resumesKEY = "resume-database"

export const resumesDB = (): Database["resumes"] => {
  return localStorage.getItem(resumesKEY)
    ? JSON.parse(localStorage.getItem(resumesKEY) as string)
    : []
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

export const getResume = (id: number) => {
  return resumesDB().find((resume) => resume.meta._extra.id === id)
}

export const saveResume = (resume: AppResumeSchema, arg?: AppResumeDBMeta, lang?: string) => {
  const resumes = resumesDB()
  const index = resumes.findIndex(
    (item) => item.meta._extra.id === resume.meta._extra.id
  )
  console.log(arg)
  resume.meta._extra = {...resume.meta._extra, ...arg}

  resume.meta._extra.lang = lang ? lang : "zh"
  if (index === -1) {
    resume.meta._extra.create_at = new Date()
    resume.meta._extra.update_at = resume.meta._extra.create_at
    resumes.push(resume)
  } else {
    resume.meta._extra.update_at = new Date()
    resumes[index] = resume
  }
  console.log(resumes)
  localStorage.setItem(resumesKEY, JSON.stringify(resumes))
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
      resume.meta._extra.id++
      resume.meta._extra.create_at = new Date()
      resume.meta._extra.update_at = resume.meta._extra.create_at
      resumes.push(newResume)
    } else {
      resume.meta._extra.id++
      resume.meta._extra.lang = "zh"
      resume.meta._extra.update_at = new Date()
      resume.meta._extra.title += " (Copy)"
      resumes.push(resume)
    }
  }
  localStorage.setItem(resumesKEY, JSON.stringify(resumes))
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

  resumes.map((resume) => {
    const meta = resume.meta._extra

  })

  let result: DBItem[] = [];

  resumes.forEach((item) => {
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        const r = {
          id: result.length + 1,
          type: key,
          assign: item.meta._extra.title,
          updateAt: item.meta._extra.update_at,
        }
        switch (key) {
          case 'basics':
            result.push({
              ...r,
              name: item[key].name.content,
              desc: item[key].label.content,
            });
            break
          case "work":
            item[key].forEach((work) => {
              result.push({
                ...r,
                id: result.length + 1,
                name: work.name.content,
                desc: work.position.content,
              });
            });
            break
          case "volunteer":
            item[key].forEach((volunteer) => {
              result.push({
                ...r,
                id: result.length + 1,
                name: volunteer.organization.content,
                desc: volunteer.position.content,
              });
            })
            break
          case "education":
            item[key].forEach((education) => {
              result.push({
                ...r,
                id: result.length + 1,
                name: education.institution.content,
                desc: education.studyType.content,
              });
            });
            break
          case "awards":
            item[key].forEach((award) => {
              result.push({
                ...r,
                id: result.length + 1,
                name: award.title.content,
                desc: award.awarder.content,
              });
            });
            break
          case "publications":
            item[key].forEach((publication) => {
              result.push({
                ...r,
                id: result.length + 1,
                name: publication.name.content,
                desc: publication.publisher.content,
              });
            });
            break
          case "skills":
            item[key].forEach((skill) => {
              result.push({
                ...r,
                id: result.length + 1,
                name: skill.name.content,
                desc: skill.level.content,
              });
            });
            break
          case "languages":
            item[key].forEach((language) => {
              result.push({
                ...r,
                id: result.length + 1,
                name: language.language.content,
                desc: language.fluency.content,
              });
            });
            break
          case "interests":
            item[key].forEach((interest) => {
              result.push({
                ...r,
                id: result.length + 1,
                name: interest.name.content,
                desc: interest.keywords.content,
              });
            });
            break
          case "references":
            item[key].forEach((reference) => {
              result.push({
                ...r,
                id: result.length + 1,
                name: reference.name.content,
                desc: reference.reference.content,
              });
            });
            break
          case "projects":
            item[key].forEach((project) => {
              result.push({
                ...r,
                id: result.length + 1,
                name: project.name.content,
                desc: project.highlights.content,
              });
            });
            break
          case "certificates":
            item[key].forEach((certificate) => {
              result.push({
                ...r,
                id: result.length + 1,
                name: certificate.name.content,
                desc: certificate.issuer.content,
              });
            });
            break

        }
      }
    }
  });
  console.log(result)
  return result
}

export interface DBItem {
  id: number,
  type: string,

  [property: string]: any,

  // assign to resume
  assign: string,
  updateAt: string,
}


export const updateResumeDB = (resumes: AppResumeSchema[]) => {

}
