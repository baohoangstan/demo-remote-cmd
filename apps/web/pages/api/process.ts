import { NextApiRequest, NextApiResponse } from 'next';

const processApi = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    console.log('[processApi] =>', req.body);
    return res.status(201).send('OK');
  }
  res.status(403).send('no-permission');
};

export default processApi;
