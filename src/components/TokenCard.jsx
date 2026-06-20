'use client';
import Image from 'next/image';
import { Clock, Users, PhoneCall, Bell, MapPin } from 'lucide-react';
import { pad, STATUS } from '@/lib/utils';

export default function TokenCard({ token, compact = false }) {
  const sc = STATUS[token.status] || STATUS.waiting;

  if (compact) {
    return (
      <div className="bg-white rounded-2xl p-4 flex items-center gap-3 mb-2"
        style={{ boxShadow:'0 4px 16px rgba(0,0,0,0.07)' }}>
        <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background:'linear-gradient(135deg,#1e3799,#0984e3)' }}>
          <span className="font-sora font-extrabold text-white text-[16px]">{pad(token.token_number)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sora text-[14px] font-bold text-gray-900 truncate">{token.clinic_name}</p>
          <p className="text-[12px] text-gray-400">{token.clinic_specialty}</p>
        </div>
        <div className="px-2.5 py-1 rounded-full text-[11px] font-bold flex-shrink-0"
          style={{ background: sc.bg, color: sc.text }}>{sc.label}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow:'0 12px 48px rgba(0,0,0,0.14)' }}>
      {/* Gradient header with hospital image */}
      <div className="relative px-6 pt-8 pb-10 text-center overflow-hidden">
        {/* Background hospital image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80"
            alt="hospital" fill className="object-cover opacity-20" sizes="430px" />
        </div>
        <div className="absolute inset-0" style={{ background:'linear-gradient(135deg,#0c2461ee,#0984e3ee)' }} />
        <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute bottom-[-60px] left-[-20px] w-40 h-40 rounded-full bg-white/5" />

        <p className="relative text-white/60 text-[11px] font-bold uppercase tracking-[2px] mb-4">Your Token</p>

        {/* Token number */}
        <div className="bounce-in relative w-[130px] h-[130px] rounded-[32px] bg-white/10 border-2 border-white/20 flex items-center justify-center mx-auto mb-5 token-pulse">
          <span className="font-sora font-extrabold text-white text-[52px] leading-none">{pad(token.token_number)}</span>
        </div>

        <p className="relative font-sora font-bold text-white text-[18px] mb-1">{token.clinic_name}</p>
        <div className="relative flex items-center justify-center gap-1.5 text-white/60">
          <MapPin size={11} />
          <span className="text-[12px]">{token.clinic_specialty}</span>
        </div>
      </div>

      {/* Status badge */}
      <div className="mx-5 mt-4 py-3 rounded-2xl flex items-center justify-center gap-2"
        style={{ background: sc.bg }}>
        <div className="w-2 h-2 rounded-full status-live" style={{ background: sc.dot }} />
        <span className="font-sora font-bold text-[15px]" style={{ color: sc.text }}>{sc.label}</span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 p-5">
        {[
          [Users,  token.tokens_ahead ?? '—', 'Ahead',    '#0984e3'],
          [Clock,  token.estimated_wait_minutes > 0 ? `${token.estimated_wait_minutes}m` : 'Now', 'Est. Wait', '#00897b'],
          [PhoneCall, token.current_token||0, 'Serving',  '#f59e0b'],
        ].map(([Icon,v,l,c],i)=>(
          <div key={i} className="bg-gray-50 rounded-2xl p-3 text-center">
            <Icon size={16} style={{color:c,margin:'0 auto 6px'}} />
            <p className="font-sora text-[22px] font-extrabold text-gray-900" style={{lineHeight:1}}>{v}</p>
            <p className="text-[10px] text-gray-400 mt-1.5">{l}</p>
          </div>
        ))}
      </div>

      {/* Called alert */}
      {token.status === 'called' && (
        <div className="mx-5 mb-4 p-4 rounded-2xl flex items-center gap-3"
          style={{ background:'#fef3c7', border:'1.5px solid #f59e0b' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background:'#f59e0b' }}>
            <Bell size={18} color="white" />
          </div>
          <div>
            <p className="font-bold text-[14px]" style={{color:'#92400e'}}>You've been called!</p>
            <p className="text-[12px] text-gray-500">Please proceed to the consultation room now</p>
          </div>
        </div>
      )}

      {/* Patient + reason */}
      <div className="px-5 pb-5 space-y-2 border-t border-gray-50 pt-4">
        {token.patient_name && (
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-gray-400">Patient</span>
            <span className="font-semibold text-gray-900">{token.patient_name}</span>
          </div>
        )}
        {token.reason && (
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-gray-400">Reason</span>
            <span className="font-semibold text-gray-900">{token.reason}</span>
          </div>
        )}
        {token.created_at && (
          <div className="flex justify-between items-center text-[13px]">
            <span className="text-gray-400">Issued at</span>
            <span className="font-semibold text-gray-700">{new Date(token.created_at).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span>
          </div>
        )}
      </div>
    </div>
  );
}
