import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clinic_id = searchParams.get('clinic_id');
    const sql = await initDb();

    if (clinic_id) {
      const rows = await sql`
        SELECT
          COUNT(*) FILTER (WHERE t.status='done') AS served_today,
          COUNT(*) FILTER (WHERE t.status='waiting') AS waiting_now,
          COUNT(*) FILTER (WHERE t.status='called') AS called_now,
          COALESCE(AVG(EXTRACT(EPOCH FROM (t.served_at - t.created_at))/60) FILTER (WHERE t.served_at IS NOT NULL),0) AS avg_service_minutes,
          COALESCE(q.current_token,0) AS current_token,
          COALESCE(q.total_issued,0) AS total_issued
        FROM queues q
        LEFT JOIN tokens t ON t.queue_id=q.id
        WHERE q.clinic_id=${clinic_id} AND q.date=CURRENT_DATE
        GROUP BY q.current_token, q.total_issued`;
      return NextResponse.json({ stats: rows[0] || { served_today:0, waiting_now:0, called_now:0, avg_service_minutes:0, current_token:0, total_issued:0 } });
    }

    const [global] = await sql`
      SELECT
        COUNT(DISTINCT c.id) AS total_clinics,
        COALESCE(SUM(q.total_issued),0) AS total_tokens_today,
        COUNT(t.id) FILTER (WHERE t.status='done') AS served_today,
        COUNT(t.id) FILTER (WHERE t.status='waiting') AS waiting_now
      FROM clinics c
      LEFT JOIN queues q ON q.clinic_id=c.id AND q.date=CURRENT_DATE
      LEFT JOIN tokens t ON t.queue_id=q.id`;
    return NextResponse.json({ stats: global });
  } catch (err) {
    console.error('Analytics error:', err);
    return NextResponse.json({ error: 'Failed to load analytics', stats: {} }, { status: 500 });
  }
}
