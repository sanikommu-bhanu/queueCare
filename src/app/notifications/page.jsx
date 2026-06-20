'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Bell, Ticket, CheckCircle, Clock, Users } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useAppStore } from '@/store/useAppStore';

const ICON_MAP = {
  token:    [Ticket,     '#e8f4fd', '#0984e3'],
  called:   [Bell,      '#fef3c7', '#f59e0b'],
  done:     [CheckCircle,'#e8f8f5','#00b894'],
  reminder: [Clock,     '#e8f4fd', '#0984e3'],
};

const DEMO = [
  { id:1, title:'Token #004 Called 🔔', body:'Please proceed to the consultation room at Apollo Clinic, Bangalore', type:'called', time: new Date(Date.now()-3600000).toISOString() },
  { id:2, title:'Visit Complete ✅', body:'You were successfully served at City Heart Center. How was your experience?', type:'done', time: new Date(Date.now()-86400000).toISOString() },
  { id:3, title:'2 People Ahead ⏰', body:'Your queue at Smile Dental Studio is moving fast — head over now!', type:'reminder', time: new Date(Date.now()-1800000).toISOString() },
  { id:4, title:'Token #007 Generated 🎟️', body:'Your token at NeuroLife Clinic is ready. You are 5th in queue.', type:'token', time: new Date(Date.now()-7200000).toISOString() },
];

function timeAgo(iso) {
  const m = Math.floor((Date.now()-new Date(iso).getTime())/60000);
  if (m<1) return 'just now';
  if (m<60) return `${m}m ago`;
  const h=Math.floor(m/60);
  return h<24 ? `${h}h ago` : `${Math.floor(h/24)}d ago`;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, markAllRead } = useAppStore();
  useEffect(()=>{ markAllRead(); },[markAllRead]);
  const display = notifications.length > 0 ? notifications : DEMO;

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Header with background */}
      <div className="relative overflow-hidden" style={{ paddingTop:52, paddingBottom:24, paddingLeft:20, paddingRight:20 }}>
        <Image src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=85"
          alt="notifications" fill className="object-cover opacity-60" sizes="430px" />
        <div className="absolute inset-0" style={{background:'linear-gradient(135deg,rgba(12,36,97,0.92),rgba(9,132,227,0.87))'}} />
        <div className="relative z-10 flex items-center gap-3">
          <button onClick={()=>router.back()} className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
            <ArrowLeft size={18} color="white" />
          </button>
          <div>
            <h1 className="font-sora text-[20px] font-extrabold text-white">Notifications</h1>
            <p className="text-white/60 text-[12px]">{display.length} alert{display.length!==1?'s':''}</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5">
        {display.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center" style={{boxShadow:'0 4px 20px rgba(0,0,0,0.07)'}}>
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{background:'#e8f4fd'}}>
              <Bell size={28} style={{color:'#0984e3'}} />
            </div>
            <p className="font-sora font-bold text-gray-500 mb-1">No notifications yet</p>
            <p className="text-gray-400 text-[13px]">We'll notify you when your token is called</p>
          </div>
        ) : display.map(n=>{
          const [Icon,bg,color] = ICON_MAP[n.type] || ICON_MAP.token;
          return (
            <div key={n.id} className="bg-white rounded-2xl p-4 flex items-start gap-3 mb-3 fade-up"
              style={{ boxShadow:'0 4px 16px rgba(0,0,0,0.07)', borderLeft: !n.read ? '4px solid #0984e3' : 'none' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{background:bg}}>
                <Icon size={20} style={{color}} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-[14px] mb-1">{n.title}</p>
                <p className="text-gray-500 text-[12px] leading-relaxed mb-1.5">{n.body}</p>
                <p className="text-gray-300 text-[11px] font-medium">{timeAgo(n.time)}</p>
              </div>
              {!n.read && <div className="w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0" style={{background:'#0984e3'}} />}
            </div>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );
}
