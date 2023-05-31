import {ResumeSchema} from "@/types"
import {ConversationChain} from "langchain/chains"
import {OpenAI} from "langchain/llms/openai"
import {
  OutputFixingParser,
  StructuredOutputParser,
} from "langchain/output_parsers"
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder, PromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts"
import {z} from "zod"

import {config} from "@/lib/gpt/index"
import {BufferMemory} from "langchain/memory";
import {translate} from "@/lib/gpt/translator";

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


export const executeGPT = async (jobDesc: string, lang: string) => {

  const systemTel =
    `job description:
{jobDesc}

Utilize your professional resume writing skills to craft a comprehensive resume featuring three distinct work experiences, emphasizing technical expertise, project involvements, and quantifiable accomplishments.

Attentions:
0. Use ${lang} output
1.Include a diverse range of technical bullet points that closely align with the desired job description.
2.Highlight specific technical achievements and measurable outcomes for each work experience, avoiding overly generic descriptions.

{format_instructions}`

  // 1.The generated resume will be in ${lang}.

  const prompt = new PromptTemplate({
    template: systemTel,
    inputVariables: ["jobDesc"],
    partialVariables: {format_instructions: fixParser.getFormatInstructions()},
    outputParser: fixParser,
  })

  const chatChain = new ConversationChain({
    prompt: prompt,
    llm: model,
  })


  const result = await chatChain.call({jobDesc})

  // const xy = await translate(x, "English", "Chinese")

  console.log("result: ", result)
  return result.response as unknown as Partial<ResumeSchema>
}

export const draftResume = async (jd: string, lang: string, resume: Partial<ResumeSchema>) => {

  const generatedData = await executeGPT(jd, lang)
  resume.work = generatedData.work
  resume.projects = generatedData.projects
  resume.skills = generatedData.skills

  if (generatedData.awards) {
    resume.awards = generatedData.awards
  }
  if (generatedData.certificates) {
    resume.certificates = generatedData.certificates
  }
  if (generatedData.interests) {
    resume.interests = generatedData.interests
  }
  if (generatedData.basics?.summary && generatedData.basics!.summary.length > 0) {
    resume.basics!.summary = generatedData.basics!.summary
  }
  return resume as ResumeSchema
}

export const ProjectSchema = z.object({
  description: z
    .string()
    .describe("Short summary of project. e.g. Collated works of 2017.").optional(),
  endDate: z.string().optional(),
  entity: z
    .string()
    .describe(
      "Specify the relevant company/entity affiliations e.g. 'greenpeace', 'corporationXYZ'"
    ).optional(),
  highlights: z.array(z.string()).describe("Specify multiple features").optional(),
  keywords: z.array(z.string()).describe("Specify special elements involved").optional(),
  name: z.string().describe("e.g. The World Wide Web").optional(),
  roles: z
    .array(z.string())
    .describe("Specify your role on this project or in company").optional(),
  startDate: z.string().optional(),
})

export const SkillSchema = z.object({
  level: z.string().describe("e.g. Master"),
  name: z.string().describe("e.g. Web Development"),
})

export const WorkSchema = z.object({
  description: z.string().describe("e.g. Social Media Company").optional(),
  endDate: z.string().optional(),
  highlights: z.array(z.string()).describe("Specify multiple accomplishments").optional(),
  location: z.string().describe("e.g. Menlo Park, CA").optional(),
  name: z.string().describe("e.g. Facebook").optional(),
  position: z.string().describe("e.g. Software Engineer").optional(),
  startDate: z.string().optional(),
  summary: z
    .string()
    .describe("Give an overview of your responsibilities at the company").optional(),
  url: z.string().describe("e.g. http://facebook.example.com").optional(),
})

export const PersonalSchema = z.object({
  summary: z.string().describe("Write a short 2-3 sentence biography about yourself").optional(),
})
export const InterestSchema = z.object({
  keywords: z.array(z.string()).describe("List some keywords pertaining to this interest").optional(),
  name: z.string().describe("e.g. Philosophy"),
});
export const CertificateSchema = z.object({
  date: z.string().describe("e.g. 1989-06-12"),
  issuer: z.string().describe("e.g. CNCF"),
  name: z.string().describe("e.g. Certified Kubernetes Administrator"),
  url: z.string().describe("e.g. http://example.com"),
});

export const AwardSchema = z.object({
  date: z.string().describe("e.g. 1989-06-12"),
  awarder: z.string().describe("e.g. Time Magazine"),
  summary: z.string().describe("e.g. Received for my work with Quantum Physics"),
  title: z.string().describe("e.g. One of the 100 greatest minds of the century"),
});

const ResumeSchema = z.object({
  basics: PersonalSchema,
  work: z.array(WorkSchema),
  projects: z.array(ProjectSchema),
  skills: z.array(SkillSchema),
  // interests: z.array(InterestSchema).optional(),
  certificates: z.array(CertificateSchema),
  // awards: z.array(AwardSchema).optional(),
})


const resumeParser = StructuredOutputParser.fromZodSchema(ResumeSchema)

export const fixParser = OutputFixingParser.fromLLM(model, resumeParser)
