import { OpenAI } from "langchain/llms/openai"
import { PromptTemplate } from "langchain/prompts"

import { config } from "@/lib/gpt/index"

const model = new OpenAI(
  {
    openAIApiKey: config.openAIApiKey,
    temperature: 0,
    modelName: "gpt-3.5-turbo",
    // cache: true,
    // streaming: true,
  },
  { basePath: config.basePath }
)

const RewriterPrompt = new PromptTemplate({
  template: `

简历文本：{text}
职责描述：{jobDesc}

注意事项：
1. 使用 {lang} 输出
2. 不解释
3. 不使用人称代词

润色上面提供的简历文本，使其更符合职责描述`,
  inputVariables: ["text", "jobDesc", "lang"],
})

export const rewrite = async (text: string, jobDesc: string, lang: string) => {
  const prompt = await RewriterPrompt.format({ text, jobDesc, lang })
  return model.call(prompt)
}
