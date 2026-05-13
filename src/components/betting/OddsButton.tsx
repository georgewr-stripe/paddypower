'use client';

import { formatOdds } from '@/lib/mock-data';
import { useBet } from '@/lib/bet-context';

interface OddsButtonProps {
  eventId: string;
  eventName: string;
  market: string;
  selection: string;
  odds: number;
}

export function OddsButton({ eventId, eventName, market, selection, odds }: OddsButtonProps) {
  const { betSlip, addBet, removeBet } = useBet();

  const isSelected = betSlip.some(
    (b) => b.eventId === eventId && b.selection === selection
  );

  const handleClick = () => {
    if (isSelected) {
      removeBet(eventId, selection);
    } else {
      addBet({ eventId, selection, odds, market, eventName });
    }
  };

  if (odds <= 0) return <div className="w-16" />;

  return (
    <button
      onClick={handleClick}
      className={`min-w-[60px] px-3 py-2 rounded text-center font-bold text-sm transition-all duration-150 hover:scale-105 ${
        isSelected
          ? 'bg-green-600 text-white ring-2 ring-green-400'
          : 'bg-[#2a3a5e] text-yellow-400 hover:bg-[#3a4a6e]'
      }`}
    >
      {formatOdds(odds)}
    </button>
  );
}
