const abortController = new AbortController();
const { signal } = abortController;

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
  const url = "http://localhost:9999/events";

  try {
    const response = await fetch(url, { signal });
    if (response.body === null) throw new Error("Failed to get the stream.");

    const reader = response.body.getReader();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      console.log(value);
      abortController.abort();
    }
  } catch (err) {
    console.error("Error establishing stream:", err);
  }
}

console.log("starting...");

setInterval(() => {
  console.log("tick");
}, 1000);

run()
  .then(() => {
    console.log("done");
  })
  .catch((e) => {
    console.error("caught");
  });
