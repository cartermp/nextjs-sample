import { VercelRequest, VercelResponse } from '@vercel/node';
import { people } from './../data';

export default (_: VercelRequest, response: VercelResponse) => {
    response.status(200).send(people);
};