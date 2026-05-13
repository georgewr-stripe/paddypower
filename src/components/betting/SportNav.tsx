'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { sports } from '@/lib/mock-data';

interface SportNavProps {
  activeSport: string;
  onSportChange: (sportId: string) => void;
}

export function SportNav({ activeSport, onSportChange }: SportNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 4);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  return (
    <nav className="bg-[#1a1a2e] border-b border-white/10 relative">
      {showLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#1a1a2e] to-transparent z-10 pointer-events-none" />
      )}
      {showRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#1a1a2e] to-transparent z-10 pointer-events-none" />
      )}
      <div ref={scrollRef} className="flex overflow-x-auto gap-1 p-2 scrollbar-hide">
        <button
          onClick={() => onSportChange('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded whitespace-nowrap text-sm font-semibold transition-colors ${
            activeSport === 'all'
              ? 'bg-green-600 text-white'
              : 'text-gray-300 hover:bg-white/10'
          }`}
        >
          All Sports
        </button>
        {sports.map((sport) => (
          <button
            key={sport.id}
            onClick={() => onSportChange(sport.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded whitespace-nowrap text-sm font-semibold transition-colors ${
              activeSport === sport.id
                ? 'bg-green-600 text-white'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <span>{sport.icon}</span>
            <span>{sport.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
