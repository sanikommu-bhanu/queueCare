import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';
import { sendPushNotification } from '@/lib/push';

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
    const { clinic_id } = await req.json();
    if (!clinic_id) return NextResponse.json({ error: 'clinic_id required' }, { status: 400 });
    const sql = await initDb();
    const [queue] = await sql`SELECT * FROM queues WHERE clinic_id=${clinic_id} AND date=CURRENT_DATE`;
    if (!queue) return NextResponse.json({ error: 'No active queue for today' }, { status: 404 });

    // Mark current serving/called as done
    await sql`UPDATE tokens SET status='done', served_at=NOW() WHERE queue_id=${queue.id} AND status IN ('serving','called')`;

    // Find next waiting token
    const [next] = await sql`SELECT * FROM tokens WHERE queue_id=${queue.id} AND status='waiting' ORDER BY token_number ASC LIMIT 1`;
    if (!next) return NextResponse.json({ queue_empty: true, message: 'Queue is empty' });

    await sql`UPDATE tokens SET status='called', called_at=NOW() WHERE id=${next.id}`;
    await sql`UPDATE queues SET current_token=${next.token_number} WHERE id=${queue.id}`;
    
    // Emit event to update queue
    if (global.io) {
      global.io.emit('queueUpdated', { clinic_id });
    }

    // Trigger push notification to that patient
    await sendPushNotification(next.id, next.token_number);

    return NextResponse.json({ token: { ...next, status: 'called' }, current_number: next.token_number });
  } catch (err) {
    console.error('Queue next error:', err);
    return NextResponse.json({ error: 'Failed to call next token' }, { status: 500 });
  }
}
