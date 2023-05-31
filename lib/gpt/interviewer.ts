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

const model = new ChatOpenAI(
  {
    openAIApiKey: config.openAIApiKey,
    temperature: 0.9,
    cache: true,
    // streaming: true,
  },
  { basePath: config.basePath }
)

const memory = new BufferMemory({ returnMessages: true, memoryKey: "history" })
export const chatHistory = memory.chatHistory.messages

let chatChain: ConversationChain | null = null
let chatPrompt = null

export const firstAsk = async (jd: string, resume: string) => {
  const systemTel = `
你现在是一个针对职位【${jd}】的面试官，而我是应聘的面试者。
请注意：
- 每次只问一个问题
- 用户回答问题后请直接问下一个问题，而不要试图纠正候选人的错误；
- 如果你认为用户连续几次回答的都不对，就少问一点；
- 只问我职位描述提及的以及简历中的相关面试问题.
- 问完最后一个问题后，你可以问这样一个问题：上一份工作为什么离职？用户回答该问题后，请表示理解与支持。
`
  chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(systemTel),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ])
  await memory.clear()
  chatChain = new ConversationChain({
    memory: memory,
    prompt: chatPrompt,
    llm: model,
  })

  return await chatChain.call({
    input: `你好,我的简历【${resume}】`,
  })
}

export const resp = async (text: string) => {
  console.log(chatHistory)
  return await chatChain!.call({
    input: text,
  })
}

/**
 * User
 * I will upload two documents, you will not comment until I ask.
 *
 * Upload doc 1 job description
 *
 * Upload doc 2 resume
 *
 * Next instruction
 *
 * Act as a professional resume writer and use the two documents above to create a set of resume bullet points match to the job and based on the resume above. Target this at an executive level and used advanced language
 *
 */
