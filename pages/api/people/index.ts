import { SpanStatusCode } from '@opentelemetry/api'
import { VercelRequest, VercelResponse } from '@vercel/node'
import { people } from './../data'
import { requestTracer } from '../../../instrumentation-setup/functions-instrumentation'

const peopleHandler = (request: VercelRequest, response: VercelResponse) => {
  const span = requestTracer.startSpan('people-request')
  
  span.setAttributes({
    method: request.method,
    path: request.url,
    query: JSON.stringify(request.query),
    body: JSON.stringify(request.body),
    headers: JSON.stringify(request.headers)
  })

  try {
    response.status(200).send(people)
  } catch (error) {
    span.setStatus({ code: SpanStatusCode.ERROR })
    response.statusCode = 500
  } finally {
    span.end()
  }
}

export default peopleHandler