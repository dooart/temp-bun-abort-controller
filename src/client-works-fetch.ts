import { AbortController } from "abort-controller";
import fetch from "node-fetch";

const abortController = new AbortController();
const { signal } = abortController;

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err, origin) => {
  console.error("Uncaught Exception:", err, "origin:", origin);
});

async function run() {
  const url = "http://localhost:9999/events";

  try {
    const response = await fetch(url, { signal });
    if (response.body === null) throw new Error("Failed to get the stream.");

    // const reader = new Readable(response.body);

    if (response.body === null) throw new Error("Failed to get the stream.");

  for await (const chunk of response.body) {
    console.log(new TextDecoder().decode(chunk as Buffer));
    abortController.abort();
  }

  console.log("Stream ended.");
  } catch (err) {
    console.error("Error establishing stream:", err);
  }
}

console.log("starting...");

run()
  .then(() => {
    console.log("done");
  })
  .catch((e) => {
    console.error("caught");
  });
