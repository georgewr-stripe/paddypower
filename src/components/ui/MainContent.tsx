'use client';

import { useSettings } from '@/lib/settings-context';
import { ReactNode, useEffect } from 'react';

export function MainContent({ children }: { children: ReactNode }) {
  const { adminOpen } = useSettings();

  useEffect(() => {
    if (adminOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [adminOpen]);

  return (
    <div
      id="main-content"
      className={`min-h-screen flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] origin-center ${
        adminOpen
          ? 'scale-[0.88] translate-x-[140px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10'
          : 'scale-100 translate-x-0'
      }`}
    >
      {children}
    </div>
  );
}
