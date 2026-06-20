'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Phone, Mail, Bell, Shield, LogOut, ChevronRight, Moon, HelpCircle, Star, Briefcase, Activity } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useAppStore } from '@/store/useAppStore';
import { initials } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, tokenHistory } = useAppStore();

  const handleLogout = () => { logout(); toast('Signed out 👋'); router.replace('/welcome'); };

  const SECTIONS = [
    { title:'Account', items:[
      { Icon:User,       label:'Edit Profile',          bg:'#e8f4fd', ic:'#0984e3', action:()=>toast('Coming soon') },
      { Icon:Phone,      label:user?.phone||'Add Phone', bg:'#e0f2f1', ic:'#00897b', action:()=>toast('Coming soon') },
      { Icon:Mail,       label:user?.email||'Add Email', bg:'#f3e8ff', ic:'#7c3aed', action:()=>{} },
    ]},
    { title:'For Clinics', items:[
      { Icon:Briefcase,  label:'Receptionist Dashboard', bg:'#fef3c7', ic:'#f59e0b', action:()=>router.push('/receptionist'), badge:'PRO' },
      { Icon:Activity,   label:'Clinic Analytics',        bg:'#e8f8f5', ic:'#00b894', action:()=>toast('Coming soon') },
    ]},
    { title:'Preferences', items:[
      { Icon:Bell,       label:'Notification Settings',  bg:'#fee2e2', ic:'#e17055', action:()=>toast('Coming soon') },
      { Icon:Moon,       label:'Dark Mode',               bg:'#f1f5f9', ic:'#64748b', action:()=>toast('Coming soon') },
    ]},
    { title:'Support', items:[
      { Icon:HelpCircle, label:'Help & FAQ',              bg:'#e8f4fd', ic:'#0984e3', action:()=>toast('Coming soon') },
      { Icon:Star,       label:'Rate QueueCare ⭐',       bg:'#fef3c7', ic:'#f59e0b', action:()=>toast('Thank you! ⭐') },
      { Icon:Shield,     label:'Privacy Policy',          bg:'#f1f5f9', ic:'#64748b', action:()=>{} },
    ]},
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Profile hero with doctor team background */}
      <div className="relative overflow-hidden" style={{ paddingTop:52, paddingBottom:28, paddingLeft:20, paddingRight:20 }}>
        <Image src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=85"
          alt="profile" fill className="object-cover" sizes="430px" />
        <div className="absolute inset-0" style={{background:'linear-gradient(135deg,rgba(12,36,97,0.95),rgba(9,132,227,0.88))'}} />
        <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-white/5" />

        <div className="relative z-10">
          <h1 className="font-sora text-[22px] font-extrabold text-white mb-5">Profile</h1>
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-[76px] h-[76px] rounded-[22px] border-2 border-white/30 flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{background:'rgba(255,255,255,0.18)', backdropFilter:'blur(10px)'}}>
              <span className="font-sora font-extrabold text-white text-[28px]">{initials(user?.name)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-sora text-[20px] font-bold text-white truncate mb-1">{user?.name||'Guest User'}</h2>
              <p className="text-white/60 text-[13px] mb-2 truncate">{user?.email||'Not signed in'}</p>
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold text-white"
                style={{background: user?.role==='receptionist' ? '#f59e0b' : 'rgba(255,255,255,0.18)'}}>
                {user?.role==='receptionist' ? '💼 Receptionist' : '🏥 Patient'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mx-5 mt-5">
        {[
          [tokenHistory?.length||0,       'Total Visits',    '#0984e3','#e8f4fd'],
          [tokenHistory?.filter(t=>t.status==='done').length||0,'Completed','#00b894','#e8f8f5'],
          [tokenHistory?.filter(t=>t.status==='waiting'||t.status==='called').length||0,'Active','#f59e0b','#fef3c7'],
        ].map(([v,l,c,bg],i)=>(
          <div key={i} className="bg-white rounded-2xl p-3.5 text-center" style={{boxShadow:'0 4px 16px rgba(0,0,0,0.07)'}}>
            <p className="font-sora text-[26px] font-extrabold" style={{color:c,lineHeight:1}}>{v}</p>
            <p className="text-[10px] text-gray-400 mt-2">{l}</p>
          </div>
        ))}
      </div>

      {/* Doctor spotlight */}
      <div className="mx-5 mt-5 rounded-3xl overflow-hidden relative" style={{height:100, boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}>
        <Image src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80"
          alt="doctor" fill className="object-cover" sizes="390px" />
        <div className="absolute inset-0 flex items-center px-5"
          style={{background:'linear-gradient(90deg,rgba(12,36,97,0.85) 0%,rgba(9,132,227,0.6) 100%)'}}>
          <div className="flex-1">
            <p className="font-sora font-bold text-white text-[15px] mb-1">Need help finding a doctor?</p>
            <p className="text-white/65 text-[12px]">Browse 50+ verified specialists</p>
          </div>
          <button onClick={()=>router.push('/explore')}
            className="font-sora font-bold text-[12px] px-4 py-2.5 rounded-xl text-white flex-shrink-0"
            style={{background:'rgba(255,255,255,0.22)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.3)'}}>
            Browse →
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="px-5 mt-5">
        {SECTIONS.map(section=>(
          <div key={section.title} className="mb-5">
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">{section.title}</p>
            <div className="bg-white rounded-2xl overflow-hidden" style={{boxShadow:'0 4px 16px rgba(0,0,0,0.07)'}}>
              {section.items.map((item,idx)=>(
                <button key={idx} onClick={item.action}
                  className={`w-full flex items-center gap-3.5 px-4 py-4 active:bg-gray-50 transition-colors text-left ${idx<section.items.length-1?'border-b border-gray-50':''}`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:item.bg}}>
                    <item.Icon size={18} style={{color:item.ic}} />
                  </div>
                  <span className="flex-1 text-[14px] font-semibold text-gray-800">{item.label}</span>
                  {item.badge && <span className="text-white text-[10px] font-bold px-2 py-0.5 rounded-full mr-1" style={{background:'#f59e0b'}}>{item.badge}</span>}
                  <ChevronRight size={16} className="text-gray-300" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <button onClick={handleLogout}
          className="w-full py-4 mb-3 bg-white rounded-2xl flex items-center justify-center gap-2 text-red-500 text-[15px] font-bold"
          style={{boxShadow:'0 4px 16px rgba(0,0,0,0.07)'}}>
          <LogOut size={18}/> Sign Out
        </button>
        <p className="text-center text-[11px] text-gray-300 pb-4">QueueCare v1.0.0 · Built with ❤️ for better healthcare</p>
      </div>
      <BottomNav />
    </div>
  );
}
