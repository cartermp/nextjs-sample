import opentelemetry from '@opentelemetry/api'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { AwsLambdaInstrumentation } from '@opentelemetry/instrumentation-aws-lambda'
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'

const provider = new NodeTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()))
provider.register();

registerInstrumentations({
  instrumentations: [
    new AwsLambdaInstrumentation({
        // see under for available configuration
    })
  ],
});

export const requestTracer = opentelemetry.trace.getTracer('request-tracer')
