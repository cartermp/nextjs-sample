import process from 'process'
import opentelemetry from '@opentelemetry/api'
import { Metadata, credentials } from '@grpc/grpc-js'
import { CollectorTraceExporter } from '@opentelemetry/exporter-collector-grpc'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { SimpleSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base'
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'

const HNY_KEY = process.env.HNY_KEY
const VERCEL_SAMPLE_DATASET = process.env.VERCEL_SAMPLE_DATASET
const SERVICE_NAME = process.env.PEOPLE_SERVICE

const metadata = new Metadata()
metadata.set('x-honeycomb-team', HNY_KEY);
metadata.set('x-honeycomb-dataset', VERCEL_SAMPLE_DATASET);
const traceExporter = new CollectorTraceExporter({
  url: 'grpc://api-dogfood.honeycomb.io/',
  credentials: credentials.createSsl(),
  metadata
});

const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: `${SERVICE_NAME}`,
  }),
});
provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter))
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()))
provider.register();

export const requestTracer = opentelemetry.trace.getTracer('request-tracer')
