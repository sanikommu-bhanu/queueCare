'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stethoscope } from 'lucide-react';

export default function SplashPage() {
  const router = useRouter();
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    // Slight delay before animating logo in
    const inTimer = setTimeout(() => {
      setShowLogo(true);
    }, 100);

    // Redirect after 2.5 seconds
    const redirectTimer = setTimeout(() => {
      router.replace('/welcome');
    }, 2500);

    return () => {
      clearTimeout(inTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c2461]">
      <div 
        className={`flex flex-col items-center justify-center transition-all duration-1000 transform ${
          showLogo ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'
        }`}
      >
        <div className="w-24 h-24 bg-white/10 rounded-[2rem] flex items-center justify-center mb-6 backdrop-blur-md border border-white/20 shadow-2xl">
          <Stethoscope size={48} color="white" />
        </div>
        <h1 className="font-sora text-4xl font-extrabold text-white tracking-tight">
          QueueCare
        </h1>
        <p className="text-white/60 mt-3 font-medium text-sm tracking-widest uppercase">
          Smart Clinic Queueing
        </p>
      </div>
      
      {/* Loading spinner */}
      <div 
        className={`absolute bottom-16 transition-opacity duration-1000 delay-500 ${
          showLogo ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
