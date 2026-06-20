'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Ticket, Clock, Bell, ChevronRight, Shield, Star } from 'lucide-react';

const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=900&q=90',
    badge: '🏥 Smart Queue',
    title: 'Skip the\nWaiting Room',
    sub: "Get a digital token from your phone. We'll alert you when it's almost your turn — wait from anywhere you like.",
    Icon: Ticket,
    iconColor: '#74b9ff',
    accent: '#0984e3',
  },
  {
    img: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=900&q=90',
    badge: '📊 Live Tracking',
    title: 'Real-Time\nQueue Updates',
    sub: 'See exactly how many patients are ahead. Watch your estimated wait shrink in real-time as the queue moves.',
    Icon: Clock,
    iconColor: '#80cbc4',
    accent: '#00897b',
  },
  {
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=90',
    badge: '🔔 Instant Alerts',
    title: 'Called? We\nNotify You Fast',
    sub: 'The moment your token is called, you get an instant notification and voice announcement. Zero crowding.',
    Icon: Bell,
    iconColor: '#ffd54f',
    accent: '#f59e0b',
  },
];

export default function WelcomePage() {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const slide = SLIDES[idx];
  const next = () => idx < SLIDES.length - 1 ? setIdx(i => i + 1) : router.replace('/auth');

  return (
    <div className="fixed inset-0 bg-black max-w-[430px] mx-auto overflow-hidden">
      {/* Background image */}
      <Image
        key={slide.img}
        src={slide.img}
        alt={slide.title}
        fill
        className="object-cover transition-opacity duration-700"
        sizes="430px"
        priority
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.93) 100%)' }} />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 pt-14 px-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)' }}>
            <span className="text-white text-[14px]">⚕️</span>
          </div>
          <span className="font-sora font-extrabold text-white text-[16px]">QueueCare</span>
        </div>
        <button onClick={() => router.replace('/auth')}
          className="text-white/65 text-[13px] font-bold px-4 py-2 rounded-full border border-white/20"
          style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}>
          Skip →
        </button>
      </div>

      {/* Floating stats pill */}
      <div className="absolute top-28 left-5 z-10 flex items-center gap-2 px-3 py-2 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.22)' }}>
        <div className="flex -space-x-2">
          {['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&q=80','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&q=80','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&q=80'].map((u,i)=>(
            <img key={i} src={u} alt="" className="w-7 h-7 rounded-full border-2 border-white/40 object-cover" />
          ))}
        </div>
        <div>
          <p className="text-white font-bold text-[12px]">50,000+</p>
          <p className="text-white/60 text-[10px]">patients served</p>
        </div>
      </div>

      {/* Rating pill */}
      <div className="absolute top-28 right-5 z-10 flex items-center gap-1.5 px-3 py-2 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.22)' }}>
        <Star size={12} fill="#fbbf24" color="#fbbf24" />
        <span className="text-white font-bold text-[13px]">4.9</span>
        <span className="text-white/60 text-[10px]">rating</span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-12 flex flex-col items-start">
        {/* Badge */}
        <div className="mb-4 px-3 py-1.5 rounded-full text-[11px] font-bold"
          style={{ background: slide.accent + '33', color: slide.iconColor, border: `1px solid ${slide.accent}55`, backdropFilter: 'blur(8px)' }}>
          {slide.badge}
        </div>

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <slide.Icon size={26} color={slide.iconColor} />
        </div>

        {/* Title */}
        <h1 className="font-sora text-[34px] font-extrabold text-white leading-tight mb-4 whitespace-pre-line">
          {slide.title}
        </h1>
        <p className="text-white/70 text-[15px] leading-relaxed mb-8 max-w-[340px]">{slide.sub}</p>

        {/* Dots */}
        <div className="flex gap-2 mb-7">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              style={{ height: 6, borderRadius: 99, background: i === idx ? slide.iconColor : 'rgba(255,255,255,0.3)', width: i === idx ? 28 : 8, transition: 'all 0.3s' }} />
          ))}
        </div>

        {/* CTA */}
        <button onClick={next}
          className="w-full py-4 text-white font-sora font-bold text-[16px] rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
          style={{ background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}cc)`, backdropFilter: 'blur(10px)', boxShadow: `0 8px 32px ${slide.accent}55` }}>
          {idx < SLIDES.length - 1 ? 'Continue' : 'Get Started for Free'}
          <ChevronRight size={20} />
        </button>

        {/* Trust line */}
        <div className="flex items-center justify-center gap-3 mt-4 w-full">
          <Shield size={12} className="text-white/40" />
          <span className="text-white/40 text-[11px]">No credit card required · Free forever</span>
        </div>
      </div>
    </div>
  );
}
