import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter, TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} from '@opentelemetry/sdk-metrics';

const samplerRatio = 0.1;

const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(),
  sampler: new TraceIdRatioBasedSampler(samplerRatio),
  // metricReader: new PeriodicExportingMetricReader({
  //   exporter: new ConsoleMetricExporter(),
  // }),
  instrumentations: [getNodeAutoInstrumentations({
    '@opentelemetry/instrumentation-fs': {enabled: false}
  })],
});

sdk.start();