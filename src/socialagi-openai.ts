import fetch from "node-fetch"
import { OpenAILanguageProgramProcessor } from 'socialagi'

async function run() {
  const controller = new AbortController()

  console.log("tick", controller.signal.aborted)
  
  setInterval(() => {
    console.log("tick", controller.signal.aborted)
  }, 1000);
  
  const processor = new OpenAILanguageProgramProcessor({
    fetch: async (url: RequestInfo, init?: RequestInit): Promise<Response> => {
      console.log("using node-fetch")
      const response = await fetch(url as any, init as any);
      return response as any;
    },
  })

  const resp = await processor.client.chat.completions.create(
    {
      model: "gpt-4-0125-preview",
      messages: [{
        role: "system",
        content: "Answer in very long winded responses",
      },
      {
        role: "user",
        content: "What is the meaning of life?",
      }],
      stream: true,
    },
    {
      signal: controller.signal,
    }
  )

  for await (const res of resp) {
    try {
      console.log("abort")
      controller.abort()
    } catch (err) {
      console.error('err: ', err)
    }

    try {
      console.log("str: ", res)
    } catch (err) {
      console.error('err: ', err)
    }
  }
}

run().catch((e) => {
  console.error("caught:", e);
})
