import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();
    const specialty = (searchParams.get('specialty') || '').trim();
    const sql = await initDb();

    let clinics;
    if (q) {
      clinics = await sql`
        SELECT c.*,
          COALESCE(qu.total_issued,0) AS queue_size,
          COALESCE(qu.current_token,0) AS current_token
        FROM clinics c
        LEFT JOIN queues qu ON qu.clinic_id = c.id AND qu.date = CURRENT_DATE
        WHERE c.name ILIKE ${'%'+q+'%'}
           OR c.specialty ILIKE ${'%'+q+'%'}
           OR c.city ILIKE ${'%'+q+'%'}
        ORDER BY c.rating DESC`;
    } else if (specialty) {
      clinics = await sql`
        SELECT c.*,
          COALESCE(qu.total_issued,0) AS queue_size,
          COALESCE(qu.current_token,0) AS current_token
        FROM clinics c
        LEFT JOIN queues qu ON qu.clinic_id = c.id AND qu.date = CURRENT_DATE
        WHERE LOWER(c.specialty) = LOWER(${specialty})
        ORDER BY c.rating DESC`;
    } else {
      clinics = await sql`
        SELECT c.*,
          COALESCE(qu.total_issued,0) AS queue_size,
          COALESCE(qu.current_token,0) AS current_token
        FROM clinics c
        LEFT JOIN queues qu ON qu.clinic_id = c.id AND qu.date = CURRENT_DATE
        ORDER BY c.rating DESC`;
    }
    return NextResponse.json({ clinics });
  } catch (err) {
    console.error('Clinics list error:', err);
    return NextResponse.json({ error: 'Failed to load clinics', clinics: [] }, { status: 500 });
  }
}
