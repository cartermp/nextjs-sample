import { SpanStatusCode } from '@opentelemetry/api'
import { VercelRequest, VercelResponse } from '@vercel/node'
import { people } from './../data'
import { requestTracer } from '../../../instrumentation-setup/functions-instrumentation'

const handleRequest = (request: VercelRequest, response: VercelResponse) => {
    const id = request.query["id"]
    if (typeof id !== "string") {
        response.status(404).send(`Bad request: ${request.query}`)
        return
    }

    const person = people.find(p => p.id === id)
    if (!person) {
        response.status(404).send(`Bad ID: ${id}`)
        return
    }

    response.status(200).send(person)
}

const personHandler = (request: VercelRequest, response: VercelResponse) => {
    requestTracer.startActiveSpan('request', span => {
        span.setStatus({
          code: SpanStatusCode.OK,
        })
    
        span.setAttributes({
          method: request.method,
          path: request.url,
          query: JSON.stringify(request.query),
          body: JSON.stringify(request.body),
          headers: JSON.stringify(request.headers),
        })
    
        try {
            handleRequest(request, response)
        } catch (error) {
          span.setStatus({
            code: SpanStatusCode.ERROR,
          })
          request.statusCode = 500
        } finally {
          span.end()
        }
      })
};

export default personHandler