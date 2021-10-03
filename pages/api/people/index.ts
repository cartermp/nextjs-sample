import { SpanStatusCode } from '@opentelemetry/api'
import { VercelRequest, VercelResponse } from '@vercel/node'
import { people } from './../data'
import { requestTracer } from '../../../instrumentation-setup/lambda-wrapper'

const peopleHanlder = (request: VercelRequest, response: VercelResponse) => {
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
            response.status(200).send(people);
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

export default peopleHanlder