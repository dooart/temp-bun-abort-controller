import fetch from "node-fetch"
import { AnthropicProcessor } from 'socialagi'

async function run() {
  const controller = new AbortController()

  console.log("tick", controller.signal.aborted)

  setInterval(() => {
    console.log("tick", controller.signal.aborted)
  }, 1000);
  
  const processor = new AnthropicProcessor({
    fetch: async (url: RequestInfo, init?: RequestInit): Promise<Response> => {
      console.log("using node-fetch")
      const response = await fetch(url as any, init as any);
      return response as any;
    },
  })

  const resp = await processor.client.messages.stream(
    {
      model:"claude-3-opus-20240229",
      system: "you are a evil philosopher",
      messages: [
        {
          role: "user",
          content: "ponder about the origin of consciousness"
        }
      ],
      max_tokens: 1000,
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
