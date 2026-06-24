import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';
import { sendPushNotification } from '@/lib/push';
import { sendSMSNotification } from '@/lib/sms';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clinic_id = searchParams.get('clinic_id');
    if (!clinic_id) return NextResponse.json({ error: 'clinic_id required' }, { status: 400 });
    const sql = await initDb();
    const [queue] = await sql`SELECT * FROM queues WHERE clinic_id=${clinic_id} AND date=CURRENT_DATE`;
    if (!queue) return NextResponse.json({ queue: null, current_token: 0, total_issued: 0, tokens: [] });
    const tokens = await sql`SELECT * FROM tokens WHERE queue_id=${queue.id} ORDER BY token_number ASC`;
    return NextResponse.json({ queue, current_token: queue.current_token, total_issued: queue.total_issued, tokens });
  } catch (err) {
    console.error('Queue GET error:', err);
    return NextResponse.json({ error: 'Failed to load queue' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { clinic_id, action = 'next' } = await req.json();
    if (!clinic_id) return NextResponse.json({ error: 'clinic_id required' }, { status: 400 });
    const sql = await initDb();
    const [queue] = await sql`SELECT * FROM queues WHERE clinic_id=${clinic_id} AND date=CURRENT_DATE`;
    if (!queue) return NextResponse.json({ error: 'No active queue for today' }, { status: 404 });

    // Mark current serving/called as done or skipped
    const previousStatus = action === 'skip' ? 'skipped' : 'done';
    await sql`UPDATE tokens SET status=${previousStatus}, served_at=NOW() WHERE queue_id=${queue.id} AND status IN ('serving','called')`;

    // Find next waiting token atomically
    const [next] = await sql`
      WITH next_token AS (
        SELECT id FROM tokens 
        WHERE queue_id=${queue.id} AND status='waiting' 
        ORDER BY token_number ASC 
        LIMIT 1 
        FOR UPDATE SKIP LOCKED
      )
      UPDATE tokens 
      SET status='called', called_at=NOW() 
      WHERE id = (SELECT id FROM next_token) 
      RETURNING *`;

    if (!next) return NextResponse.json({ queue_empty: true, message: 'Queue is empty' });

    await sql`UPDATE queues SET current_token=${next.token_number} WHERE id=${queue.id}`;
    
    // Emit event to update queue
    try {
      const url = new URL(req.url);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || url.origin;
      await fetch(`${siteUrl}/api/emit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'queueUpdated', data: { clinic_id } }),
      });
    } catch (e) {
      console.error('Failed to emit socket event:', e);
    }

    // Trigger push notification to that patient
    await sendPushNotification(next.id, next.token_number);

    // Trigger mock SMS notification
    if (next.patient_phone) {
      const [clinic] = await sql`SELECT name FROM clinics WHERE id=${clinic_id}`;
      const clinicName = clinic ? clinic.name : 'the clinic';
      await sendSMSNotification(
        next.patient_phone, 
        `QueueCare Alert 🔔: Your token #${next.token_number} at ${clinicName} has been called! Please proceed immediately.`
      );
    }

    return NextResponse.json({ token: { ...next, status: 'called' }, current_number: next.token_number });
  } catch (err) {
    console.error('Queue next error:', err);
    return NextResponse.json({ error: 'Failed to call next token' }, { status: 500 });
  }
}
