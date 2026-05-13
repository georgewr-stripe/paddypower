'use client';

import { useBet } from '@/lib/bet-context';
import { useSettings } from '@/lib/settings-context';
import { formatOdds } from '@/lib/mock-data';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { Check } from 'lucide-react';

export function BetSlip() {
  const { betSlip, removeBet, clearSlip, stake, setStake, balance, setBalance, isLoggedIn, setShowLoginModal } = useBet();
  const { currencySymbol, currencyCode } = useSettings();
  const [placingBet, setPlacingBet] = useState(false);
  const [betPlaced, setBetPlaced] = useState(false);

  const totalOdds = betSlip.reduce((acc, bet) => acc * bet.odds, 1);
  const potentialReturn = stake * totalOdds;

  const handlePlaceBet = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (stake <= 0 || stake > balance) return;

    setPlacingBet(true);
    try {
      const res = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(stake * 100),
          description: betSlip.length === 1
            ? `Bet: ${betSlip[0].eventName} - ${betSlip[0].selection}`
            : `Acca: ${betSlip.length}-fold`,
        }),
      });

      if (res.ok) {
        setBalance(balance - stake);
        setBetPlaced(true);
        setTimeout(() => {
          clearSlip();
          setBetPlaced(false);
        }, 2000);
      }
    } finally {
      setPlacingBet(false);
    }
  };

  return (
    <div className="bg-[#1a1a2e] border border-white/10 rounded-lg overflow-hidden">
      <div className="bg-green-700 px-4 py-3 flex justify-between items-center">
        <h3 className="font-bold text-white text-sm">
          Bet Slip {betSlip.length > 0 && `(${betSlip.length})`}
        </h3>
        {betSlip.length > 0 && (
          <button onClick={clearSlip} className="text-xs text-white/70 hover:text-white">
            Clear All
          </button>
        )}
      </div>

      <div className="p-4">
        {betPlaced ? (
          <div className="text-center py-6">
            <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-green-400 font-bold">Bet Placed!</p>
            <p className="text-gray-400 text-sm mt-1">Good luck!</p>
          </div>
        ) : betSlip.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">
            Your bet slip is empty.<br />
            <span className="text-xs">Click on odds to add selections.</span>
          </p>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {betSlip.map((bet) => (
                <div
                  key={`${bet.eventId}-${bet.selection}`}
                  className="bg-[#0f3460] rounded p-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-white text-sm font-semibold">{bet.selection}</p>
                      <p className="text-gray-400 text-xs">{bet.market}</p>
                      <p className="text-gray-500 text-xs">{bet.eventName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 font-bold text-sm">
                        {formatOdds(bet.odds)}
                      </span>
                      <button
                        onClick={() => removeBet(bet.eventId, bet.selection)}
                        className="text-gray-500 hover:text-red-400 text-lg leading-none"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {betSlip.length > 1 && (
              <div className="text-xs text-gray-400 mb-2">
                Accumulator odds: <span className="text-yellow-400 font-bold">{formatOdds(totalOdds)}</span>
              </div>
            )}

            <div className="flex gap-2 mb-3">
              {[5, 10, 20, 50].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setStake(amount)}
                  className={`flex-1 py-1.5 rounded text-xs font-bold transition-colors ${
                    stake === amount
                      ? 'bg-green-600 text-white'
                      : 'bg-[#2a3a5e] text-gray-300 hover:bg-[#3a4a6e]'
                  }`}
                >
                  {currencySymbol}{amount}
                </button>
              ))}
            </div>

            <div className="relative mb-3">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}</span>
              <input
                type="number"
                value={stake || ''}
                onChange={(e) => setStake(Number(e.target.value))}
                placeholder="Enter stake"
                className="w-full bg-[#0f3460] border border-white/10 rounded px-8 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-400">Potential Return:</span>
              <span className="text-white font-bold">
                {currencySymbol}{potentialReturn.toFixed(2)}
              </span>
            </div>

            <Button
              variant="secondary"
              fullWidth
              size="lg"
              disabled={stake <= 0 || stake > balance || placingBet}
              onClick={handlePlaceBet}
            >
              {placingBet
                ? 'Placing...'
                : !isLoggedIn
                  ? 'Log in to Place Bet'
                  : stake > balance
                    ? 'Insufficient Balance'
                    : `Place Bet - ${currencySymbol}${stake.toFixed(2)}`}
            </Button>

            {isLoggedIn && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Balance: {currencySymbol}{balance.toFixed(2)}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
