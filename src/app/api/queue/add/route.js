import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export async function POST(req) {
  try {
    const { clinic_id, patient_name, patient_phone, patient_id, reason } = await req.json();
    if (!clinic_id || !patient_name) return NextResponse.json({ error: 'clinic_id and patient_name required' }, { status: 400 });
    const sql = await initDb();

    // Get or create today's queue
    let [queue] = await sql`SELECT * FROM queues WHERE clinic_id=${clinic_id} AND date=CURRENT_DATE`;
    if (!queue) {
      [queue] = await sql`INSERT INTO queues(clinic_id,date,current_token,total_issued,is_active) VALUES(${clinic_id},CURRENT_DATE,0,0,true) RETURNING *`;
    }
    if (!queue.is_active) return NextResponse.json({ error: 'Queue is closed for today' }, { status: 400 });

    const tokenNumber = queue.total_issued + 1;
    await sql`UPDATE queues SET total_issued=${tokenNumber} WHERE id=${queue.id}`;
    const [token] = await sql`
      INSERT INTO tokens(queue_id,clinic_id,patient_id,patient_name,patient_phone,token_number,reason,status)
      VALUES(${queue.id},${clinic_id},${patient_id||null},${patient_name},${patient_phone||null},${tokenNumber},${reason||null},'waiting')
      RETURNING *`;
    const [clinic] = await sql`SELECT name,specialty,avg_wait_minutes FROM clinics WHERE id=${clinic_id}`;
    const tokensAhead = Math.max(0, tokenNumber - queue.current_token - 1);
    const waitMins = tokensAhead * (clinic?.avg_wait_minutes || 15);

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

    return NextResponse.json({
      token: { ...token, clinic_name: clinic?.name, clinic_specialty: clinic?.specialty, tokens_ahead: tokensAhead, estimated_wait_minutes: waitMins }
    });
  } catch (err) {
    console.error('Queue add error:', err);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}
