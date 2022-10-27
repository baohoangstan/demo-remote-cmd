import styles from './index.module.less';
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Space,
  Typography,
  Upload,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import TextArea from '../components/TextAreaResult/text-area';

let socket;

export function Index() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState('');
  const [state, setState] = useState('default');
  const [cmd, setCmd] = useState('ping -c 3 google.com.vn');
  const [cwd, setCwd] = useState('');

  // const uploadFile = (file) => {
  //   const form = new FormData();
  //   form.append('file', file, 'video.mp4');
  //   fetch('/api/upload', {
  //     method: 'post',
  //     body: form,
  //   });
  //   return false;
  // };

  useEffect(() => {
    socketInit();
    return () => stop();
  }, []);

  const message = (data) => {
    let text = typeof data !== 'string' ? JSON.stringify(data) : data;
    text = text.trim();
    return new Date().toISOString() + ' | ' + text;
  };

  const socketInit = async () => {
    await fetch('/api/socketio');

    socket = io();

    socket.on('connect', () => setState('stopped'));

    socket.on('data', (data) => {
      setResult((value) => {
        return value + '\r\n' + message(data);
      });
    });

    socket.on('started', () => {
      setLoading(false);
      setState('started');
      setResult((value) => {
        return value + '\r\n' + message('Started');
      });
    });

    socket.on('stopped', () => {
      setLoading(false);
      setState('stopped');
      setResult((value) => {
        if (!value) return '';
        return value + '\r\n' + message('Stopped');
      });
    });

    socket.on('error', (data) => {
      setResult((value) => {
        if (!value) return '';
        return value + '\r\n' + message(data);
      });
    });
  };

  const start = () => {
    if (!socket || !cmd) return;
    setLoading(true);
    socket.emit('start', { cmd, cwd });
  };

  const stop = () => {
    if (!socket) return;
    setLoading(true);
    socket.emit('stop');
  };

  return (
    <div className={styles.page}>
      <div>
        <Typography.Title>Demo AI</Typography.Title>
      </div>
      <div>
        <Space>
          <Button disabled={state !== 'stopped' || !cmd} onClick={start}>
            Start
          </Button>
          <Button disabled={state !== 'started'} onClick={stop}>
            Stop
          </Button>
          <Button onClick={() => setResult('')}>Clear</Button>
        </Space>
      </div>
      <br />
      <div>
        <label>Câu lệnh:</label>
        <Input value={cmd} onChange={(e) => setCmd(e.target.value)} />
      </div>
      <br />
      <div>
        <label>Đường dẫn:</label>
        <Input
          value={cwd}
          placeholder={'/home/user'}
          onChange={(e) => setCwd(e.target.value)}
        />
      </div>
      <Divider />
      <div>
        <label>Kết quả:</label>
        <TextArea value={result} />
      </div>
      {/* <div>
        <Form>
          <Form.Item name="file">
            <Upload
              action={'/api/upload'}
              // beforeUpload={(file) => uploadFile(file)}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </div> */}
    </div>
  );
}

export default Index;
