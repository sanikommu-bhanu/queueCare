import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(req) {
  try {
    const { name, email, phone, password, role = 'patient' } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ error: 'Name, email and password required' }, { status: 400 });
    const sql = await initDb();
    const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase().trim()}`;
    if (existing.length > 0) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    const hash = await bcrypt.hash(password, 10);
    const [user] = await sql`
      INSERT INTO users (name, email, phone, password_hash, role)
      VALUES (${name.trim()}, ${email.toLowerCase().trim()}, ${phone || null}, ${hash}, ${role})
      RETURNING id, name, email, phone, role
    `;
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    return NextResponse.json({ token, user });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
