import { VercelRequest, VercelResponse } from '@vercel/node';
import { people } from './../data';

export default (request: VercelRequest, response: VercelResponse) => {
    const id = request.query["id"]
    if (typeof id !== "string") {
        response.status(404).send(`Bad request: ${request.query}`)
        return;
    }

    const filtered = people.filter(p => p.id === id)
    response.status(200).send(filtered);
};