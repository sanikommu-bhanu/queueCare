import { io } from 'socket.io-client';

// Initialize the socket globally on the client side
let socket = null;

export const initSocket = () => {
  if (!socket) {
    // We hit the Next.js API route we just created to ensure the server starts
    fetch('/api/socketio').finally(() => {
      socket = io(process.env.NEXT_PUBLIC_SITE_URL || '', {
        path: '/api/socketio',
        autoConnect: true,
      });
    });
  }
  return socket;
};

export const getSocket = () => socket;
