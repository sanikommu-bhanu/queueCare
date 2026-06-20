'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, Clock, Users, Ticket, MapPin, ChevronRight, Zap, Activity, CheckCircle, TrendingUp, Search } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { ClinicCardHorizontal } from '@/components/ClinicCard';
import TokenCard from '@/components/TokenCard';
import { useAppStore } from '@/store/useAppStore';
import { initials, pad } from '@/lib/utils';
import { DEMO_CLINICS } from '@/lib/images';

const SPECIALTIES = [
  { id:'all',           label:'All',          e:'🏥', img:'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=80&q=80' },
  { id:'General Medicine',label:'General',    e:'💊', img:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=80&q=80' },
  { id:'Cardiology',    label:'Heart',         e:'❤️', img:'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=80&q=80' },
  { id:'Dentistry',     label:'Dental',        e:'🦷', img:'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=80&q=80' },
  { id:'Neurology',     label:'Neuro',         e:'🧠', img:'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=80&q=80' },
  { id:'Ophthalmology', label:'Eye',           e:'👁️', img:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=80&q=80' },
  { id:'Orthopedics',   label:'Ortho',         e:'🦴', img:'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=80&q=80' },
  { id:'Pediatrics',    label:'Child',         e:'👶', img:'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=80&q=80' },
];

export default function HomePage() {
  const router = useRouter();
  const { user, currentToken, tokenHistory, notifications } = useAppStore();
  const [clinics, setClinics] = useState([]);
  const [stats, setStats] = useState({ total_clinics: 8, served_today: 248, waiting_now: 47 });
  const [specialty, setSpecialty] = useState('all');
  const [loading, setLoading] = useState(false);

  const h = typeof window !== 'undefined' ? new Date().getHours() : 10;
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!user?.id) { router.replace('/welcome'); return; }
    loadClinics();
    loadStats();
  }, [user]);

  const loadClinics = async () => {
    setLoading(true);
    try {
      const q = specialty !== 'all' ? `?specialty=${encodeURIComponent(specialty)}` : '';
      const res = await fetch(`/api/clinics/list${q}`);
      if (res.ok) { const d = await res.json(); if (d.clinics?.length) setClinics(d.clinics); }
    } catch {}
    setLoading(false);
  };

  const loadStats = async () => {
    try {
      const res = await fetch('/api/analytics/summary');
      if (res.ok) { const d = await res.json(); if (d.stats) setStats(s => ({ ...s, ...d.stats })); }
    } catch {}
  };

  useEffect(() => { if (user?.id) loadClinics(); }, [specialty]);

  if (!user?.id) return null;

  const featured = clinics.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* ── HERO ── */}
      <div className="relative" style={{ minHeight: 340 }}>
        <Image
          src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=900&q=90"
          alt="hospital" fill className="object-cover" style={{ position:'absolute',zIndex:0 }} sizes="430px" priority />
        <div className="absolute inset-0" style={{ background:'linear-gradient(160deg,rgba(12,36,97,0.95) 0%,rgba(9,132,227,0.88) 60%,rgba(0,137,123,0.7) 100%)', zIndex:1 }} />

        {/* Decorative circles */}
        <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full" style={{ background:'rgba(255,255,255,0.04)', zIndex:2 }} />
        <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 rounded-full" style={{ background:'rgba(255,255,255,0.04)', zIndex:2 }} />

        <div className="relative z-10 pt-14 px-5 pb-7">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/60 text-[13px]">{greeting} 👋</p>
              <h2 className="font-sora text-[22px] font-extrabold text-white mt-0.5">
                {user?.name?.split(' ')[0] || 'Friend'}
              </h2>
            </div>
            <div className="flex items-center gap-2.5">
              <Link href="/explore" className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(10px)' }}>
                <Search size={16} color="white" />
              </Link>
              <Link href="/notifications" className="w-10 h-10 rounded-xl flex items-center justify-center relative"
                style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(10px)' }}>
                <Bell size={16} color="white" />
                {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400" />}
              </Link>
              <div className="w-11 h-11 rounded-[14px] flex items-center justify-center border-2 border-white/25 overflow-hidden"
                style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(10px)' }}>
                <span className="font-sora font-extrabold text-white text-[16px]">{initials(user?.name)}</span>
              </div>
            </div>
          </div>

          {/* Active token card or CTA */}
          {currentToken ? (
            <Link href={`/token?id=${currentToken.id}`}
              className="block rounded-3xl p-5 relative overflow-hidden active:scale-[0.98] transition-transform"
              style={{ background:'linear-gradient(135deg,#f59e0b,#f97316)', boxShadow:'0 12px 40px rgba(245,158,11,0.5)' }}>
              <div className="absolute top-[-40px] right-[-40px] w-52 h-52 rounded-full bg-white/10" />
              <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 rounded-full bg-white/10" />
              <p className="text-white/80 text-[11px] font-bold uppercase tracking-[1.5px] mb-2 relative">🎟️ Active Token · Tap to Track</p>
              <div className="flex items-center justify-between relative">
                <div>
                  <p className="font-sora text-[56px] font-extrabold text-white leading-none">#{pad(currentToken.token_number)}</p>
                  <p className="text-white/85 text-[13px] mt-1 font-semibold">{currentToken.clinic_name}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="rounded-2xl px-4 py-3 text-center" style={{ background:'rgba(255,255,255,0.22)', backdropFilter:'blur(10px)' }}>
                    <p className="text-white font-sora font-extrabold text-[20px] leading-none">{currentToken.tokens_ahead ?? '?'}</p>
                    <p className="text-white/70 text-[10px] mt-0.5">ahead</p>
                  </div>
                  <div className="rounded-2xl px-3 py-2 text-center" style={{ background:'rgba(255,255,255,0.18)', backdropFilter:'blur(10px)' }}>
                    <p className="text-white font-sora font-bold text-[13px]">~{currentToken.estimated_wait_minutes||0}m wait</p>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="rounded-3xl p-5 relative overflow-hidden"
              style={{ background:'rgba(255,255,255,0.12)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.18)' }}>
              <div className="absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full bg-white/5" />
              <p className="text-white/60 text-[12px] mb-1 relative">No active queue</p>
              <h3 className="font-sora text-[22px] font-bold text-white mb-2 relative">Find a clinic nearby</h3>
              <p className="text-white/60 text-[13px] mb-5 relative">Get a digital token in seconds — skip the line</p>
              <div className="flex gap-2 relative">
                <Link href="/explore"
                  className="flex-1 flex items-center justify-center gap-2 bg-white text-blue-900 font-bold text-[13px] px-4 py-3 rounded-xl active:scale-95 transition-transform"
                  style={{ boxShadow:'0 4px 16px rgba(0,0,0,0.2)' }}>
                  <MapPin size={14} /> Find Clinics
                </Link>
                <Link href="/explore"
                  className="flex items-center justify-center gap-2 text-white font-bold text-[13px] px-4 py-3 rounded-xl active:scale-95 transition-transform"
                  style={{ background:'rgba(255,255,255,0.18)', backdropFilter:'blur(8px)' }}>
                  <Search size={14} /> Search
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-3 gap-3 mx-5 -mt-1 mb-5">
        {[
          [Activity, stats.total_clinics||'8+', 'Clinics Live',   '#0984e3','#e8f4fd'],
          [CheckCircle, stats.served_today||248, 'Served Today',  '#00897b','#e0f2f1'],
          [Users, stats.waiting_now||47, 'In Queue Now',          '#f59e0b','#fef3c7'],
        ].map(([Icon,v,l,c,bg],i)=>(
          <div key={i} className="bg-white rounded-2xl p-3.5 text-center" style={{ boxShadow:'0 4px 20px rgba(0,0,0,0.08)' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2" style={{background:bg}}>
              <Icon size={15} style={{color:c}} />
            </div>
            <p className="font-sora text-[20px] font-extrabold" style={{color:c,lineHeight:1}}>{v}</p>
            <p className="text-[10px] text-gray-400 mt-1">{l}</p>
          </div>
        ))}
      </div>

      {/* ── SPECIALTY SCROLL ── */}
      <div className="px-5 mb-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="section-title">Browse by Specialty</h3>
        </div>
      </div>
      <div className="flex gap-3 px-5 overflow-x-auto pb-1 mb-5">
        {SPECIALTIES.map(s => (
          <button key={s.id} onClick={() => setSpecialty(s.id)}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
            <div className="w-14 h-14 rounded-2xl overflow-hidden relative"
              style={{ border: specialty === s.id ? '2.5px solid #0984e3' : '2.5px solid transparent', boxShadow: specialty === s.id ? '0 4px 16px rgba(9,132,227,0.3)' : '0 2px 8px rgba(0,0,0,0.08)' }}>
              <Image src={s.img} alt={s.label} fill className="object-cover" sizes="56px" />
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: specialty === s.id ? 'rgba(9,132,227,0.5)' : 'rgba(0,0,0,0.2)' }}>
                <span className="text-[20px]">{s.e}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold" style={{ color: specialty === s.id ? '#0984e3' : '#94a3b8' }}>{s.label}</span>
          </button>
        ))}
      </div>

      {/* ── FEATURED CLINICS ── */}
      <div className="flex items-center justify-between px-5 mb-3">
        <h3 className="section-title">Top Clinics</h3>
        <Link href="/explore" className="text-[13px] font-bold flex items-center gap-1" style={{color:'#0984e3'}}>
          See all <ChevronRight size={13} />
        </Link>
      </div>
      <div className="flex gap-4 px-5 overflow-x-auto pb-3">
        {loading ? [1,2,3].map(i=>(
          <div key={i} className="bg-white rounded-3xl flex-shrink-0 w-[248px] h-[260px] animate-pulse" />
        )) : featured.map(c=>(
          <ClinicCardHorizontal key={c.id} clinic={c}
            onJoin={cl => router.push(`/queue?clinic_id=${cl.id}&name=${encodeURIComponent(cl.name)}&specialty=${encodeURIComponent(cl.specialty)}`)} />
        ))}
      </div>

      {/* ── DOCTOR SPOTLIGHT ── */}
      <div className="px-5 mt-5 mb-3">
        <h3 className="section-title mb-3">Our Top Doctors</h3>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {DEMO_CLINICS.slice(0,5).map(c => c.doctor && (
            <div key={c.id} className="flex-shrink-0 flex flex-col items-center gap-2 w-[72px]">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden"
                style={{ boxShadow:'0 4px 16px rgba(0,0,0,0.15)', border:'2px solid white' }}>
                <Image src={c.doctor.img} alt={c.doctor.name} fill className="object-cover" sizes="64px" />
              </div>
              <p className="text-[10px] font-bold text-gray-700 text-center leading-tight">{c.doctor.name.split(' ').slice(-1)[0]}</p>
              <p className="text-[9px] text-gray-400 text-center">{c.specialty.split(' ')[0]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUICK JOIN BANNER ── */}
      <div className="mx-5 mt-5 mb-5 rounded-3xl p-5 flex items-center gap-4 relative overflow-hidden"
        style={{ background:'linear-gradient(135deg,#0c2461,#0984e3)', boxShadow:'0 12px 40px rgba(12,36,97,0.40)' }}>
        <Image
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=80"
          alt="doctors" fill className="object-cover opacity-20" sizes="390px" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent" />
        <div className="relative z-10 flex items-center gap-4 w-full">
          <div className="w-12 h-12 rounded-[16px] flex items-center justify-center flex-shrink-0"
            style={{ background:'rgba(255,255,255,0.18)' }}>
            <Zap size={22} color="white" />
          </div>
          <div className="flex-1">
            <h4 className="font-sora text-[16px] font-bold text-white mb-1">Join a Queue Fast</h4>
            <p className="text-white/60 text-[12px]">Skip the line — get your token in 10 seconds</p>
          </div>
          <Link href="/explore"
            className="flex-shrink-0 font-sora font-bold text-[13px] px-4 py-2.5 rounded-[12px] text-white active:scale-95 transition-transform"
            style={{ background:'#f59e0b', boxShadow:'0 4px 16px rgba(245,158,11,0.5)' }}>
            Find →
          </Link>
        </div>
      </div>

      {/* ── RECENT VISITS ── */}
      <div className="px-5 mb-3"><h3 className="section-title">Recent Visits</h3></div>
      <div className="px-5 mb-6">
        {!tokenHistory?.length ? (
          <div className="bg-white rounded-3xl p-8 text-center" style={{ boxShadow:'0 4px 20px rgba(0,0,0,0.07)' }}>
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background:'#e8f4fd' }}>
              <Ticket size={28} style={{ color:'#0984e3' }} />
            </div>
            <p className="font-sora font-bold text-gray-600 mb-1">No visits yet</p>
            <p className="text-gray-400 text-[13px] mb-4">Join a clinic queue to get started</p>
            <Link href="/explore" className="inline-flex items-center gap-2 text-[13px] font-bold px-5 py-2.5 rounded-xl text-white"
              style={{ background:'linear-gradient(135deg,#1e3799,#0984e3)' }}>
              Find a Clinic <ChevronRight size={13} />
            </Link>
          </div>
        ) : (
          tokenHistory.slice(0,3).map(t => <TokenCard key={t.id} token={t} compact />)
        )}
      </div>

      <BottomNav />
    </div>
  );
}
