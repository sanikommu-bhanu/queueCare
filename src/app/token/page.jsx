'use client';
import { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, RefreshCw, Share2, X, Volume2, CheckCircle } from 'lucide-react';
import TokenCard from '@/components/TokenCard';
import BottomNav from '@/components/BottomNav';
import { useAppStore } from '@/store/useAppStore';
import { pad } from '@/lib/utils';
import toast from 'react-hot-toast';
import { initSocket, getSocket } from '@/lib/socket';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function TokenTracker() {
  const router = useRouter();
  const sp = useSearchParams();
  const tokenId = sp.get('id');
  const { currentToken, setCurrentToken, updateCurrentToken, clearCurrentToken, pushNotification } = useAppStore();
  const [token, setToken] = useState(currentToken);
  const [loading, setLoading] = useState(false);
  const [lastSec, setLastSec] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const announcedRef = useRef(false);

  const subscribeToPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      toast.error('Push notifications are not supported by your browser.');
      return;
    }
    try {
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey);
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });
      }
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription, token_id: token.id })
      });
      setIsSubscribed(true);
      toast.success('Subscribed to notifications!');
    } catch (error) {
      console.error('Failed to subscribe:', error);
      toast.error('Failed to subscribe to notifications.');
    }
  };

  useEffect(() => {
    if (token?.status === 'called' && !announcedRef.current) {
      pushNotification({ title:'🔔 Your turn!', body:`Token #${pad(token.token_number)} called at ${token.clinic_name || 'the clinic'}`, type:'called' });
      toast.success('Your token has been called! 🔔');
      try { window.speechSynthesis?.speak(new SpeechSynthesisUtterance(`Token number ${token.token_number}, please proceed to the consultation room.`)); } catch {}
      announcedRef.current = true;
    }
  }, [token?.status, token?.token_number, token?.clinic_name, pushNotification]);

  const refresh = useCallback(async () => {
    if (!tokenId) return;
    setLoading(true);
    if (tokenId.startsWith('demo-')) {
      setToken(prev => {
        if (!prev || prev.status === 'done') return prev;
        const ahead = Math.max(0, (prev.tokens_ahead||0) - 1);
        const status = ahead === 0 ? 'called' : 'waiting';
        const updated = { ...prev, tokens_ahead:ahead, current_token:(prev.current_token||0)+1, estimated_wait_minutes:ahead*12, status };
        updateCurrentToken(updated);
        return updated;
      });
    } else {
      try {
        const res = await fetch(`/api/tokens/status?token_id=${tokenId}`);
        if (res.ok) {
          const d = await res.json();
          setToken(d.token);
          updateCurrentToken(d.token);
        }
      } catch {}
    }
    setLastSec(0);
    setLoading(false);
  }, [tokenId, updateCurrentToken]);

  useEffect(() => { const t = setInterval(()=>setLastSec(s=>s+1), 1000); return ()=>clearInterval(t); }, []);
  
  useEffect(() => { 
    refresh(); 
    initSocket();
    const s = getSocket();
    
    const handleUpdate = () => refresh();
    
    const checkSocket = setInterval(() => {
      const sock = getSocket();
      if (sock) {
        sock.on('queueUpdated', handleUpdate);
        clearInterval(checkSocket);
      }
    }, 200);

    return () => {
      clearInterval(checkSocket);
      const sock = getSocket();
      if (sock) sock.off('queueUpdated', handleUpdate);
    };
  }, [refresh]);

  const handleLeave = () => { clearCurrentToken(); toast('Left the queue 👋'); router.replace('/home'); };
  const handleShare = async () => {
    if (!token) return;
    const text = `I'm in queue at ${token.clinic_name}! My token is #${pad(token.token_number)}. ${token.tokens_ahead} people ahead. ~${token.estimated_wait_minutes}m wait.`;
    try {
      if (navigator.share) await navigator.share({ title:'My Queue Token – QueueCare', text });
      else { await navigator.clipboard.writeText(text); toast.success('Copied to clipboard!'); }
    } catch {}
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-5 text-center">
        <div className="w-20 h-20 rounded-3xl mb-5 flex items-center justify-center" style={{background:'#e8f4fd'}}>
          <span className="text-[36px]">🎟️</span>
        </div>
        <p className="font-sora font-bold text-gray-700 text-[18px] mb-2">No Active Token</p>
        <p className="text-gray-400 text-[14px] mb-6">Join a clinic queue to get your token</p>
        <button onClick={()=>router.replace('/explore')} className="btn-primary max-w-[220px]">Find a Clinic</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Header */}
      <div className="relative overflow-hidden" style={{ height: 120 }}>
        <Image src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=900&q=80"
          alt="hospital" fill className="object-cover" sizes="430px" />
        <div className="absolute inset-0" style={{background:'linear-gradient(135deg,rgba(12,36,97,0.92),rgba(9,132,227,0.85))'}} />
        <div className="absolute top-0 left-0 right-0 pt-14 px-5 flex items-center justify-between relative z-10">
          <button onClick={()=>router.back()} className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
            <ArrowLeft size={18} color="white" />
          </button>
          <span className="font-sora font-bold text-white text-[17px]">My Token</span>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
              <Share2 size={16} color="white" />
            </button>
            <button onClick={refresh} disabled={loading} className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
              <RefreshCw size={16} color="white" className={loading?'animate-spin':''} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5">
        <TokenCard token={token} />

        <p className="text-center text-[11px] text-gray-400 mt-3 mb-4">
          Updated {lastSec < 5 ? 'just now' : `${lastSec}s ago`} · Live Real-time updates ⚡
        </p>

        {/* Queue position visualization */}
        {token.status==='waiting' && (token.tokens_ahead||0) > 0 && (
          <div className="bg-white rounded-3xl p-5 mb-4" style={{boxShadow:'0 4px 20px rgba(0,0,0,0.07)'}}>
            <h3 className="font-sora font-bold text-gray-900 text-[15px] mb-3">Queue Position</h3>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[...Array(Math.min(9,(token.tokens_ahead||0)+1))].map((_,i)=>{
                const isMe = i===(token.tokens_ahead||0);
                return (
                  <div key={i} className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-[11px] font-bold transition-all"
                    style={{
                      background: isMe ? 'linear-gradient(135deg,#1e3799,#0984e3)' : i<(token.tokens_ahead||0) ? '#f1f5f9' : '#e8f8f5',
                      color: isMe ? 'white' : i<(token.tokens_ahead||0) ? '#94a3b8' : '#00b894',
                      transform: isMe ? 'scale(1.12)' : 'scale(1)',
                      boxShadow: isMe ? '0 4px 16px rgba(9,132,227,0.4)' : 'none',
                    }}>
                    {isMe ? 'YOU' : i+1}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Done state */}
        {token.status==='done' && (
          <div className="bg-white rounded-3xl p-6 mb-4 text-center" style={{boxShadow:'0 4px 20px rgba(0,0,0,0.07)'}}>
            <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center" style={{background:'#e8f8f5'}}>
              <CheckCircle size={32} style={{color:'#00b894'}} />
            </div>
            <h3 className="font-sora font-bold text-gray-900 text-[18px] mb-1">Visit Complete!</h3>
            <p className="text-gray-400 text-[13px]">Thank you for using QueueCare</p>
          </div>
        )}

        {/* Actions */}
        {!isSubscribed && token.status !== 'done' && (
          <button onClick={subscribeToPush}
            className="w-full py-3.5 mb-3 bg-[#0c2461] text-white rounded-2xl flex items-center justify-center gap-2 text-[14px] font-bold"
            style={{boxShadow:'0 4px 16px rgba(12,36,97,0.3)'}}>
            🔔 Allow Notifications
          </button>
        )}
        <button onClick={()=>{ 
          try { 
            window.speechSynthesis?.cancel();
            window.speechSynthesis?.speak(new SpeechSynthesisUtterance(`Your token is ${token.token_number}. ${token.tokens_ahead} patients ahead. Estimated wait is ${token.estimated_wait_minutes} minutes.`)); 
          } catch { toast.error('Speech not available'); } 
        }}
          className="w-full py-3.5 mb-3 bg-white rounded-2xl flex items-center justify-center gap-2 text-[14px] font-semibold text-gray-700"
          style={{boxShadow:'0 4px 16px rgba(0,0,0,0.07)'}}>
          <Volume2 size={16} style={{color:'#0984e3'}}/> Announce Token Status
        </button>

        {(token.status==='waiting'||token.status==='called') && (
          <button onClick={handleLeave}
            className="w-full py-3.5 mb-5 rounded-2xl border-2 border-red-200 text-red-500 text-[14px] font-bold flex items-center justify-center gap-2 bg-white">
            <X size={16}/> Leave Queue
          </button>
        )}
        {token.status==='done' && (
          <button onClick={()=>router.replace('/home')} className="btn-primary mb-6">Back to Home</button>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

export default function TokenPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/></div>}>
      <TokenTracker />
    </Suspense>
  );
}
