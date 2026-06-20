'use client';
import Image from 'next/image';
import { Star, MapPin, Clock, Users, ChevronRight, Phone } from 'lucide-react';
import { SPECIALTY_STYLE } from '@/lib/utils';

export function ClinicCardHorizontal({ clinic, onJoin }) {
  const sp = SPECIALTY_STYLE[clinic.specialty] || { bg: '#f1f5f9', color: '#64748b' };
  const waiting = Math.max(0, (clinic.queue_size||0) - (clinic.current_token||0));

  return (
    <div className="bg-white rounded-3xl shadow-card overflow-hidden flex-shrink-0 w-[248px]"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}>
      {/* Image */}
      <div className="relative h-[130px]">
        <Image
          src={clinic.image_url || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400'}
          alt={clinic.name} fill className="object-cover" sizes="248px" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Rating */}
        <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur rounded-full px-2 py-1 flex items-center gap-1"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          <Star size={10} fill="#f59e0b" color="#f59e0b" />
          <span className="text-[11px] font-bold text-gray-900">{clinic.rating}</span>
          {clinic.reviews && <span className="text-[10px] text-gray-400">({(clinic.reviews/1000).toFixed(1)}k)</span>}
        </div>

        {/* Status */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-full"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}>
          <div className={`w-1.5 h-1.5 rounded-full ${clinic.is_open ? 'bg-green-400' : 'bg-gray-400'}`}
            style={{ animation: clinic.is_open ? 'statusBlink 1.5s ease-in-out infinite' : 'none' }} />
          <span className="text-white text-[10px] font-bold">{clinic.is_open ? 'Open' : 'Closed'}</span>
        </div>

        {/* Specialty tag */}
        <div className="absolute bottom-2.5 left-2.5 rounded-full px-2.5 py-1 text-[10px] font-bold"
          style={{ background: sp.bg, color: sp.color }}>
          {clinic.specialty}
        </div>

        {/* Doctor photo overlay */}
        {clinic.doctor?.img && (
          <div className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full border-2 border-white overflow-hidden"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            <Image src={clinic.doctor.img} alt={clinic.doctor.name} fill className="object-cover" sizes="36px" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5">
        <h4 className="font-sora text-[14px] font-bold text-gray-900 truncate mb-1">{clinic.name}</h4>
        <div className="flex items-center gap-1 text-gray-400 mb-3">
          <MapPin size={10} /><span className="text-[11px] truncate">{clinic.city}</span>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-center">
            <p className="font-sora text-[16px] font-extrabold" style={{ color:'#0984e3', lineHeight:1 }}>{clinic.current_token||0}</p>
            <p className="text-[9px] text-gray-400 mt-0.5">Now</p>
          </div>
          <div className="w-px h-6 bg-gray-100" />
          <div className="text-center">
            <p className="font-sora text-[16px] font-extrabold text-gray-700" style={{ lineHeight:1 }}>{waiting}</p>
            <p className="text-[9px] text-gray-400 mt-0.5">Waiting</p>
          </div>
          <div className="w-px h-6 bg-gray-100" />
          <div className="text-center">
            <p className="font-sora text-[16px] font-extrabold" style={{ color:'#00897b', lineHeight:1 }}>~{clinic.avg_wait_minutes}m</p>
            <p className="text-[9px] text-gray-400 mt-0.5">Wait</p>
          </div>
        </div>

        <button onClick={() => onJoin?.(clinic)}
          className="w-full py-2.5 text-white text-[12px] font-bold rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-1.5"
          style={{ background: 'linear-gradient(135deg,#1e3799,#0984e3)' }}>
          Join Queue <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

export function ClinicCardFull({ clinic, onJoin }) {
  const sp = SPECIALTY_STYLE[clinic.specialty] || { bg: '#f1f5f9', color: '#64748b' };
  const waiting = Math.max(0, (clinic.queue_size||0) - (clinic.current_token||0));

  return (
    <div className="bg-white rounded-3xl overflow-hidden mb-3" style={{ boxShadow:'0 4px 24px rgba(0,0,0,0.09)' }}>
      <div className="flex gap-0">
        {/* Left image strip */}
        <div className="relative w-[90px] flex-shrink-0">
          <Image
            src={clinic.image_url || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=200'}
            alt={clinic.name} fill className="object-cover" sizes="90px" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
          {/* Doctor badge at bottom */}
          {clinic.doctor?.img && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
              <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden" style={{ boxShadow:'0 2px 8px rgba(0,0,0,0.3)' }}>
                <Image src={clinic.doctor.img} alt="" fill className="object-cover" sizes="40px" />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-sora text-[15px] font-bold text-gray-900 leading-tight">{clinic.name}</h4>
            <div className="flex items-center gap-1 flex-shrink-0 bg-amber-50 px-2 py-0.5 rounded-full">
              <Star size={10} fill="#f59e0b" color="#f59e0b" />
              <span className="text-[12px] font-bold text-amber-700">{clinic.rating}</span>
            </div>
          </div>

          <span className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold mb-2"
            style={{ background: sp.bg, color: sp.color }}>{clinic.specialty}</span>

          {clinic.doctor && (
            <p className="text-[11px] text-gray-500 mb-1.5 font-medium">{clinic.doctor.name} · {clinic.doctor.exp}</p>
          )}

          <div className="flex items-center gap-1 text-gray-400 mb-0">
            <MapPin size={10} />
            <span className="text-[11px] truncate">{clinic.address}, {clinic.city}</span>
          </div>
        </div>
      </div>

      {/* Bottom stats + CTA */}
      <div className="border-t border-gray-50 px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-3 flex-1">
          {[[(clinic.current_token||0),'Serving','#0984e3','#e8f4fd'],[waiting,'Waiting','#334155','#f1f5f9'],[`~${clinic.avg_wait_minutes}m`,'Avg Wait','#00897b','#e0f2f1']].map(([v,l,c,bg],i)=>(
            <div key={i} className="text-center px-2.5 py-1.5 rounded-xl" style={{ background:bg }}>
              <p className="font-sora text-[16px] font-extrabold" style={{color:c,lineHeight:1}}>{v}</p>
              <p className="text-[9px] text-gray-400 mt-0.5">{l}</p>
            </div>
          ))}
        </div>
        <button onClick={() => onJoin?.(clinic)} disabled={!clinic.is_open}
          className="text-white text-[13px] font-bold px-4 py-2.5 rounded-xl active:scale-95 transition-transform disabled:opacity-40 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#1e3799,#0984e3)' }}>
          Join →
        </button>
      </div>

      {/* Opening times */}
      {clinic.timing && (
        <div className="border-t border-gray-50 px-4 py-2.5 flex items-center gap-2">
          <Clock size={11} className="text-gray-300" />
          <span className="text-[11px] text-gray-400">{clinic.timing}</span>
          <div className="ml-auto flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${clinic.is_open ? 'bg-green-400' : 'bg-gray-300'}`}
              style={{ animation: clinic.is_open ? 'statusBlink 1.5s ease-in-out infinite' : 'none' }} />
            <span className={`text-[11px] font-bold ${clinic.is_open ? 'text-green-600' : 'text-gray-400'}`}>
              {clinic.is_open ? 'Open Now' : 'Closed'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
