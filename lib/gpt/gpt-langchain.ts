import { CallbackManager } from "langchain/callbacks"
import { ConversationChain } from "langchain/chains"
import { ChatOpenAI } from "langchain/chat_models/openai"
import { OpenAI } from "langchain/llms/openai"
import { BufferMemory } from "langchain/memory"
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "langchain/prompts"
import { ChainValues } from "langchain/schema"

import { guideContent } from "../../pages/editor/gpt-section"
import { config } from "./index"

const model = new OpenAI(
  {
    openAIApiKey: config.openAIApiKey,
    temperature: 0.9,
  },
  { basePath: config.basePath }
)

// Create the models and chain
const memory = new BufferMemory({ returnMessages: true, memoryKey: "history" })
let chatChain: ConversationChain | null = null
let chatPrompt = null
export const chatHistory = memory.chatHistory.messages

export const makeResume = async (jd: string, resume: string) => {
  // @ts-ignore
  const systemTel = `你现在是一个针对职位【${jd}】的面试官，而我是应征的面试者。你需要遵守以下规则：1. 你只能问我职位和我提供的简历相关的面试问题. 2. 不需要写解释. 3. 你需要向面试官一样等我回答问题，再提问下一个问题.`
  chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(systemTel),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ])

  chatChain = new ConversationChain({
    memory: memory,
    prompt: chatPrompt,
    llm: model,
  })

  return await chatChain.call({
    input: `你好，面试官，我是应征的面试者，这是我的简历【${resume}】`,
  })
}

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

export const guideResume = async (jd: string, resume: string) => {
  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "You are a resume editor. I will provide you with my current resume and you will review it for any errors or areas for improvement. You should look for any typos, grammatical errors and suggest changes to improve the overall clarity and effectiveness of the resume. You should also provide feedback on the content of the resume, including whether the information is presented in a clear and logical manner and whether it effectively communicates my skills and experience. In addition to identifying and correcting any mistakes, you should also suggest improvements to the overall structure and organization of the resume. Please ensure that your edit is thorough and covers all relevant aspects of the resume, including content，work,projects. focus on best practices and industry standards for resume writing.Don't give a modified resume. 然后以使用中文回答我,不需要提供修改后的简历"
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
  await chatChain.call({ input: resume })
}
