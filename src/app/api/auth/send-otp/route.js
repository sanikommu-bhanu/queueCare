import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req) {
  try {
    const { phone } = await req.json();
    if (!phone) return NextResponse.json({ error: 'Phone number required' }, { status: 400 });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const sql = getDb();

    await sql`INSERT INTO otps (phone, otp, expires_at) VALUES (${phone}, ${otp}, NOW() + INTERVAL '10 minutes')`;

    const apiKey = process.env.FAST2SMS_API_KEY;
    if (apiKey) {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          variables_values: otp,
          route: 'otp',
          numbers: phone
        })
      });
      if (!response.ok) {
        console.error('Fast2SMS error:', await response.text());
      }
    } else {
      console.warn('FAST2SMS_API_KEY is not set. The generated OTP is:', otp);
    }

    return NextResponse.json({ success: true, message: 'OTP sent' });
  } catch (err) {
    console.error('Send OTP error:', err);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
