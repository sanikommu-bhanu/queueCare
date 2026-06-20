'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Ticket, Bell, User } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { pad } from '@/lib/utils';

const ITEMS = [
  { href: '/home', label: 'Home', Icon: Home },
  { href: '/explore', label: 'Find Clinic', Icon: Search },
  { href: null, label: 'Token', Icon: Ticket, fab: true },
  { href: '/notifications', label: 'Alerts', Icon: Bell },
  { href: '/settings', label: 'Profile', Icon: User },
];

export default function BottomNav() {
  const path = usePathname();
  const { currentToken, notifications } = useAppStore();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-[76px] bg-white border-t border-gray-100 flex items-start pt-2.5 z-50"
      style={{ boxShadow: '0 -6px 24px rgba(0,0,0,0.06)' }}>
      {ITEMS.map(({ href, label, Icon, fab }) => {
        if (fab) {
          const tokenHref = currentToken ? `/token?id=${currentToken.id}` : '/explore';
          const active = !!currentToken;
          return (
            <Link key="fab" href={tokenHref} className="flex-1 flex flex-col items-center gap-1">
              <div className="relative w-[52px] h-[52px] rounded-full flex items-center justify-center -mt-5 transition-transform active:scale-90"
                style={{ background: active ? 'linear-gradient(135deg,#f59e0b,#f97316)' : 'linear-gradient(135deg,#1e3799,#0984e3)', boxShadow: active ? '0 8px 24px rgba(245,158,11,0.4)' : '0 8px 24px rgba(9,132,227,0.4)' }}>
                <Icon size={21} color="white" />
                {active && <span className="absolute top-[3px] right-[3px] w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white status-live" />}
              </div>
              <span className="text-[10px] font-bold" style={{ color: active ? '#f59e0b' : '#0984e3' }}>
                {active ? `#${pad(currentToken.token_number)}` : 'My Token'}
              </span>
            </Link>
          );
        }
        const active = path === href || path.startsWith(href + '/');
        const showBadge = href === '/notifications' && unread > 0;
        return (
          <Link key={href} href={href} className="flex-1 flex flex-col items-center gap-1">
            <div className={`w-[42px] h-[42px] rounded-[13px] flex items-center justify-center relative transition-colors ${active ? 'bg-blue-50' : ''}`}>
              <Icon size={19} color={active ? '#0984e3' : '#94a3b8'} />
              {showBadge && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold" style={{ color: active ? '#0984e3' : '#94a3b8' }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
