import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export async function PATCH(req) {
  try {
    const { clinic_id, avg_wait_minutes } = await req.json();
    
    if (!clinic_id || typeof avg_wait_minutes !== 'number') {
      return NextResponse.json({ error: 'clinic_id and valid avg_wait_minutes required' }, { status: 400 });
    }

    const sql = await initDb();
    
    const [clinic] = await sql`
      UPDATE clinics 
      SET avg_wait_minutes = ${avg_wait_minutes} 
      WHERE id = ${clinic_id} 
      RETURNING *
    `;

    if (!clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });
    }

    return NextResponse.json({ clinic });
  } catch (err) {
    console.error('Update wait time error:', err);
    return NextResponse.json({ error: 'Failed to update average wait time' }, { status: 500 });
  }
}
