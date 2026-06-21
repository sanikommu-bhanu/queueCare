import { neon } from '@neondatabase/serverless';

let _sql = null;

export function getDb() {
  if (!_sql) {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.');
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}

export async function initDb() {
  const sql = getDb();

  await sql`CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT,
    role TEXT DEFAULT 'patient',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    phone TEXT,
    image_url TEXT,
    rating NUMERIC(2,1) DEFAULT 4.5,
    avg_wait_minutes INTEGER DEFAULT 15,
    is_open BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS queues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    current_token INTEGER DEFAULT 0,
    total_issued INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(clinic_id, date)
  )`;

  await sql`CREATE TABLE IF NOT EXISTS tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_id UUID REFERENCES queues(id) ON DELETE CASCADE,
    clinic_id UUID REFERENCES clinics(id),
    patient_id UUID REFERENCES users(id),
    patient_name TEXT NOT NULL,
    patient_phone TEXT,
    token_number INTEGER NOT NULL,
    status TEXT DEFAULT 'waiting',
    reason TEXT,
    called_at TIMESTAMPTZ,
    served_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL,
    otp TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    token_id UUID REFERENCES tokens(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE INDEX IF NOT EXISTS idx_tokens_queue ON tokens(queue_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_tokens_clinic ON tokens(clinic_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_tokens_status ON tokens(status)`;

  // Seed clinics
  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM clinics`;
  if (count === 0) {
    await sql`INSERT INTO clinics (name,specialty,address,city,phone,image_url,rating,avg_wait_minutes) VALUES
      ('Apollo Clinic','General Medicine','14 MG Road, Koramangala','Bangalore','+91 80 2345 6789','https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&q=80',4.8,12),
      ('City Heart Center','Cardiology','22 Park Street, Sector 5','Delhi','+91 11 9876 5432','https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&q=80',4.6,20),
      ('Neuro Care Clinic','Neurology','8 Lake View Road, Bandra','Mumbai','+91 22 5678 9012','https://images.unsplash.com/photo-1551076805-e1869033e561?w=500&q=80',4.7,18),
      ('Smile Dental Studio','Dentistry','3 Commercial Street, Jayanagar','Bangalore','+91 80 3456 7890','https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&q=80',4.9,10),
      ('Vision Eye Clinic','Ophthalmology','67 Anna Salai, T Nagar','Chennai','+91 44 7890 1234','https://images.unsplash.com/photo-1588776814546-1ffbb180d46b?w=500&q=80',4.5,15),
      ('Medilife Hospital','Multi-Specialty','45 Hiranandani Gardens, Powai','Mumbai','+91 22 4567 8901','https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=500&q=80',4.7,25)
    `;
  }

  return sql;
}
