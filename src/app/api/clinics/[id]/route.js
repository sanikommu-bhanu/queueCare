import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    if (!id) return NextResponse.json({ error: 'clinic id required' }, { status: 400 });

    const sql = await initDb();

    const [clinic] = await sql`
      SELECT c.*,
        COALESCE(qu.total_issued,0) AS queue_size,
        COALESCE(qu.current_token,0) AS current_token
      FROM clinics c
      LEFT JOIN queues qu ON qu.clinic_id = c.id AND qu.date = CURRENT_DATE
      WHERE c.id = ${id}
    `;

    if (!clinic) return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });

    return NextResponse.json({ clinic });
  } catch (err) {
    console.error('Clinic fetch error:', err);
    return NextResponse.json({ error: 'Failed to load clinic' }, { status: 500 });
  }
}
