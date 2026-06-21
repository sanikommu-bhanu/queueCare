import { NextResponse } from 'next/server';
import { sendPushNotification } from '@/lib/push';

export async function POST(req) {
  try {
    const { token_id, token_number } = await req.json();

    if (!token_id) {
      return NextResponse.json({ error: 'Missing token_id' }, { status: 400 });
    }

    await sendPushNotification(token_id, token_number);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send notification error:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
