'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Phone, Mail, Bell, Shield, LogOut, ChevronRight, Moon, HelpCircle, Star, Briefcase, Activity, X, Volume2, Smartphone, ChevronDown, Check } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useAppStore } from '@/store/useAppStore';
import { initials } from '@/lib/utils';
import toast from 'react-hot-toast';

// ── Bottom Sheet wrapper ──
function Sheet({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end max-w-[430px] mx-auto"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full bg-white rounded-t-[32px] p-6 sheet-up max-h-[85vh] overflow-y-auto">
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
        {children}
      </div>
    </div>
  );
}

// ── FAQ Data ──
const FAQ_ITEMS = [
  { q: 'How do I join a clinic queue?', a: 'Go to "Find Clinic" from the home screen, select a clinic, fill in your details, and tap "Generate My Token". You\'ll get a digital token number instantly.' },
  { q: 'How do I know when my token is called?', a: 'You\'ll receive a push notification, a voice announcement, and the app will show "Called" status on your token card in real-time.' },
  { q: 'Can I leave the queue and rejoin later?', a: 'Yes! Tap "Leave Queue" on your token screen. However, you\'ll get a new token number when you rejoin and your previous position is lost.' },
  { q: 'How does the receptionist dashboard work?', a: 'Receptionists can sign up with the "Receptionist" role. They get a dedicated dashboard to add patients, call next tokens, view analytics, and manage the queue.' },
  { q: 'Is my data secure?', a: 'Yes. We use JWT-based authentication, bcrypt password hashing, and all data is stored securely on PostgreSQL with SSL encryption. We never share your personal information.' },
  { q: 'What happens if I close the app?', a: 'Your token is saved locally on your device. When you reopen the app, your active token and queue position are automatically restored.' },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, tokenHistory, darkMode, toggleDarkMode, notificationPrefs, updateNotificationPrefs, updateUser, userRating, setUserRating } = useAppStore();

  // Modal states
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showNotifPrefs, setShowNotifPrefs] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showRating, setShowRating] = useState(false);

  // Edit profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(null);

  const handleLogout = () => { logout(); toast('Signed out 👋'); router.replace('/welcome'); };

  const saveProfile = () => {
    if (!profileForm.name.trim()) { toast.error('Name is required'); return; }
    updateUser(profileForm);
    toast.success('Profile updated! ✅');
    setShowEditProfile(false);
  };

  const handleRating = (stars) => {
    setUserRating(stars);
    toast.success(`Thanks for rating us ${stars} star${stars > 1 ? 's' : ''}! ⭐`);
    setTimeout(() => setShowRating(false), 600);
  };

  const isReceptionist = user?.role === 'receptionist';

  const SECTIONS = [
    { title:'Account', items:[
      { Icon:User,  label:'Edit Profile',          bg:'#e8f4fd', ic:'#0984e3', action:() => { setProfileForm({ name: user?.name||'', email: user?.email||'', phone: user?.phone||'' }); setShowEditProfile(true); } },
      { Icon:Phone, label:user?.phone||'Add Phone', bg:'#e0f2f1', ic:'#00897b', action:() => { setProfileForm({ name: user?.name||'', email: user?.email||'', phone: user?.phone||'' }); setShowEditProfile(true); } },
      { Icon:Mail,  label:user?.email||'Add Email', bg:'#f3e8ff', ic:'#7c3aed', action:() => { setProfileForm({ name: user?.name||'', email: user?.email||'', phone: user?.phone||'' }); setShowEditProfile(true); } },
    ]},
    { title:'For Clinics', items:[
      { Icon:Briefcase, label: isReceptionist ? 'My Dashboard' : 'Receptionist Dashboard', bg:'#fef3c7', ic:'#f59e0b', action:()=>router.push('/receptionist'), badge: isReceptionist ? 'ACTIVE' : 'PRO' },
      { Icon:Activity,  label:'Clinic Analytics', bg:'#e8f8f5', ic:'#00b894', action:()=>router.push('/receptionist') },
    ]},
    { title:'Preferences', items:[
      { Icon:Bell, label:'Notification Settings', bg:'#fee2e2', ic:'#e17055', action:()=>setShowNotifPrefs(true) },
      { Icon:Moon, label:'Dark Mode',             bg:'#f1f5f9', ic:'#64748b', action:()=>{ toggleDarkMode(); toast(darkMode ? 'Light mode enabled ☀️' : 'Dark mode enabled 🌙'); }, toggle: true, toggled: darkMode },
    ]},
    { title:'Support', items:[
      { Icon:HelpCircle, label:'Help & FAQ',       bg:'#e8f4fd', ic:'#0984e3', action:()=>setShowFaq(true) },
      { Icon:Star,       label:'Rate QueueCare ⭐', bg:'#fef3c7', ic:'#f59e0b', action:()=>setShowRating(true) },
      { Icon:Shield,     label:'Privacy Policy',   bg:'#f1f5f9', ic:'#64748b', action:()=>setShowPrivacy(true) },
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
                style={{background: isReceptionist ? '#f59e0b' : 'rgba(255,255,255,0.18)'}}>
                {isReceptionist ? '💼 Receptionist' : '🏥 Patient'}
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
                  {item.toggle ? (
                    <div className={`w-11 h-6 rounded-full relative transition-colors ${item.toggled ? 'bg-blue-500' : 'bg-gray-300'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${item.toggled ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
                    </div>
                  ) : (
                    <ChevronRight size={16} className="text-gray-300" />
                  )}
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

      {/* ═══════════════════════════════════════════ */}
      {/* ── MODAL: Edit Profile ── */}
      <Sheet open={showEditProfile} onClose={() => setShowEditProfile(false)}>
        <h3 className="font-sora text-[18px] font-bold text-gray-900 mb-5">✏️ Edit Profile</h3>
        {[
          { k:'name', l:'Full Name *', t:'text', p:'Your full name', I:User },
          { k:'email', l:'Email Address', t:'email', p:'you@email.com', I:Mail },
          { k:'phone', l:'Phone Number', t:'tel', p:'10-digit number', I:Phone },
        ].map(f => (
          <div key={f.k} className="mb-4">
            <label className="block text-[13px] font-bold text-gray-500 mb-2">{f.l}</label>
            <div className="relative">
              <f.I size={16} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={f.t} value={profileForm[f.k]} onChange={e => setProfileForm(p => ({...p, [f.k]: e.target.value}))} placeholder={f.p}
                className="w-full py-3 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-[14px] text-gray-900 outline-none focus:border-blue-400 placeholder:text-gray-400 transition-colors" />
            </div>
          </div>
        ))}
        <div className="flex gap-3 mt-6">
          <button onClick={() => setShowEditProfile(false)} className="btn-secondary flex-1">Cancel</button>
          <button onClick={saveProfile} className="btn-primary flex-1">Save Changes</button>
        </div>
      </Sheet>

      {/* ── MODAL: Notification Settings ── */}
      <Sheet open={showNotifPrefs} onClose={() => setShowNotifPrefs(false)}>
        <h3 className="font-sora text-[18px] font-bold text-gray-900 mb-5">🔔 Notification Settings</h3>
        {[
          { key:'push', label:'Push Notifications', desc:'Get notified when your token is called', Icon: Bell, color:'#0984e3' },
          { key:'voice', label:'Voice Announcements', desc:'Hear your token number spoken aloud', Icon: Volume2, color:'#00b894' },
          { key:'sms', label:'SMS Alerts', desc:'Receive text messages for queue updates', Icon: Smartphone, color:'#f59e0b' },
        ].map(item => (
          <div key={item.key} className="flex items-center gap-3.5 py-4 border-b border-gray-100 last:border-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: item.color + '18' }}>
              <item.Icon size={18} style={{ color: item.color }} />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-gray-800">{item.label}</p>
              <p className="text-[12px] text-gray-400">{item.desc}</p>
            </div>
            <button onClick={() => updateNotificationPrefs({ [item.key]: !notificationPrefs[item.key] })}
              className={`w-11 h-6 rounded-full relative transition-colors ${notificationPrefs[item.key] ? 'bg-blue-500' : 'bg-gray-300'}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notificationPrefs[item.key] ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
            </button>
          </div>
        ))}
        <button onClick={() => { setShowNotifPrefs(false); toast.success('Preferences saved!'); }} className="btn-primary mt-6">Done</button>
      </Sheet>

      {/* ── MODAL: Help & FAQ ── */}
      <Sheet open={showFaq} onClose={() => setShowFaq(false)}>
        <h3 className="font-sora text-[18px] font-bold text-gray-900 mb-5">❓ Help & FAQ</h3>
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="border-b border-gray-100 last:border-0">
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex items-center justify-between py-4 text-left">
              <span className="text-[14px] font-semibold text-gray-800 flex-1 pr-3">{item.q}</span>
              <ChevronDown size={16} className={`text-gray-400 transition-transform flex-shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
            </button>
            {openFaq === i && (
              <p className="text-[13px] text-gray-500 leading-relaxed pb-4 -mt-1 fade-up">{item.a}</p>
            )}
          </div>
        ))}
        <button onClick={() => setShowFaq(false)} className="btn-primary mt-4">Got it!</button>
      </Sheet>

      {/* ── MODAL: Privacy Policy ── */}
      <Sheet open={showPrivacy} onClose={() => setShowPrivacy(false)}>
        <h3 className="font-sora text-[18px] font-bold text-gray-900 mb-5">🔒 Privacy Policy</h3>
        <div className="space-y-4 text-[13px] text-gray-600 leading-relaxed">
          <div>
            <h4 className="font-bold text-gray-800 text-[14px] mb-1">Data Collection</h4>
            <p>We collect only the information necessary to provide our queue management service: your name, email, phone number, and queue activity. We do not collect location data or browsing history.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-[14px] mb-1">Data Storage & Security</h4>
            <p>All data is stored securely on PostgreSQL databases with SSL encryption. Passwords are hashed using bcrypt. We use JWT tokens for secure authentication.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-[14px] mb-1">Data Sharing</h4>
            <p>We never sell or share your personal data with third parties. Clinic staff can only see your name and token number — never your contact details unless you explicitly provide them.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-[14px] mb-1">Your Rights</h4>
            <p>You can request deletion of your account and all associated data at any time by contacting us. You can also export your visit history from the settings page.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-[14px] mb-1">Cookies & Local Storage</h4>
            <p>We use browser local storage to persist your session and active token so you don't lose your queue position. We do not use tracking cookies or third-party analytics.</p>
          </div>
        </div>
        <button onClick={() => setShowPrivacy(false)} className="btn-primary mt-6">Close</button>
      </Sheet>

      {/* ── MODAL: Rate QueueCare ── */}
      <Sheet open={showRating} onClose={() => setShowRating(false)}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background:'#fef3c7' }}>
            <span className="text-[32px]">⭐</span>
          </div>
          <h3 className="font-sora text-[18px] font-bold text-gray-900 mb-2">Rate QueueCare</h3>
          <p className="text-gray-400 text-[13px] mb-6">How would you rate your experience?</p>
          <div className="flex justify-center gap-3 mb-6">
            {[1,2,3,4,5].map(s => (
              <button key={s} onClick={() => handleRating(s)}
                className="transition-transform active:scale-90 hover:scale-110">
                <Star size={36} fill={s <= (userRating || 0) ? '#f59e0b' : 'none'} color={s <= (userRating || 0) ? '#f59e0b' : '#d1d5db'} />
              </button>
            ))}
          </div>
          {userRating > 0 && (
            <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-[14px] fade-up">
              <Check size={18} /> Thanks for your rating!
            </div>
          )}
        </div>
      </Sheet>

      <BottomNav />
    </div>
  );
}
