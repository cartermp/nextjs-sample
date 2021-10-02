import { VercelRequest, VercelResponse } from '@vercel/node';

export default (request: VercelRequest, response: VercelResponse) => {
  const json = request.method == "POST" ? request.body : "Hello World"
  console.log(json)
  response.status(200).send(json)
};