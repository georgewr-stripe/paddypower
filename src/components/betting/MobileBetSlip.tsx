'use client';

import { useState } from 'react';
import { useBet } from '@/lib/bet-context';
import { BetSlip } from './BetSlip';
import { Receipt, X } from 'lucide-react';

export function MobileBetSlip() {
  const { betSlip } = useBet();
  const [open, setOpen] = useState(false);

  if (betSlip.length === 0) return null;

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 lg:hidden w-14 h-14 bg-green-600 hover:bg-green-700 rounded-full shadow-lg shadow-green-900/40 flex items-center justify-center transition-transform hover:scale-105"
      >
        <Receipt className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
          {betSlip.length}
        </span>
      </button>

      {/* Bottom Sheet */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Sheet */}
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto bg-[#1a1a2e] rounded-t-2xl border-t border-white/10 animate-slide-up">
            <div className="sticky top-0 bg-[#1a1a2e] px-4 pt-3 pb-2 flex items-center justify-between border-b border-white/10">
              <span className="text-white font-bold text-sm">Bet Slip ({betSlip.length})</span>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <BetSlip />
          </div>
        </div>
      )}
    </>
  );
}
