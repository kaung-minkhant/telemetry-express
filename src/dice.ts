import { Span, SpanStatusCode, trace, metrics } from "@opentelemetry/api";
import {
  SEMATTRS_CODE_FUNCTION,
  SEMATTRS_CODE_FILEPATH,
} from "@opentelemetry/semantic-conventions";

const tracer = trace.getTracer("dice-lib");
const meter = metrics.getMeter('dice-lib')

// const counter = meter.createCounter('dice-lib.rolls.counter', {
//   description: 'How many times the dice is rolled',
//   unit: 'times',
// })

function rollOnce(i: number, min: number, max: number) {
  // counter.add(1)
  // return tracer.startActiveSpan(`rollOnce:${i}`, (span: Span) => {
    const result = Math.floor(Math.random() * (max - min) + min);
    // span.setAttribute("dicelib.rolled", result);
    // span.end();
    return result;
  // });
}

export function rollTheDice(rolls: number, min: number, max: number) {
  return tracer.startActiveSpan(
    "rollTheDice",
    { attributes: { rolls: rolls } },
    (span: Span) => {
      span.setAttribute(SEMATTRS_CODE_FUNCTION, "rollTheDice");
      span.setAttribute(SEMATTRS_CODE_FILEPATH, __filename);
      span.addEvent("Doing something");
      const result: number[] = [];
      for (let i = 0; i < rolls; i++) {
        result.push(rollOnce(i, min, max));
      }
      span.end();
      return result;
    }
  );
}
