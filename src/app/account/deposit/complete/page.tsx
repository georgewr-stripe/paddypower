'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBet } from '@/lib/bet-context';
import { useSettings } from '@/lib/settings-context';
import { Button } from '@/components/ui/Button';
import { Check, X, Loader2 } from 'lucide-react';

export default function DepositCompletePage() {
  return (
    <Suspense fallback={<div className="max-w-lg mx-auto px-4 py-8"><div className="bg-[#0f3460] rounded-lg p-8 text-center"><p className="text-white font-semibold">Loading...</p></div></div>}>
      <DepositCompleteContent />
    </Suspense>
  );
}

function DepositCompleteContent() {
  const searchParams = useSearchParams();
  const { balance, setBalance } = useBet();
  const { currencySymbol } = useSettings();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (status !== 'loading') return;

    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setStatus('failed');
      return;
    }

    fetch(`/api/stripe/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'complete' && data.payment_status === 'paid') {
          const depositAmount = (data.amount_total || 0) / 100;
          setAmount(depositAmount);
          setBalance(balance + depositAmount);
          setStatus('success');
        } else {
          setStatus('failed');
        }
      })
      .catch(() => setStatus('failed'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {status === 'loading' && (
        <div className="bg-[#0f3460] rounded-lg p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-white" />
          <p className="text-white font-semibold">Confirming your deposit...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="bg-[#0f3460] rounded-lg p-8 text-center">
          <Check className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Deposit Successful!</h2>
          <p className="text-gray-400 mb-4">
            {currencySymbol}{amount.toFixed(2)} has been added to your account.
          </p>
          <p className="text-gray-300">
            New balance: <span className="text-white font-bold">{currencySymbol}{balance.toFixed(2)}</span>
          </p>
          <Button
            variant="primary"
            className="mt-6"
            onClick={() => (window.location.href = '/')}
          >
            Start Betting
          </Button>
        </div>
      )}

      {status === 'failed' && (
        <div className="bg-[#0f3460] rounded-lg p-8 text-center">
          <X className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Deposit Failed</h2>
          <p className="text-gray-400 mb-4">
            Something went wrong with your deposit. Please try again.
          </p>
          <Button
            variant="primary"
            className="mt-6"
            onClick={() => (window.location.href = '/account/deposit')}
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
