import { Server } from 'socket.io';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log('*First use, starting Socket.IO');
    const io = new Server(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
    });

    res.socket.server.io = io;
    global.io = io; // Expose to App Router
  }
  res.end();
}
