import webPush from 'web-push';
import { getDb } from '@/lib/db';

export async function sendPushNotification(token_id, token_number) {
  try {
    if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
      webPush.setVapidDetails(
        'mailto:test@example.com',
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      );
    } else {
      console.warn('Missing VAPID keys. Skipping push notification.');
      return;
    }

    const sql = getDb();
    
    // Find all subscriptions for this token
    const subscriptions = await sql`
      SELECT endpoint, p256dh, auth FROM push_subscriptions
      WHERE token_id = ${token_id}
    `;

    if (subscriptions.length === 0) return;

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
          await sql`DELETE FROM push_subscriptions WHERE endpoint = ${sub.endpoint}`;
        } else {
          console.error('Error sending push notification:', error);
        }
      }
    });

    await Promise.all(sendPromises);
  } catch (err) {
    console.error('Push notification error:', err);
  }
}
