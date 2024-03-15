import { fetch as fetch2 } from 'undici';
import { OpenAI } from 'openai'

async function run() {
  const controller = new AbortController()
  const client = new OpenAI({
    fetch: async (url: RequestInfo, init?: RequestInit): Promise<Response> => {
      console.log("using custom fetch")
      const response = await fetch2(url as any, init as any);
      return response as any;
    },
  });
  
  const resp = await client.chat.completions.create(
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
  
  setTimeout(() => {
    controller.abort()
  }, 150)
  
  for await (const res of resp) {
    try {
      console.log(".")
    } catch (err) {
      console.error('err: ', err)
    }
  }
}

setInterval(() => {
  console.log("tick");
}, 1000);

run().catch((e) => {
  console.error("caught:", e);
})
