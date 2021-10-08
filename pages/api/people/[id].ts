import { SpanStatusCode, Span } from '@opentelemetry/api'
import { VercelRequest, VercelResponse } from '@vercel/node'
import { people } from './../data'
import { requestTracer } from '../../../instrumentation-setup/functions-instrumentation'

const handleRequest = (request: VercelRequest, response: VercelResponse, span: Span) => {
    const id = request.query["id"]

    span.setAttribute('people-id', id)

    if (typeof id !== "string") {
      span.setStatus({ code: SpanStatusCode.ERROR })
      response.status(404).send(`Bad request: ${request.query}`)
      return
    }

    const person = people.find(p => p.id === id)
    if (!person) {
      span.setStatus({ code: SpanStatusCode.ERROR })
      response.status(404).send(`Bad ID: ${id}`)
      return
    }

    response.status(200).send(person)
}

const personHandler = (request: VercelRequest, response: VercelResponse) => {
  const span = requestTracer.startSpan('person-request')
  
  span.setAttributes({
    method: request.method,
    path: request.url,
    query: JSON.stringify(request.query),
    body: JSON.stringify(request.body),
    headers: JSON.stringify(request.headers)
  })

  try {
    handleRequest(request, response, span)
  } catch (error) {
    span.setStatus({ code: SpanStatusCode.ERROR })
    response.statusCode = 500
  } finally {
    span.end()
  }
}

export default personHandler