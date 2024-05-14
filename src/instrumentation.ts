import {NodeSDK} from '@opentelemetry/sdk-node'
import {ConsoleSpanExporter} from '@opentelemetry/sdk-trace-node'
import {getNodeAutoInstrumentations} from '@opentelemetry/auto-instrumentations-node'
import { Resource } from '@opentelemetry/resources'
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';

const resource = Resource.default().merge(
  new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'express-server',
    [SEMRESATTRS_SERVICE_VERSION]: '0.1.0',
  })
)

const sdk = new NodeSDK({
  resource: resource,
  traceExporter: new ConsoleSpanExporter(),
  // instrumentations: [getNodeAutoInstrumentations({
  //   '@opentelemetry/instrumentation-fs': {
  //     enabled: false
  //   }
  // })],
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
  ]
})

sdk.start()