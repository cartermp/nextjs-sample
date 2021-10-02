import { SpanStatusCode } from '@opentelemetry/api'
import { VercelRequest, VercelResponse } from '@vercel/node'
import { people } from './../data'
import { requestTracer } from '../../../instrumentation-setup/lambda-wrapper'

const handler = (request: VercelRequest, response: VercelResponse) => {
    requestTracer.startActiveSpan('request', (span) => {
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
            const id = request.query["id"]
            if (typeof id !== "string") {
                response.status(404).send(`Bad request: ${request.query}`)
                return
            }
        
            const filtered = people.filter(p => p.id === id)
            if (!filtered.length) {
                response.status(404).send(`Bad ID: ${id}`)
                return
            }
        
            response.status(200).send(filtered);
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

export default handler