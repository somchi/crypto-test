import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function page(req: NextApiRequest, res: NextApiResponse) {
  const parseBody = req.body;
  try {
    const data = await axios.get(
      'https://api-pub.bitfinex.com/v2/book/tBTCUSD/P0?len=25',
      { headers: { 'Content-Type': 'application/json' } }
    );
    res.status(200).json(data.data);
  } catch (error: any) {
    return res.status(error.status || 500).end(error.message);
  }
}
