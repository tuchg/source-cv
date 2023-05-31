import {ResumeSchema} from "@/types"
import {ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate} from "langchain/prompts";
import {LLMChain} from "langchain";
import {OpenAI} from "langchain/llms/openai";
import {config} from "@/lib/gpt/index";
import {fixParser} from "@/lib/gpt/drafter";

export const translator = (
  resume: ResumeSchema,
  lang: string
): ResumeSchema => {
  return resume
}
const model = new OpenAI(
  {
    openAIApiKey: config.openAIApiKey,
    temperature: 0,
    modelName: "gpt-3.5-turbo",
    cache: true,
    // streaming: true,
  },
  {basePath: config.basePath}
)

const translationPrompt = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(
    "You are a helpful assistant that translates {input_language} to {output_language}."
  ),
  HumanMessagePromptTemplate.fromTemplate("{text}"),
]);

export const translate = async (text: string, input_language: string, output_language: string) => {
  const chain = new LLMChain({
    prompt: translationPrompt,
    llm: model,
  });
  const result = await chain.call({
    text,
    input_language,
    output_language,
  });
  console.log("translate result:", result);
  return result.output;
}
