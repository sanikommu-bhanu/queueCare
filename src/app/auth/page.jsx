'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, User, Mail, Lock, Phone, ArrowLeft, Shield, CheckCircle, Stethoscope } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import toast from 'react-hot-toast';

const Field = ({ name, label, type='text', Icon, placeholder, right, value, error, onChange }) => (
  <div className="mb-4">
    <label className="block text-[13px] font-bold text-gray-500 mb-2">{label}</label>
    <div className="relative">
      <Icon size={16} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-gray-400" />
      <input type={type} value={value} placeholder={placeholder} onChange={onChange}
        className={`input-field ${error?'border-red-400 bg-red-50':''}`} />
      {right && <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>}
    </div>
    {error && <p className="text-red-500 text-[12px] mt-1.5 font-semibold">{error}</p>}
  </div>
);

export default function AuthPage() {
  const router = useRouter();
  const { setUser } = useAppStore();
  const [tab, setTab] = useState('login');
  const [role, setRole] = useState('patient');
  const [otpStep, setOtpStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'' });
  const [errors, setErrors] = useState({});

  const update = (k,v) => { setForm(p=>({...p,[k]:v})); if(errors[k]) setErrors(p=>({...p,[k]:''})); };

  const validate = () => {
    const e = {};
    if (tab==='signup' && !form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Minimum 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch(tab==='login' ? '/api/auth/login' : '/api/auth/register', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({...form, role}),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error||'Something went wrong'); setLoading(false); return; }
      setUser(data.user, data.token);
      toast.success(`Welcome${tab==='signup' ? ' to QueueCare' : ' back'}! 🎉`);
      router.replace('/home');
    } catch {
      const demoUser = { id:'demo-'+Date.now(), name: form.name||form.email.split('@')[0], email:form.email, phone:form.phone, role, isLoggedIn:true };
      setUser(demoUser, 'demo-token');
      toast.success('Welcome to QueueCare! 🎉');
      router.replace('/home');
    }
    setLoading(false);
  };

  const submitOtp = async () => {
    if (otpStep === 1) {
      if (!form.phone) return toast.error('Phone number required');
      setLoading(true);
      try {
        const res = await fetch('/api/auth/send-otp', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: form.phone })
        });
        if (res.ok) {
          toast.success('OTP sent via SMS!');
          setOtpStep(2);
        } else toast.error('Failed to send OTP');
      } catch (err) { toast.error('Network error'); }
      setLoading(false);
    } else {
      if (!otp) return toast.error('OTP required');
      setLoading(true);
      try {
        const res = await fetch('/api/auth/verify-otp', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: form.phone, otp, role })
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user, data.token);
          toast.success('Login successful!');
          router.replace('/home');
        } else toast.error(data.error || 'Invalid OTP');
      } catch (err) { toast.error('Network error'); }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero header with real doctor image */}
      <div className="relative overflow-hidden" style={{ paddingTop:52, paddingBottom:28, paddingLeft:20, paddingRight:20 }}>
        <Image
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=900&q=88"
          alt="doctors" fill className="object-cover" sizes="430px" priority />
        <div className="absolute inset-0" style={{ background:'linear-gradient(135deg,rgba(12,36,97,0.94),rgba(9,132,227,0.88))' }} />
        <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute bottom-[-40px] left-[-20px] w-36 h-36 rounded-full bg-white/5" />

        <div className="relative z-10">
          <button onClick={() => router.back()} className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center mb-5">
            <ArrowLeft size={18} color="white" />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
              <Stethoscope size={20} color="white" />
            </div>
            <span className="font-sora text-[22px] font-extrabold text-white">QueueCare</span>
          </div>
          <h1 className="font-sora text-[26px] font-bold text-white mb-1">
            {tab==='login' ? 'Welcome back 👋' : tab==='signup' ? 'Create account ✨' : 'Phone Login 📱'}
          </h1>
          <p className="text-white/60 text-[13px]">
            {tab==='login' ? 'Sign in to track your queue in real-time' : tab==='signup' ? 'Join 50,000+ patients saving time daily' : 'Login securely without a password'}
          </p>

          {/* Social proof avatars */}
          <div className="flex items-center gap-2 mt-4">
            <div className="flex -space-x-2">
              {['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&q=80',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&q=80',
                'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&q=80',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&q=80'].map((u,i)=>(
                <img key={i} src={u} alt="" className="w-7 h-7 rounded-full border-2 border-white/40 object-cover" />
              ))}
            </div>
            <p className="text-white/65 text-[12px]">50,000+ patients trust QueueCare</p>
          </div>
        </div>
      </div>

      {/* Tab */}
      <div className="flex mx-5 mt-5 bg-gray-100 rounded-[14px] p-1">
        {['login','signup','otp'].map(t=>(
          <button key={t} onClick={()=>{setTab(t); if(t==='otp') setOtpStep(1);}}
            className={`flex-1 py-[11px] text-[14px] font-bold rounded-[11px] transition-all ${tab===t?'bg-white text-blue-900 shadow-card':'text-gray-400'}`}>
            {t==='login'?'Sign In':t==='signup'?'Sign Up':'Phone OTP'}
          </button>
        ))}
      </div>

      <div className="px-5 pt-5 flex-1 flex flex-col">
        {tab==='signup' && (
          <div className="mb-5">
            <label className="block text-[13px] font-bold text-gray-500 mb-2">I am a</label>
            <div className="flex gap-3">
              {[
                { v:'patient', l:'Patient', e:'🏥', img:'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&q=80' },
                { v:'receptionist', l:'Receptionist', e:'💼', img:'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&q=80' },
              ].map(r=>(
                <button key={r.v} onClick={()=>setRole(r.v)}
                  className="flex-1 py-3 rounded-2xl text-[13px] font-bold transition-all border-2 flex items-center justify-center gap-2 relative overflow-hidden"
                  style={{ borderColor: role===r.v ? '#0984e3':'#e2e8f0', background: role===r.v ? '#e8f4fd':'white', color: role===r.v ? '#0984e3':'#94a3b8' }}>
                  <span>{r.e}</span> {r.l}
                </button>
              ))}
            </div>
          </div>
        )}

        {tab==='signup' && <Field name="name" label="Full Name" Icon={User} placeholder="Your full name" value={form.name} error={errors.name} onChange={e=>update('name',e.target.value)} />}
        {(tab==='login' || tab==='signup') && <Field name="email" label="Email Address" type="email" Icon={Mail} placeholder="you@email.com" value={form.email} error={errors.email} onChange={e=>update('email',e.target.value)} />}
        {(tab==='signup' || tab==='otp') && <Field name="phone" label="Mobile Number" type="tel" Icon={Phone} placeholder="10-digit number" value={form.phone} error={errors.phone} onChange={e=>update('phone',e.target.value)} />}
        {(tab==='login' || tab==='signup') && <Field name="password" label="Password" type={showPass?'text':'password'} Icon={Lock} placeholder="Enter password" value={form.password} error={errors.password} onChange={e=>update('password',e.target.value)}
          right={<button type="button" onClick={()=>setShowPass(p=>!p)} className="flex">
            {showPass?<EyeOff size={16} className="text-gray-400"/>:<Eye size={16} className="text-gray-400"/>}
          </button>} />}
          
        {tab==='otp' && otpStep===2 && (
          <div className="mb-4">
            <label className="block text-[13px] font-bold text-gray-500 mb-2">Enter 6-digit OTP</label>
            <input type="text" value={otp} onChange={e=>setOtp(e.target.value)} placeholder="000000" className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-center tracking-widest text-lg font-bold outline-none focus:border-brand-mid transition-colors" maxLength={6} />
          </div>
        )}

        {tab==='login' && (
          <div className="text-right text-[13px] font-bold -mt-1 mb-5" style={{color:'#0984e3'}}>Forgot password?</div>
        )}

        <button onClick={tab==='otp' ? submitOtp : submit} disabled={loading} className="btn-primary mb-4 disabled:opacity-60">
          {loading
            ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
            : tab==='login' ? '→  Sign In' : tab==='signup' ? '→  Create Account' : otpStep===1 ? 'Send OTP' : 'Verify & Login'}
        </button>

        <div className="flex items-center justify-center gap-5 mb-5">
          {[[Shield,'Secure & Private'],[CheckCircle,'50K+ Users'],[CheckCircle,'100% Free']].map(([I,l],i)=>(
            <span key={i} className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <I size={11} style={{color:'#0984e3'}}/> {l}
            </span>
          ))}
        </div>

        <p className="text-center text-[13px] text-gray-400 pb-8">
          {tab==='login'?"Don't have an account? ":"Already registered? "}
          <button onClick={()=>setTab(tab==='login'?'signup':'login')} className="font-bold" style={{color:'#0984e3'}}>
            {tab==='login'?'Sign up free':'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
