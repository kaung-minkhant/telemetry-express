import express, { Request, Response } from "express";
const PORT: number = parseInt(process.env.PORT || '8080');
const app = express();

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

app.get('/rolldice', (req: Request, res: Response) => {
  res.send(getRandomNumber(1, 6).toString());
});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});

process.on('SIGINT', function () {
  process.exit();
});