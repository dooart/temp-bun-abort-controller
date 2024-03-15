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

run()
  .then(() => {
    console.log("done");
  })
  .catch((e) => {
    console.error("caught");
  });
