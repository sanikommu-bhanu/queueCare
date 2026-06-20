'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, MapPin, X, SlidersHorizontal } from 'lucide-react';
import { ClinicCardFull } from '@/components/ClinicCard';
import BottomNav from '@/components/BottomNav';
import { DEMO_CLINICS } from '@/lib/images';

const SPECIALTIES = [
  { id:'all',           label:'All',          img:'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=120&q=80' },
  { id:'General Medicine',label:'General',    img:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=120&q=80' },
  { id:'Cardiology',    label:'Cardiology',   img:'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=120&q=80' },
  { id:'Dentistry',     label:'Dental',       img:'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=120&q=80' },
  { id:'Neurology',     label:'Neuro',        img:'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=120&q=80' },
  { id:'Ophthalmology', label:'Eye Care',     img:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=120&q=80' },
  { id:'Orthopedics',   label:'Ortho',        img:'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=120&q=80' },
  { id:'Pediatrics',    label:'Pediatrics',   img:'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=120&q=80' },
  { id:'Multi-Specialty',label:'Multi',       img:'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=120&q=80' },
];

export default function ExplorePage() {
  const router = useRouter();
  const [clinics, setClinics] = useState([]);
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('all');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (query) p.set('q', query);
      if (specialty !== 'all') p.set('specialty', specialty);
      const res = await fetch(`/api/clinics/list?${p}`);
      if (res.ok) { const d = await res.json(); if (d.clinics?.length) setClinics(d.clinics); }
    } catch {}
    setLoading(false);
  }, [query, specialty]);

  useEffect(() => { const t = setTimeout(load, 350); return () => clearTimeout(t); }, [load]);

  const filtered = clinics.filter(c => {
    const mq = !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.city.toLowerCase().includes(query.toLowerCase()) || c.specialty.toLowerCase().includes(query.toLowerCase());
    const ms = specialty === 'all' || c.specialty === specialty;
    return mq && ms;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Header with background image */}
      <div className="relative overflow-hidden" style={{ paddingTop: 52, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
        <Image src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&q=85" alt="doctors"
          fill className="object-cover" sizes="430px" />
        <div className="absolute inset-0" style={{ background:'linear-gradient(135deg,rgba(12,36,97,0.93),rgba(9,132,227,0.87))' }} />
        <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-white/5" />

        <div className="relative z-10">
          <h1 className="font-sora text-[24px] font-extrabold text-white mb-1">Find a Clinic</h1>
          <p className="text-white/60 text-[13px] mb-4">Discover top-rated clinics & join instantly</p>
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search clinic, specialty, city..."
              className="w-full py-3.5 pl-11 pr-10 bg-white rounded-2xl text-[14px] text-gray-900 placeholder:text-gray-400 outline-none"
              style={{ boxShadow:'0 8px 32px rgba(0,0,0,0.20)' }} />
            {query && <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2"><X size={14} className="text-gray-400" /></button>}
          </div>
        </div>
      </div>

      {/* Specialty image scroll */}
      <div className="flex gap-3 px-5 py-4 overflow-x-auto">
        {SPECIALTIES.map(s => (
          <button key={s.id} onClick={() => setSpecialty(s.id)}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
            <div className="w-14 h-14 rounded-2xl overflow-hidden relative"
              style={{ border: specialty === s.id ? '2.5px solid #0984e3' : '2.5px solid transparent', boxShadow: specialty === s.id ? '0 4px 16px rgba(9,132,227,0.35)' : '0 2px 8px rgba(0,0,0,0.08)' }}>
              <Image src={s.img} alt={s.label} fill className="object-cover" sizes="56px" />
              <div className="absolute inset-0" style={{ background: specialty === s.id ? 'rgba(9,132,227,0.45)' : 'rgba(0,0,0,0.18)' }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: specialty === s.id ? '#0984e3' : '#94a3b8' }}>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[14px] text-gray-500 font-semibold">
            {filtered.length} clinic{filtered.length !== 1 ? 's' : ''} found
          </p>
          <div className="flex items-center gap-2">
            {loading && <div className="w-4 h-4 border-2 border-brand-mid border-t-transparent rounded-full animate-spin" />}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center" style={{ boxShadow:'0 4px 20px rgba(0,0,0,0.07)' }}>
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gray-50">
              <MapPin size={28} className="text-gray-300" />
            </div>
            <p className="font-sora font-bold text-gray-500 mb-1">No clinics found</p>
            <p className="text-gray-400 text-[13px]">Try a different search or specialty</p>
          </div>
        ) : (
          filtered.map(c => (
            <ClinicCardFull key={c.id} clinic={c}
              onJoin={cl => router.push(`/queue?clinic_id=${cl.id}&name=${encodeURIComponent(cl.name)}&specialty=${encodeURIComponent(cl.specialty)}`)} />
          ))
        )}
      </div>
      <BottomNav />
    </div>
  );
}
