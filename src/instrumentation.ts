import { Span } from "@opentelemetry/api";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import {
  ExpressInstrumentation,
  ExpressRequestInfo,
} from "@opentelemetry/instrumentation-express";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { Resource } from "@opentelemetry/resources";
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  ParentBasedSampler,
  SimpleSpanProcessor,
  TraceIdRatioBasedSampler,
} from "@opentelemetry/sdk-trace-base";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { SEMRESATTRS_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { Request } from "express";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { serviceSyncDetector } from "opentelemetry-resource-detector-service";

const init = function (serviceName: string, metricPort: number) {
  // debug
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);

  // traces
  const traceExporter = new OTLPTraceExporter({
  });


  const serviceResources = serviceSyncDetector.detect()
  const customResources = new Resource({
    'custom-resource': 1,
    // [SEMRESATTRS_SERVICE_NAME]: 'my-service'
  })
  const traceProvider = new NodeTracerProvider({
    resource: serviceResources.merge(customResources),
    // resource: customResources,
    sampler: new ParentBasedSampler({
      root: new TraceIdRatioBasedSampler(1),
    }),
  });


  traceProvider.addSpanProcessor(new BatchSpanProcessor(traceExporter));
  traceProvider.register();
  registerInstrumentations({
    instrumentations: [
      new HttpInstrumentation(),
      new ExpressInstrumentation({
        requestHook: (span: Span, reqInfo: ExpressRequestInfo<Request>) => {
          span.setAttribute(
            "http.request.headers",
            JSON.stringify(reqInfo.request.headers)
          );
        },
      }),
    ],
  });

  const tracer = traceProvider.getTracer(serviceName);
  return { tracer };
};

export default init;
