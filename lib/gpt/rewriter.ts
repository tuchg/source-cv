import {OpenAI} from "langchain/llms/openai";
import {config} from "@/lib/gpt/index";
import {PromptTemplate,} from "langchain/prompts";

const model = new OpenAI(
  {
    openAIApiKey: config.openAIApiKey,
    temperature: 0,
    modelName: "gpt-3.5-turbo",
    // cache: true,
    // streaming: true,
  },
  {basePath: config.basePath}
)


const RewriterPrompt = new PromptTemplate({
  template: `
润色简历文本
注意事项：
1. 使用 {lang} 输出
2. 使简历文本与 {jobDesc} 匹配
3. 不解释简历文本，只是润色
4. 不要使用人称代词

简历文本：{text}
  `,
  inputVariables: ["text", "jobDesc", "lang"],
})

export const rewrite = async (text: string, jobDesc: string, lang: string) => {
  const prompt = await RewriterPrompt.format({text, jobDesc, lang})
  return model.call(prompt)
}
