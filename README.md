# QueueCare – Smart Real-Time Clinic Queue Management

A full-stack, production-ready healthcare queue management platform built with Next.js 14, Neon PostgreSQL, and real-time updates.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
```
Edit `.env.local` and add your Neon PostgreSQL connection string:
```
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your_random_secret_here
```

### 3. Get a free Neon database
1. Go to https://console.neon.tech
2. Sign up free → New Project
3. Copy the connection string from "Connection Details"
4. Paste into `.env.local`

### 4. Run the app
```bash
npm run dev
```
Open http://localhost:3000

The database tables are created automatically on first run.

---

## 📱 Features

| Feature | Description |
|---|---|
| 🎟️ Digital Tokens | Patients get a unique token number without physical tokens |
| 📊 Live Queue Tracking | Real-time position, people ahead, estimated wait |
| 🔔 Call Notifications | Instant alerts when token is called |
| 🗣️ Voice Announcements | Text-to-speech token announcements (Web Speech API) |
| 💼 Receptionist Dashboard | Add patients, call next, manage entire queue |
| 📈 Analytics | Served today, waiting now, avg service time |
| 🏥 Multi-Clinic Support | Multiple clinics, each with own daily queue |
| 🔒 Auth | JWT-based login/register with role separation |
| 📱 Mobile-First | Optimized for phone screens, PWA-ready |

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── api/              # Backend REST API routes
│   │   ├── auth/         # login, register
│   │   ├── clinics/      # list clinics
│   │   ├── queue/        # add token, call next
│   │   ├── tokens/       # status, update
│   │   └── analytics/    # summary stats
│   ├── welcome/          # Onboarding slides
│   ├── auth/             # Login / Sign-up
│   ├── home/             # Dashboard
│   ├── explore/          # Find clinics
│   ├── queue/            # Join queue form
│   ├── token/            # Track my token
│   ├── receptionist/     # Receptionist dashboard
│   ├── notifications/    # Notification center
│   └── settings/         # Profile & settings
├── components/
│   ├── BottomNav.jsx
│   ├── ClinicCard.jsx
│   └── TokenCard.jsx
├── lib/
│   ├── db.js             # Neon DB connection + schema init
│   ├── auth.js           # JWT helpers
│   └── utils.js          # Utilities
└── store/
    └── useAppStore.js    # Zustand global state
```

---

## 🌐 Deploy to Vercel

```bash
npx vercel
```
Add environment variables in Vercel dashboard:
- `DATABASE_URL` – Neon connection string
- `JWT_SECRET` – random 32+ character string

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Zustand
- **Backend**: Next.js API Routes (serverless)
- **Database**: Neon PostgreSQL (serverless)
- **Auth**: JWT + bcryptjs
- **UI**: Lucide React icons, Google Fonts (Sora + Plus Jakarta Sans)
- **Notifications**: react-hot-toast + Web Speech API

---

## 👤 Demo Mode

If you haven't set up a database yet, the app runs in **demo mode**:
- Auth works (creates a local demo user)  
- Clinics are shown from static data
- Joining a queue creates a demo token with simulated queue movement
- Refresh every 15s simulates the queue moving forward

