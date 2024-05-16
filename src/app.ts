import { metrics } from "@opentelemetry/api";
import express, { Request, Response } from "express";
const PORT: number = parseInt(process.env.PORT || '8080');
const app = express();

const meter = metrics.getMeter('dice-service', '1.0')

const userCount = meter.createObservableCounter('user.count')

const users: string[] = []

const interval = setInterval(() => users.push('a'), 3000)

userCount.addCallback((result) => {
  result.observe(users.length);
})

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

app.get('/rolldice', (req: Request, res: Response) => {
  res.send(getRandomNumber(1, 6).toString());
});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});