import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token_id = searchParams.get('token_id');
    if (!token_id) return NextResponse.json({ error: 'token_id required' }, { status: 400 });
    const sql = await initDb();
    const [token] = await sql`
      SELECT t.*, c.name AS clinic_name, c.specialty AS clinic_specialty, c.avg_wait_minutes,
             q.current_token, q.total_issued
      FROM tokens t
      JOIN clinics c ON c.id = t.clinic_id
      JOIN queues q ON q.id = t.queue_id
      WHERE t.id = ${token_id}`;
    if (!token) return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    const tokensAhead = Math.max(0, token.token_number - token.current_token - 1);
    const waitMins = tokensAhead * (token.avg_wait_minutes || 15);
    return NextResponse.json({ token: { ...token, tokens_ahead: tokensAhead, estimated_wait_minutes: waitMins } });
  } catch (err) {
    console.error('Token status error:', err);
    return NextResponse.json({ error: 'Failed to get token status' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { token_id, status } = await req.json();
    if (!token_id || !status) return NextResponse.json({ error: 'token_id and status required' }, { status: 400 });
    const valid = ['waiting','called','serving','done','skipped'];
    if (!valid.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    const sql = await initDb();
    const [token] = await sql`
      UPDATE tokens SET status=${status},
        called_at = CASE WHEN ${status}='called' THEN NOW() ELSE called_at END,
        served_at = CASE WHEN ${status}='done' THEN NOW() ELSE served_at END
      WHERE id=${token_id} RETURNING *`;
    return NextResponse.json({ token });
  } catch (err) {
    console.error('Token PATCH error:', err);
    return NextResponse.json({ error: 'Failed to update token' }, { status: 500 });
  }
}
