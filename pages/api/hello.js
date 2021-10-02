// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  throw Error('whoopsie')
  res.status(200).json({ name: 'poopy' })
}
