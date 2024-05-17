import express, { Request, Express } from "express";
import { rollTheDice } from "./dice";
import { trace, metrics, Span } from "@opentelemetry/api";

const PORT: number = parseInt(process.env.PORT || "8080");
const app: Express = express();

const tracer = trace.getTracer("dice-server", "0.1.0");
const meter = metrics.getMeter("dice-server", "0.1.0");

// const userCounter = meter.createObservableCounter('dice-server.user.count')

// const users: string[] = []

// userCounter.addCallback(result => {
//   result.observe(users.length)
// })

// const interval = setInterval(() => {
//   users.push('a')
// }, 5000)

app.get("/rolldice", (req, res) => {
  return tracer.startActiveSpan("/rolldice", (span: Span) => {
    // const requestTimeHistogram = meter.createHistogram(
    //   "dice-server.rolldice.duration"
    // );
    // const startTime = new Date().getTime();
    // console.log(startTime);
    const rolls = req.query.rolls ? parseInt(req.query.rolls.toString()) : NaN;
    // const endTime = new Date().getTime();
    // console.log(endTime);
    // const executionTime = endTime - startTime;
    // requestTimeHistogram.record(executionTime);
    if (isNaN(rolls)) {
      res
        .status(400)
        .send("Request parameter 'rolls' is missing or not a number.");
      span.end();
      return;
    }
    res.send(JSON.stringify(rollTheDice(rolls, 1, 6)));
    span.end();
  });
});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});
