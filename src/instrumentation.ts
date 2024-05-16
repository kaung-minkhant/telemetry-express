import { NodeSDK } from '@opentelemetry/sdk-node';
import opentelemetry from "@opentelemetry/api"
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
  // PeriodicExportingMetricReader,
  // ConsoleMetricExporter,
  MeterProvider
} from '@opentelemetry/sdk-metrics';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { Resource } from '@opentelemetry/resources';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces',
  headers: {}
})

const zipkinTraceExporter = new ZipkinExporter()

const metricExporter = new OTLPMetricExporter({
  url: 'http://localhost:4318/v1/metrics',
  headers: {}
})

const prometheusMetricReader = new PrometheusExporter({
  port: 9494, 
})

const resource = Resource.default().merge(
  new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'my-service',
    [SEMRESATTRS_SERVICE_VERSION]: '1.0'
  })
)

const meterProvider = new MeterProvider({
  resource: resource,
  readers: [prometheusMetricReader]
})

opentelemetry.metrics.setGlobalMeterProvider(meterProvider)

const sdk = new NodeSDK({
  resource: resource,
  traceExporter: zipkinTraceExporter,
  // metricReader: new PeriodicExportingMetricReader({
  //   exporter: metricExporter,
  // }),
  // metricReader: prometheusMetricReader,
  instrumentations: [getNodeAutoInstrumentations({
    '@opentelemetry/instrumentation-fs': {
      enabled: false
    }
  })],
});

sdk.start();