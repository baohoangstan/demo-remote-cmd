import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

const api = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
      console.log(files);
      //   await saveFile(files.file);
      return res.status(201).send('');
    });
  }
  //   res.status(403).send('no-permission');
};

export default api;
