import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

if (process.env.NEXT_PUBLIC_USE_USER_KEY !== "true") {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing env var from OpenAI");
  }
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  var { prompt, api_key } = (await req.json()) as {
    prompt?: string;
    api_key?: string
  };
  //todo make this variable into messages
  var p = "现在你担任一位优秀的简历撰写专家，根据我为你提供的项目经历，为我润色这一段项目经历，具体要求如下：首先润色的简历中要包含以下要素：1. 项目背景和角色明确：优秀润色中对项目背景和角色进行了明确的描述，提供了更具体的信息，例如团队规模、项目周期和产品定位目标。2. 分阶段描述：在优秀润色中，经历被分为了多个阶段，这种分阶段的描述更有条理，能够清晰展现整个项目的步骤和流程。3. 重点突出：优秀润色对关键信息进行了重点突出，如项目背景、任务和成果，使得面试官能够快速抓住重要信息，而不被细节淹没。4. 量化和数据支持：优秀润色中提供了更多具体的量化数据和信息，这些数据支持了经历的成果和效果，使得描述更加可信和有说服力。如果经历中没有提及，你可以适度编造或以‘’‘xxx’‘’表示。5. 强调与目标职位相关的技能和经验：在润色经历时，可以特别突出与目标职位相关的技能和经验。例如，如果申请的是产品经理职位，可以重点描述与产品设计、用户需求分析和原型制作等相关的工作内容和成果。6. 使用行业相关的术语和关键词：通过项目经历检索到目标岗位，根据目标职位和行业的要求，可以在润色经历时使用更多与该行业相关的术语和关键词。这有助于提升简历的专业性和匹配度。7. 强调解决问题的能力：不论申请何种职位，都可以在经历中强调你在过去工作中所展现的解决问题的能力。用STAR法则详细描述你在面对挑战时的行动和取得的结果，以证明你的能力。8. 简练明了：在初步完成润色后，应该反复检查内容，优秀润色模版使用简洁明了的语言，准确传达信息，避免冗长的叙述，使面试官能够快速了解项目的关键要点。9. 注意内容的专业度，不要使用第一人称“我”和冗余的句子类似于“通过以上的努力和改进”“为了解决这一问题““随后”等，注意用语的专业度和客观性。**注意输出格式如下： ‘’‘ 【项目背景】: {根据项目内容检索出项目背景和相关职业/岗位等作为项目关键角色。简明扼要地介绍了项目的背景和角色。}【{总结项目中包含的各个关键阶段，并作为项目中的子标题}】： {请用一段话对每一个阶段进行总结。**非常重要，注意：1. 增加术语和关键词，需要从经历中根据检索到的目标岗位适当增加细节和与行业相关的术语和关键词，提升简历的专业性和匹配度。2. 保持语言精简：在描述清楚项目关键内容的同时注意简练明了，避免冗余的叙述。字数控制在50-100字左右}【{总结项目中包含的各个关键阶段，并作为项目中的子标题}】： {请用一段话对每一个阶段进行总结。**非常重要，注意：1. 增加术语和关键词，需要从经历中根据检索到的目标岗位适当增加细节和与行业相关的术语和关键词，提升简历的专业性和匹配度。2. 保持语言精简：在描述清楚项目关键内容的同时注意简练明了，避免冗余的叙述。字数控制在50-100字左右}【{总结项目中包含的各个关键阶段，并作为项目中的子标题}】： {请用一段话对每一个阶段进行总结。**非常重要，注意：1. 增加术语和关键词，需要从经历中根据检索到的目标岗位适当增加细节和与行业相关的术语和关键词，提升简历的专业性和匹配度。2. 保持语言精简：在描述清楚项目关键内容的同时注意简练明了，避免冗余的叙述。字数控制在50-100字左右}【{总结项目中包含的各个关键阶段，并作为项目中的子标题}】： {请用一段话对每一个阶段进行总结。**非常重要，注意：1. 增加术语和关键词，需要从经历中根据检索到的目标岗位适当增加细节和与行业相关的术语和关键词，提升简历的专业性和匹配度。2. 保持语言精简：在描述清楚项目关键内容的同时注意简练明了，避免冗余的叙述。字数控制在50-100字左右}【成果】: {在“成果”部分列出了具体的项目成果，通过这些成果展示来证明项目的成功和价值。注意时间和数据量化，在描述项目时涉及了时间和数据的量化，这样的量化描述使得项目更具体和可信。字数控制在50-100字左右} ’‘’请你认真阅读以上所有要求以及参照输出格式，为我的项目经历润色。**注意请不要使用第一人称！！润色内容中去除所有的“我”，保持用语的专业度和客观性！！以及你的输出仅包含润色内容，请不要新增其他无关内容。以下是项目经历："
  
  prompt = p + prompt
  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  // if (!process.env.OPENAI_MODEL) {
  //   throw new Error("Missing env var from OpenAI")
  // }

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
    api_key,
  }

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
