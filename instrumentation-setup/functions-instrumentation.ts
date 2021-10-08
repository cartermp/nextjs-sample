import process from 'process'
import opentelemetry from '@opentelemetry/api'
import { Metadata, credentials } from '@grpc/grpc-js'
import { CollectorTraceExporter } from '@opentelemetry/exporter-collector-grpc'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { SimpleSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base'
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'

const metadata = new Metadata()
metadata.set('x-honeycomb-team', process.env.HNY_KEY);
metadata.set('x-honeycomb-dataset', process.env.VERCEL_SAMPLE_DATASET);
const traceExporter = new CollectorTraceExporter({
  url: 'grpc://api-dogfood.honeycomb.io/',
  credentials: credentials.createSsl(),
  metadata
});

{
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.PEOPLE_SERVICE,
  }),
}

const provider = new NodeTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter))
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()))
provider.register();

export const requestTracer = opentelemetry.trace.getTracer('request-tracer')
