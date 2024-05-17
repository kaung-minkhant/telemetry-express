import opentelemetry from '@opentelemetry/api'
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import {
  MeterProvider,
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
  View,
  ExplicitBucketHistogramAggregation,
  InstrumentType
} from '@opentelemetry/sdk-metrics';
import { Resource } from '@opentelemetry/resources';
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';


const resource = Resource.default().merge(
  new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'yourServiceName',
    [SEMRESATTRS_SERVICE_VERSION]: '1.0',
  })
)

const metricReader = new PeriodicExportingMetricReader({
  exporter: new ConsoleMetricExporter(),
  exportIntervalMillis: 10000,
})

const customHistogramView = new View({
  aggregation: new ExplicitBucketHistogramAggregation([
    0, 1, 5, 10, 15
  ]),
  instrumentName: 'dice-server.rolldice.duration',
  instrumentType: InstrumentType.HISTOGRAM
})

const myServiceMeterProvider = new MeterProvider({
  resource: resource,
  // views: [customHistogramView],
  readers: [metricReader]
})

opentelemetry.metrics.setGlobalMeterProvider(myServiceMeterProvider)

const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces',
})
console.log(traceExporter.url)

const sdk = new NodeSDK({
  resource: resource,
  traceExporter: traceExporter,
  // metricReader: new PeriodicExportingMetricReader({
  //   exporter: new ConsoleMetricExporter(),
  // }),
});

sdk.start();