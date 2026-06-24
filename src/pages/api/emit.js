export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { event, data } = req.body;

  if (!event) {
    return res.status(400).json({ error: 'Event name is required' });
  }

  // Check if the socket server has been initialized and exposed
  if (res.socket.server.io) {
    res.socket.server.io.emit(event, data);
    return res.status(200).json({ success: true });
  } else {
    // If the socket server isn't initialized yet, we can't emit
    console.warn('Socket.IO not initialized on server yet.');
    return res.status(503).json({ error: 'Socket.IO not initialized' });
  }
}
