'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ChevronRight, Users, Volume2, CheckCircle, Plus, RefreshCw, Activity, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import BottomNav from '@/components/BottomNav';
import { pad, STATUS } from '@/lib/utils';
import { DEMO_QUEUE_PATIENTS } from '@/lib/images';
import toast from 'react-hot-toast';

export default function ReceptionistPage() {
  const router = useRouter();
  const [tokens, setTokens] = useState(DEMO_QUEUE_PATIENTS);
  const [currentToken, setCurrentToken] = useState(3);
  const [clinicId] = useState('c1');
  const [calling, setCalling] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name:'', phone:'', reason:'' });
  const [loading, setLoading] = useState(false);

  const stats = {
    waiting: tokens.filter(t=>t.status==='waiting').length,
    called:  tokens.filter(t=>t.status==='called').length,
    served:  tokens.filter(t=>t.status==='done').length,
  };

  const loadQueue = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/queue/next?clinic_id=${clinicId}`);
      if (res.ok) {
        const d = await res.json();
        if (d.tokens?.length) { setTokens(d.tokens); setCurrentToken(d.current_token||0); }
      }
    } catch {}
    setLoading(false);
  }, [clinicId]);

  useEffect(() => { loadQueue(); }, []);

  const callNext = async () => {
    setCalling(true);
    try {
      const res = await fetch('/api/queue/next', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ clinic_id: clinicId }),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.queue_empty) { toast('Queue is empty! 🎉'); }
        else {
          toast.success(`Calling Token #${pad(d.current_number)}`);
          loadQueue();
          try { window.speechSynthesis?.speak(new SpeechSynthesisUtterance(`Token number ${d.current_number}, please proceed to the consultation room.`)); } catch {}
        }
      } else throw new Error();
    } catch {
      const waiting = tokens.filter(t=>t.status==='waiting');
      if (!waiting.length) { toast('Queue is empty! 🎉'); }
      else {
        const next = waiting[0];
        setTokens(q => q.map(t => t.id===next.id?{...t,status:'called'}:t.status==='called'?{...t,status:'serving'}:t.status==='serving'?{...t,status:'done'}:t));
        setCurrentToken(next.token_number);
        toast.success(`Calling Token #${pad(next.token_number)} — ${next.patient_name}`);
        try { window.speechSynthesis?.speak(new SpeechSynthesisUtterance(`Token number ${next.token_number}, ${next.patient_name}, please proceed to the consultation room.`)); } catch {}
      }
    }
    setCalling(false);
  };

  const addPatient = () => {
    if (!addForm.name.trim()) { toast.error('Patient name required'); return; }
    const maxNum = tokens.reduce((m,t)=>Math.max(m,t.token_number),0);
    const newTk = { id:'t-'+Date.now(), token_number:maxNum+1, patient_name:addForm.name, patient_phone:addForm.phone, reason:addForm.reason, status:'waiting', avatar: null };
    setTokens(prev => [...prev, newTk]);
    setAddForm({ name:'', phone:'', reason:'' });
    setShowAdd(false);
    toast.success(`Token #${pad(newTk.token_number)} issued for ${addForm.name}`);
  };

  const calledTk = tokens.find(t=>t.status==='called');

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Header */}
      <div className="relative overflow-hidden" style={{ paddingTop:52, paddingBottom:24, paddingLeft:20, paddingRight:20 }}>
        <Image src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=900&q=85"
          alt="clinic" fill className="object-cover" sizes="430px" />
        <div className="absolute inset-0" style={{ background:'linear-gradient(135deg,rgba(12,36,97,0.93),rgba(9,132,227,0.88))' }} />
        <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <button onClick={() => router.back()} className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center"><ArrowLeft size={18} color="white" /></button>
            <div className="text-center">
              <p className="text-white/60 text-[12px]">Receptionist Dashboard</p>
              <p className="font-sora font-bold text-white text-[15px]">Apollo Clinic</p>
            </div>
            <button onClick={() => { loadQueue(); toast('Refreshed'); }} disabled={loading}
              className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
              <RefreshCw size={16} color="white" className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Now serving */}
          <div className="rounded-2xl p-4 relative overflow-hidden"
            style={{ background:'rgba(255,255,255,0.12)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.2)' }}>
            <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mb-3">Now Serving</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sora text-[60px] font-extrabold text-white leading-none">{pad(currentToken)}</p>
                {calledTk && (
                  <div className="flex items-center gap-2 mt-1">
                    {calledTk.avatar && (
                      <img src={calledTk.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                    )}
                    <p className="text-white/75 text-[13px] font-semibold">{calledTk.patient_name}</p>
                  </div>
                )}
              </div>
              <button onClick={callNext} disabled={calling || stats.waiting === 0}
                className="font-sora font-bold text-[14px] px-5 py-4 rounded-2xl flex items-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
                style={{ background:'#f59e0b', boxShadow:'0 8px 24px rgba(245,158,11,0.45)', color:'white' }}>
                {calling
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><ChevronRight size={18} /> Call Next</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mx-5 mt-4">
        {[
          [Users,       stats.waiting, 'Waiting', '#0984e3','#e8f4fd'],
          [Volume2,     stats.called,  'Called',  '#f59e0b','#fef3c7'],
          [CheckCircle, stats.served,  'Served',  '#00b894','#e8f8f5'],
        ].map(([Icon,v,l,c,bg],i)=>(
          <div key={i} className="bg-white rounded-2xl p-3.5 text-center" style={{ boxShadow:'0 4px 16px rgba(0,0,0,0.07)' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2" style={{background:bg}}>
              <Icon size={15} style={{color:c}} />
            </div>
            <p className="font-sora text-[22px] font-extrabold" style={{color:c,lineHeight:1}}>{v}</p>
            <p className="text-[10px] text-gray-400 mt-1">{l}</p>
          </div>
        ))}
      </div>

      {/* Add patient button */}
      <div className="px-5 mt-4">
        <button onClick={() => setShowAdd(true)} className="w-full py-3.5 bg-white rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2"
          style={{ border:'2px dashed #0984e3', color:'#0984e3', boxShadow:'0 2px 8px rgba(9,132,227,0.1)' }}>
          <Plus size={18} /> Add Patient to Queue
        </button>
      </div>

      {/* QR Code Panel */}
      <div className="px-5 mt-4">
        <div className="bg-white rounded-2xl p-5 text-center flex flex-col items-center justify-center" style={{ boxShadow:'0 4px 16px rgba(0,0,0,0.07)' }}>
          <p className="font-sora text-[14px] font-bold text-gray-900 mb-4">Scan to join queue instantly</p>
          <div className="p-3 bg-gray-50 rounded-xl mb-3 inline-block">
            <QRCodeSVG 
              id="clinic-qr-code"
              value={`${typeof window !== 'undefined' ? window.location.origin : ''}/queue?clinic_id=${clinicId}&name=Apollo Clinic`} 
              size={200} 
              level="M" 
              includeMargin={true}
            />
          </div>
          <p className="font-sora font-extrabold text-[#0984e3] text-[16px] tracking-wide mb-4">Apollo Clinic</p>
          
          <button 
            onClick={() => {
              const svg = document.getElementById('clinic-qr-code');
              const svgData = new XMLSerializer().serializeToString(svg);
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              const img = new window.Image();
              img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                const pngFile = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.download = 'clinic-qr-code.png';
                downloadLink.href = pngFile;
                downloadLink.click();
              };
              img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
            }}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Download size={18} /> Download / Share QR
          </button>
        </div>
      </div>

      {/* Queue list */}
      <div className="px-5 mt-5">
        {[
          ['called',  '🔔 Currently Called', '#f59e0b'],
          ['waiting', 'Waiting',             '#64748b'],
          ['done',    'Completed',           '#94a3b8'],
        ].map(([status,label,color]) => {
          const list = tokens.filter(t=>t.status===status);
          if (!list.length) return null;
          return (
            <div key={status} className="mb-5">
              <p className="text-[12px] font-bold uppercase tracking-wider mb-3 px-1" style={{color}}>{label} ({list.length})</p>
              {list.slice(0, status==='done' ? 5 : 99).map(t => {
                const sc = STATUS[t.status] || STATUS.waiting;
                return (
                  <div key={t.id} className="bg-white rounded-2xl p-4 flex items-center gap-3 mb-2"
                    style={{ boxShadow:'0 4px 16px rgba(0,0,0,0.07)', border: status==='called' ? '2px solid #f59e0b' : 'none' }}>
                    {/* Avatar or token badge */}
                    <div className="relative flex-shrink-0">
                      {t.avatar ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden">
                          <img src={t.avatar} alt={t.patient_name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ background: status==='called' ? '#f59e0b' : '#e8f4fd' }}>
                          <span className="font-sora font-extrabold text-[14px]"
                            style={{ color: status==='called' ? 'white' : '#0984e3' }}>{pad(t.token_number)}</span>
                        </div>
                      )}
                      {/* Token number badge on avatar */}
                      {t.avatar && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ background:'#0984e3', fontSize:9, fontWeight:800, color:'white', fontFamily:'Sora,sans-serif' }}>
                          {t.token_number}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-[14px] truncate">{t.patient_name}</p>
                      {t.reason && <p className="text-[12px] text-gray-400 truncate">{t.reason}</p>}
                    </div>
                    <div className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                      style={{ background:sc.bg, color:sc.text }}>{sc.label}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
        {tokens.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center" style={{ boxShadow:'0 4px 16px rgba(0,0,0,0.07)' }}>
            <Activity size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="font-bold text-gray-500 mb-1">Queue is empty</p>
            <p className="text-gray-400 text-[13px]">Add patients or wait for them to join online</p>
          </div>
        )}
      </div>

      {/* Add patient modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end max-w-[430px] mx-auto"
          onClick={e => e.target===e.currentTarget && setShowAdd(false)}>
          <div className="w-full bg-white rounded-t-[32px] p-6 sheet-up">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h3 className="font-sora text-[18px] font-bold text-gray-900 mb-5">➕ Add Patient</h3>
            {[{k:'name',l:'Patient Name *',t:'text',p:'Full name'},{k:'phone',l:'Phone Number',t:'tel',p:'Mobile number'},{k:'reason',l:'Reason for Visit',t:'text',p:'e.g. General checkup'}].map(f=>(
              <div key={f.k} className="mb-4">
                <label className="block text-[13px] font-bold text-gray-500 mb-2">{f.l}</label>
                <input type={f.t} value={addForm[f.k]} onChange={e=>setAddForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.p}
                  className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 outline-none focus:border-brand-mid placeholder:text-gray-400 transition-colors" />
              </div>
            ))}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={addPatient} className="btn-primary flex-1">Issue Token 🎟️</button>
            </div>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
