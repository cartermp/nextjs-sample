import { VercelRequest, VercelResponse } from '@vercel/node';

const helloHandler = (request: VercelRequest, response: VercelResponse) => {
  let qry = request.query["name"]
  if (typeof qry === "string") {
    response.status(200).send(`Hello ${qry}`)
  } else {
    response.status(404).send(`Hello World`)
  }
};

export default helloHandler