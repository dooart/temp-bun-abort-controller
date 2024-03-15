import express from "express";

const app = express();
const PORT = 9999;

app.get("/events", async (req, res) => {
  try {
    console.log("new connection");

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    req.on("close", () => {
      console.log("connection closed");
      throw "closed"
    });

    const data = Array.from({ length: 10 }, (_, i) => ({ message: `chunk ${i + 1}` }));

    for (const chunk of data) {
      console.log("sending chunk: ", chunk);
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      await new Promise((resolve) => setTimeout(resolve, 4000));
    }
    
    console.log("done sending chunks");
    res.write("done\n\n");

    console.log("closing connection\n\n");
    res.end();
  } catch (e) {
    if (e === "closed") {
      res.end();
    } else {
      throw e;
    }
  }
});

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
