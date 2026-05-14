'use client';

import { useBet } from '@/lib/bet-context';
import { useSettings } from '@/lib/settings-context';
import { formatOdds } from '@/lib/mock-data';
import { Button } from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import { Check, CreditCard, Loader2, Plus } from 'lucide-react';

type SavedMethod = {
  id: string;
  brand: string;
  last4: string;
};

function QuickTopUp() {
  const { user, balance, setBalance } = useBet();
  const { currencySymbol, settings } = useSettings();
  const [defaultMethod, setDefaultMethod] = useState<SavedMethod | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [charging, setCharging] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.customerId) {
      setLoading(false);
      return;
    }
    fetch(`/api/stripe/payment-methods?customerId=${user.customerId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.paymentMethods.length > 0) {
          setDefaultMethod(data.paymentMethods[0]);
        }
      })
      .finally(() => setLoading(false));
  }, [user?.customerId]);

  const handleQuickDeposit = async () => {
    if (!selectedAmount || !defaultMethod || !user?.customerId) return;
    setCharging(true);
    setError('');

    try {
      const res = await fetch('/api/stripe/charge-saved-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(selectedAmount * 100),
          currency: settings.currency,
          customerId: user.customerId,
          paymentMethodId: defaultMethod.id,
        }),
      });

      const data = await res.json();

      if (data.status === 'succeeded') {
        setBalance(balance + selectedAmount);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setSelectedAmount(null);
        }, 2000);
      } else {
        setError('Failed. Try the full deposit page.');
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setCharging(false);
    }
  };

  if (loading) return null;

  if (!defaultMethod) {
    return (
      <div className="bg-[#1a1a2e] border border-white/10 rounded-lg p-4 mt-3">
        <p className="text-gray-400 text-xs mb-2">Quick Top Up</p>
        <a
          href="/account/deposit"
          className="flex items-center gap-2 text-green-400 text-sm hover:text-green-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add a payment method
        </a>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-[#1a1a2e] border border-white/10 rounded-lg p-4 mt-3">
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <Check className="w-4 h-4" />
          <span className="font-medium">{currencySymbol}{selectedAmount?.toFixed(2)} added!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a2e] border border-white/10 rounded-lg p-4 mt-3">
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-400 text-xs uppercase tracking-wide font-medium">Quick Top Up</p>
        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
          <CreditCard className="w-3 h-3" />
          <span className="capitalize">{defaultMethod.brand} •••• {defaultMethod.last4}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5 mb-3">
        {[10, 20, 50, 100].map((amt) => (
          <button
            key={amt}
            onClick={() => setSelectedAmount(amt)}
            className={`py-2 rounded text-xs font-bold transition-colors ${
              selectedAmount === amt
                ? 'bg-green-600 text-white'
                : 'bg-[#2a3a5e] text-gray-300 hover:bg-[#3a4a6e]'
            }`}
          >
            {currencySymbol}{amt}
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 text-xs mb-2">{error}</p>}

      <button
        onClick={handleQuickDeposit}
        disabled={!selectedAmount || charging}
        className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white text-sm font-bold py-2 rounded transition-colors flex items-center justify-center gap-2"
      >
        {charging ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
        ) : selectedAmount ? (
          `Deposit ${currencySymbol}${selectedAmount}`
        ) : (
          'Select amount'
        )}
      </button>

      <a
        href="/account/deposit"
        className="block text-center text-gray-500 text-xs mt-2 hover:text-gray-300 transition-colors"
      >
        Use a different method
      </a>
    </div>
  );
}

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
    <div>
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

      {isLoggedIn && <QuickTopUp />}
    </div>
  );
}
