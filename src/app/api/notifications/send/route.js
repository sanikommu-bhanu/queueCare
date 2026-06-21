import { NextResponse } from 'next/server';
import webPush from 'web-push';
import { getDb } from '@/lib/db';

webPush.setVapidDetails(
  'mailto:test@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function POST(req) {
  try {
    const { token_id, token_number } = await req.json();

    if (!token_id) {
      return NextResponse.json({ error: 'Missing token_id' }, { status: 400 });
    }

    const sql = getDb();
    
    // Find all subscriptions for this token
    const subscriptions = await sql`
      SELECT endpoint, p256dh, auth FROM push_subscriptions
      WHERE token_id = ${token_id}
    `;

    if (subscriptions.length === 0) {
      return NextResponse.json({ success: true, message: 'No subscriptions found for this token' });
    }

    const payload = JSON.stringify({
      title: "🔔 Your Turn at QueueCare!",
      body: `Token #${String(token_number).padStart(3, '0')} - Please proceed to consultation room`,
      icon: '/icon.svg'
    });

    const sendPromises = subscriptions.map(async (sub) => {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        };
        await webPush.sendNotification(pushSubscription, payload);
      } catch (error) {
        if (error.statusCode === 404 || error.statusCode === 410) {
          // Subscription has expired or is no longer valid, delete it
          await sql`DELETE FROM push_subscriptions WHERE endpoint = ${sub.endpoint}`;
        } else {
          console.error('Error sending push notification:', error);
        }
      }
    });

    await Promise.all(sendPromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send notification error:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
