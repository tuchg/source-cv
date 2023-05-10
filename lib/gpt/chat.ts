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
  const systemTel = `你现在是一个技术面试官，你要招聘的岗位是【${jd}】，而我是应聘者。你需要遵守以下规则：1. 你只能问我职位和我提供的简历相关的面试问题. 2. 不需要写解释. 3. 你需要向面试官一样等我回答问题，再提问下一个问题.`
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
    input: `你好，面试官，这是我的简历【${resume}】`,
  })
}

export const resp = async (text: string) => {
  console.log(chatHistory)
  return await chatChain!.call({
    input: text,
  })
}
