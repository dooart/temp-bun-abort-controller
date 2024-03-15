import fetch from "node-fetch";
import { AbortController } from "abort-controller";

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err, origin) => {
  console.error("Uncaught Exception:", err, "origin:", origin);
});

process.on("SIGINT", () => {
  console.log("SIGINT received");
  process.exit(0);
});

process.on("beforeExit", () => {
  console.log("beforeExit received");
});

process.on("exit", () => {
  console.log("exit received");
});

async function run() {
  const abortController = new AbortController();
  const { signal } = abortController;
  const url = "http://localhost:9999/events";

  const response = await fetch(url, { signal });
  console.log("Connected to server");

  if (response.body === null) throw new Error("Failed to get the stream.");

  for await (const chunk of response.body) {
    console.log(new TextDecoder().decode(chunk as Buffer));
    abortController.abort();
  }

  console.log("Stream ended.");
}

console.log("starting...");

run()
  .then(() => {
    console.log("done");
  })
  .catch((e) => {
    console.error("caught");
  });
