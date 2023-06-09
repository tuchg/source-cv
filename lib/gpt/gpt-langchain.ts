import { guideContent } from "@/store"
import { CallbackManager } from "langchain/callbacks"
import { ConversationChain } from "langchain/chains"
import { ChatOpenAI } from "langchain/chat_models/openai"
import { BufferMemory } from "langchain/memory"
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "langchain/prompts"

import { config } from "./index"

const streamModel = new ChatOpenAI(
  {
    openAIApiKey: config.openAIApiKey,
    temperature: 0.9,
    cache: true,
    streaming: true,
    callbackManager: CallbackManager.fromHandlers({
      handleLLMNewToken(token: string): Promise<void> {
        guideContent.msg += token
        return Promise.resolve()
      },
    }),
  },
  { basePath: config.basePath }
)

export const guideResume = async (jd: string, resume: string, lang: string) => {
  const memory = new BufferMemory({
    returnMessages: true,
    memoryKey: "history",
  })

  //You are a resume editor. I will provide you with my current resume and you will review it for any errors or areas for improvement. You should look for any typos, grammatical errors and suggest changes to improve the overall clarity and effectiveness of the resume. You should also provide feedback on the content of the resume, including whether the information is presented in a clear and logical manner and whether it effectively communicates my skills and experiences. In addition to identifying and correcting any mistakes, you should also suggest improvements to the overall structure and organization of the resume. Please ensure that your edit is thorough and covers all relevant aspects of the resume, including content，work,projects .etc. Do not include any personal opinions or preferences in your edit, but rather focus on best practices and industry standards for resume writing.
  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      `
      Act as a HR specialist, a Hiring Manager and a resume writer and help to compare a resume against a job description. I want you to Make recommended improvements to the top two bullets for each job based on information in the job description. Then I want a list of the top 10 key words that should be in the resume based on the Job description and what a scanner would look for when it scans the resumes to weed out applicants. Once the resume is entered begin to compare them and fulfill the request above.
      Attention:
      1. 请先阅读我的简历,然后以使用${lang}回答我,不需要提供修改后的简历

      Job description:
        ${jd}
      `
    ),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ])
  const chatChain = new ConversationChain({
    memory: memory,
    prompt: chatPrompt,
    llm: streamModel,
  })
  // @ts-ignore
  await chatChain.call({ input: `resume ${resume}` })
}
