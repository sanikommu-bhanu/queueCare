import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'queuecare_dev_secret_change_in_prod';

export const signToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: '30d' });

export const verifyToken = (token) => {
  try { return jwt.verify(token, SECRET); }
  catch { return null; }
};

export const getTokenFromRequest = (req) => {
  const auth = req.headers.get('authorization') || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
};
