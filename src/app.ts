import init from "./instrumentation";
init("telemetry", 8081);

import express, { Request, Response } from "express";
const PORT: number = parseInt(process.env.PORT || "8080");
const app = express();
import * as api from "@opentelemetry/api";
import axios from "axios";

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

app.get("/rolldice", async (req: Request, res: Response) => {
  try {
    res.send(getRandomNumber(1, 6).toString());
  } catch (error) {
    const activeSpan = api.trace.getSpan(api.context.active());
    activeSpan?.recordException(error);
    res.status(500).send("internal server error");
  }
});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});

// setInterval(async () => {
//   api.trace
//     .getTracer("manualllll")
//     .startActiveSpan("Refresh cache", async (span: api.Span) => {
//       console.log("helelo")
//       // const response = await axios(
//       //   "https://jsonplaceholder.typicode.com/todos/"
//       // );
//       span.end();
//     });
// }, 10000);
