'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, User, Phone, FileText, Clock, Users, Loader2, Star } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { DEMO_CLINICS } from '@/lib/images';
import toast from 'react-hot-toast';

const REASONS = ['General Checkup','Follow-up Visit','Prescription Renewal','Lab Report Review','New Complaint','Emergency'];

function QueueForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const clinicId   = sp.get('clinic_id');
  const clinicName = sp.get('name') || 'Clinic';
  const clinicSpec = sp.get('specialty') || '';
  const { user, setCurrentToken, addTokenToHistory, pushNotification } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ patient_name: user?.name||'', patient_phone: user?.phone||'', reason:'' });

  // Find clinic data for rich display
  const clinic = DEMO_CLINICS.find(c=>c.id===clinicId) || { image_url:'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=85', doctor:null, rating:4.8, avg_wait_minutes:15, queue_size:6 };

  const join = async () => {
    if (!form.patient_name.trim()) { toast.error('Please enter your name'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/queue/add', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ clinic_id:clinicId, patient_name:form.patient_name, patient_phone:form.patient_phone, patient_id:user?.id, reason:form.reason }),
      });
      let token;
      if (res.ok) {
        const d = await res.json();
        token = { ...d.token, clinic_name:clinicName, clinic_specialty:clinicSpec };
      } else {
        throw new Error('api-fail');
      }
      finalize(token);
    } catch {
      const num = Math.floor(Math.random()*15)+5;
      const token = {
        id:'demo-'+Date.now(), token_number:num, clinic_id:clinicId, clinic_name:clinicName, clinic_specialty:clinicSpec,
        patient_name:form.patient_name, reason:form.reason, status:'waiting',
        tokens_ahead: Math.floor(Math.random()*8)+2, estimated_wait_minutes: Math.floor(Math.random()*25)+8,
        current_token: Math.floor(Math.random()*5), created_at: new Date().toISOString(),
      };
      finalize(token);
    }
  };

  const finalize = (token) => {
    setCurrentToken(token);
    addTokenToHistory(token);
    pushNotification({ title:'Token Generated! 🎟️', body:`Token #${String(token.token_number).padStart(3,'0')} at ${clinicName}`, type:'token' });
    toast.success(`Token #${String(token.token_number).padStart(3,'0')} generated!`);
    router.replace(`/token?id=${token.id}`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clinic hero image */}
      <div className="relative overflow-hidden" style={{ height: 220 }}>
        <Image src={clinic.image_url} alt={clinicName} fill className="object-cover" sizes="430px" priority />
        <div className="absolute inset-0" style={{ background:'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(12,36,97,0.88) 100%)' }} />

        <div className="absolute top-0 left-0 right-0 pt-14 px-5">
          <button onClick={()=>router.back()} className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-4">
            <ArrowLeft size={18} color="white" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <div className="flex items-end justify-between">
            <div>
              <span className="inline-block bg-white/20 backdrop-blur text-white text-[11px] font-bold px-3 py-1 rounded-full mb-2">{clinicSpec}</span>
              <h1 className="font-sora text-[22px] font-extrabold text-white mb-1">{clinicName}</h1>
              <div className="flex items-center gap-2">
                <Star size={12} fill="#f59e0b" color="#f59e0b" />
                <span className="text-white/80 text-[12px] font-semibold">{clinic.rating} rating</span>
                <span className="text-white/40">·</span>
                <span className="text-white/60 text-[12px]">~{clinic.avg_wait_minutes}m avg wait</span>
              </div>
            </div>
            {clinic.doctor?.img && (
              <div className="w-14 h-14 rounded-2xl border-2 border-white/40 overflow-hidden flex-shrink-0"
                style={{ boxShadow:'0 4px 16px rgba(0,0,0,0.4)' }}>
                <Image src={clinic.doctor.img} alt={clinic.doctor.name} fill className="object-cover" sizes="56px" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pt-5">
        {/* Stats pills */}
        <div className="flex gap-2 mb-5 overflow-x-auto">
          {[[Clock,`~${clinic.avg_wait_minutes}m`,'Avg wait','#00897b','#e0f2f1'],[Users,`${clinic.queue_size||0}`,'In queue','#0984e3','#e8f4fd']].map(([I,v,l,c,bg],i)=>(
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl flex-shrink-0" style={{background:bg}}>
              <I size={14} style={{color:c}} />
              <span className="font-sora font-extrabold text-[14px]" style={{color:c}}>{v}</span>
              <span className="text-[11px] text-gray-500">{l}</span>
            </div>
          ))}
        </div>

        {/* Patient details */}
        <div className="bg-white rounded-3xl p-5 mb-4" style={{ boxShadow:'0 4px 20px rgba(0,0,0,0.07)' }}>
          <h3 className="font-sora font-bold text-gray-900 text-[16px] mb-4">Patient Details</h3>
          {[{k:'patient_name',l:'Full Name *',I:User,t:'text',p:'Enter patient name'},{k:'patient_phone',l:'Mobile Number',I:Phone,t:'tel',p:'For SMS notifications'}].map(({k,l,I,t,p})=>(
            <div key={k} className="mb-4">
              <label className="block text-[13px] font-bold text-gray-500 mb-2">{l}</label>
              <div className="relative">
                <I size={16} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={t} value={form[k]} onChange={e=>setForm(prev=>({...prev,[k]:e.target.value}))} placeholder={p} className="input-field" />
              </div>
            </div>
          ))}
        </div>

        {/* Reason */}
        <div className="bg-white rounded-3xl p-5 mb-5" style={{ boxShadow:'0 4px 20px rgba(0,0,0,0.07)' }}>
          <h3 className="font-sora font-bold text-gray-900 text-[16px] mb-4 flex items-center gap-2">
            <FileText size={16} style={{color:'#0984e3'}}/> Reason for Visit
          </h3>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {REASONS.map(r=>(
              <button key={r} onClick={()=>setForm(p=>({...p,reason:p.reason===r?'':r}))}
                className="py-2.5 px-3 rounded-xl text-[12px] font-bold border-2 transition-all text-left"
                style={{ borderColor: form.reason===r?'#0984e3':'#e2e8f0', background: form.reason===r?'#e8f4fd':'#f8fafc', color: form.reason===r?'#0984e3':'#64748b' }}>
                {r}
              </button>
            ))}
          </div>
          <input type="text" value={form.reason} onChange={e=>setForm(p=>({...p,reason:e.target.value}))}
            placeholder="Or describe your reason..."
            className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 outline-none focus:border-brand-mid placeholder:text-gray-400 transition-colors" />
        </div>

        {/* Doctor info card */}
        {clinic.doctor && (
          <div className="bg-white rounded-3xl p-4 mb-5 flex items-center gap-4" style={{ boxShadow:'0 4px 20px rgba(0,0,0,0.07)' }}>
            <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
              <Image src={clinic.doctor.img} alt={clinic.doctor.name} width={64} height={64} className="object-cover w-full h-full" />
            </div>
            <div className="flex-1">
              <p className="font-sora font-bold text-gray-900 text-[15px]">{clinic.doctor.name}</p>
              <p className="text-[12px] text-gray-400">{clinicSpec} · {clinic.doctor.exp} experience</p>
              <div className="flex items-center gap-1 mt-1.5">
                {[1,2,3,4,5].map(i=><Star key={i} size={10} fill="#f59e0b" color="#f59e0b"/>)}
                <span className="text-[11px] text-gray-500 ml-1">{clinic.rating}</span>
              </div>
            </div>
          </div>
        )}

        <button onClick={join} disabled={loading} className="btn-primary mb-8 disabled:opacity-60">
          {loading ? <Loader2 size={20} className="animate-spin"/> : '🎟️  Generate My Token'}
        </button>
      </div>
    </div>
  );
}

export default function QueuePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/></div>}>
      <QueueForm />
    </Suspense>
  );
}
