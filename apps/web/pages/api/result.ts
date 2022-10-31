import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const resultApi = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    console.log('[resultApi] =>', req.body);
    const filePath = path.resolve('apps/web/mocks/data_hsv.json');
    console.log('filePath', filePath);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));
      if (data && data.length) {
        data.forEach((row, index) => {
          const frames = [];

          for (const frame_id of row.frame_id) {
            if (frames.length > 3) break;
            const framePath = `/home/dev/phuong/frame/frame_${row.id_doituong}_${frame_id}.jpg`;
            if (fs.existsSync(framePath)) {
              frames.push(frame_id);
            }
          }
          data[index].frame_id = frames;
        });
      }
      return res.json(data);
    }
    return res.status(404).send('no-data');
  }
  res.status(404).send('no-route');
};

export default resultApi;
