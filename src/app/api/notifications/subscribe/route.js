import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req) {
  try {
    const { subscription, token_id } = await req.json();

    if (!subscription || !subscription.endpoint || !token_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sql = getDb();
    
    await sql`
      INSERT INTO push_subscriptions (token_id, endpoint, p256dh, auth)
      VALUES (
        ${token_id}, 
        ${subscription.endpoint}, 
        ${subscription.keys.p256dh}, 
        ${subscription.keys.auth}
      )
      ON CONFLICT (endpoint) DO UPDATE 
      SET token_id = ${token_id}, p256dh = ${subscription.keys.p256dh}, auth = ${subscription.keys.auth}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
