import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { sign } from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { phone, otp, role = 'patient' } = await req.json();
    if (!phone || !otp) return NextResponse.json({ error: 'Phone and OTP required' }, { status: 400 });

    const sql = getDb();
    
    const [record] = await sql`SELECT * FROM otps WHERE phone=${phone} AND otp=${otp} AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1`;
    if (!record) return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });

    await sql`DELETE FROM otps WHERE id=${record.id}`;

    let [user] = await sql`SELECT * FROM users WHERE phone=${phone} LIMIT 1`;
    if (!user) {
      const defaultName = 'User ' + phone.slice(-4);
      const defaultEmail = `${phone}@queuecare.local`;
      const [newUser] = await sql`INSERT INTO users (name, email, phone, role) VALUES (${defaultName}, ${defaultEmail}, ${phone}, ${role}) RETURNING *`;
      user = newUser;
    }

    const token = sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      token
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}
