'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBet } from '@/lib/bet-context';
import { useSettings } from '@/lib/settings-context';
import { FaCheck, FaSpinner, FaTimesCircle } from 'react-icons/fa';

function ConfirmContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { setBalance, user } = useBet();
  const { currencySymbol } = useSettings();
  const [status, setStatus] = useState<'polling' | 'success' | 'failed'>('polling');
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (!sessionId) {
      setStatus('failed');
      return;
    }

    let attempts = 0;
    const maxAttempts = 20;

    const poll = async () => {
      try {
        const res = await fetch(`/api/stripe/session-status?session_id=${sessionId}`);
        const data = await res.json();

        if (data.status === 'complete' && data.payment_status === 'paid') {
          const depositAmount = (data.amount_total || 0) / 100;
          setAmount(depositAmount);
          setStatus('success');

          // Refresh balance from Stripe
          if (user?.customerId) {
            const balRes = await fetch(`/api/stripe/balance?customerId=${user.customerId}`);
            const balData = await balRes.json();
            setBalance(balData.balance);
          }

          // Redirect home after showing confirmation
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
          return;
        }

        attempts++;
        if (attempts >= maxAttempts) {
          setStatus('failed');
          return;
        }

        setTimeout(poll, 1500);
      } catch {
        attempts++;
        if (attempts >= maxAttempts) {
          setStatus('failed');
          return;
        }
        setTimeout(poll, 1500);
      }
    };

    poll();
  }, [sessionId, user?.customerId, setBalance]);

  if (status === 'polling') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <FaSpinner className="w-12 h-12 text-green-400 mx-auto mb-4 animate-spin" />
        <h2 className="text-white text-xl font-bold mb-2">Confirming your deposit...</h2>
        <p className="text-gray-400 text-sm">Please wait while we verify your payment.</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <FaTimesCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-white text-xl font-bold mb-2">Something went wrong</h2>
        <p className="text-gray-400 text-sm mb-6">We couldn&apos;t confirm your payment. Please try again.</p>
        <a
          href="/account/deposit"
          className="inline-block bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-lg transition-colors"
        >
          Back to Deposit
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <FaCheck className="w-12 h-12 text-green-400 mx-auto mb-4" />
      <h2 className="text-white text-xl font-bold mb-2">Deposit Successful!</h2>
      <p className="text-gray-400 mb-4">
        {currencySymbol}{amount.toFixed(2)} has been added to your account.
      </p>
      <p className="text-gray-500 text-sm">Redirecting you back...</p>
    </div>
  );
}

export default function DepositConfirmPage() {
  return (
    <Suspense>
      <ConfirmContent />
    </Suspense>
  );
}
