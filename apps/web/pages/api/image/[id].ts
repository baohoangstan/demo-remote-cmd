import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

const imageApi = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    console.log('[imageApi] =>', req.query);
    const { id, frame } = req.query;
    if (!id || !frame) return res.status(400).send('bad-request');

    const filePath = `/home/dev/phuong/frame/frame_${id}_${frame}.jpg`;

    if (fs.existsSync(filePath)) {
      const image = fs.readFileSync(filePath);
      res.setHeader('Content-Type', 'image/jpg');
      return res.send(image);
    }
    return res.status(404).send('file-not-found');
  }
  res.status(404).send('no-data');
};
export default imageApi;
