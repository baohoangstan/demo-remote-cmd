import { NextApiRequest } from 'next';
import { Server } from 'socket.io';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

export const config = {
  api: {
    bodyParse: false,
  },
};

const socketio = async (req: NextApiRequest, res) => {
  //   await CorsMiddleware(req, res);

  if (res.socket?.server?.io) {
    console.log('Already set up');
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  let interval;

  let childProcess: ChildProcessWithoutNullStreams;

  const CMD = 'ping';
  const ARGS = ['-c', '5', 'google.com.vn'];

  const onConnection = (socket) => {
    // messageHandler(io, socket);
    socket.on('start', (data) => {
      // interval = setInterval(() => socket.emit('data', { data: 'ok!' }), 1000);
      let cmd = CMD,
        args = [...ARGS];
      if (data) {
        const dataArr = data.split(' ');
        cmd = dataArr[0];
        dataArr.splice(0, 1);
        args = [...dataArr];
      }

      childProcess = spawn(cmd, args);
      childProcess.on('error', (e) => {
        socket.emit('error', e);
      });
      childProcess.on('exit', () => {
        socket.emit('stopped', true);
      });
      childProcess.stderr.on('data', (chunk) =>
        socket.emit('data', chunk.toString())
      );
      childProcess.stdout.on('data', (chunk) =>
        socket.emit('data', chunk.toString())
      );
      socket.emit('started', true);
    });

    socket.on('stop', () => {
      // clearInterval(interval);
      if (childProcess) {
        childProcess.kill();
        childProcess = null;
      }
      socket.emit('stopped', true);
    });
  };
  io.on('connection', onConnection);

  console.log('Setting up socket');
  res.end();
};

export default socketio;
