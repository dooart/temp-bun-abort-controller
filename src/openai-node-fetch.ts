import fetch from "node-fetch";
import { OpenAI } from "openai";
import { config } from "dotenv";

config()

async function run() {
  const controller = new AbortController();

  console.log("tick", controller.signal.aborted);
  
  setInterval(() => {
    console.log("tick", controller.signal.aborted);
  }, 1000);

  try {
    const client = new OpenAI({
      fetch: async (
        url: RequestInfo,
        init?: RequestInit
      ): Promise<Response> => {
        console.log("using node-fetch");
        const response = await fetch(url as any, init as any);
        return response as any;
      },
    });

    const resp = await client.chat.completions.create(
      {
        model: "gpt-4-0125-preview",
        messages: [
          {
            role: "system",
            content: "Answer in very long winded responses",
          },
          {
            role: "user",
            content: "What is the meaning of life?",
          },
        ],
        stream: true,
      },
      {
        signal: controller.signal,
      }
    );

    setTimeout(() => {
      try {
        console.log("aborting");
        controller.abort();
        console.log("aborted");
      } catch (e) {
        console.log(e);
      }
    }, 150);

    for await (const res of resp) {
      try {
        console.log(".");
      } catch (err) {
        console.error("err: ", err);
      }
    }  
  } catch (e) {
    console.error(e);
    throw e;
  }
}

run().catch((e) => {
  console.error("caught:", e);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err, origin) => {
  console.error("Uncaught Exception:", err, "origin:", origin);
});
