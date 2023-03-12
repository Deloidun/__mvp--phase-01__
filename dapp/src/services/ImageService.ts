import { Configuration, OpenAIApi } from "openai";
import { env } from '../env.mjs'

const configuration = new Configuration({
  apiKey: env.NEXT_PUBLIC_OPENAI_API_KEY
})

const openAI = new OpenAIApi(configuration)

const DEFAULT_IMAGE_SIZE = "512x512"

export const generate = async (prompt: string) => {
  const response = await openAI.createImage({
    prompt: prompt,
    n: 1,
    size: DEFAULT_IMAGE_SIZE,
    response_format: "b64_json"
  })

  const b64Image = response.data.data[0]?.b64_json

  return b64Image
}
