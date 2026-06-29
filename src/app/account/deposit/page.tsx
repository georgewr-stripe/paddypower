'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { stripePromise } from '@/lib/stripe-client';
import { useBet } from '@/lib/bet-context';
import { useSettings } from '@/lib/settings-context';
import { Button } from '@/components/ui/Button';
import { FaCheck, FaArrowRight, FaCreditCard, FaSpinner } from 'react-icons/fa';
import { PaymentMethodIcon } from '@/components/ui/PaymentMethodIcon';
import type { StripeExpressCheckoutElementConfirmEvent } from '@stripe/stripe-js';
import {
  CheckoutElementsProvider,
  PaymentElement,
  ExpressCheckoutElement,
  useCheckoutElements,
} from '@stripe/react-stripe-js/checkout';

type SavedMethod = {
  id: string;
  type: string;
  brand: string | null;
  last4: string | null;
  expMonth: number | null;
  expYear: number | null;
  bankName: string | null;
  bankLast4: string | null;
  email: string | null;
};

function DepositForm({ amount, currencySymbol, onSuccess }: { amount: number; currencySymbol: string; onSuccess: () => void }) {
  const checkoutState = useCheckoutElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  if (checkoutState.type === 'loading') {
    return <div className="text-center text-gray-400 py-8">Loading payment form...</div>;
  }

  if (checkoutState.type === 'error') {
    return <div className="text-center text-red-400 py-8">{checkoutState.error.message}</div>;
  }

  const { checkout } = checkoutState;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    const result = await checkout.confirm();

    if (result.type === 'error') {
      setError(result.error.message || 'Payment failed');
      setProcessing(false);
    } else {
      onSuccess();
    }
  };

  const handleExpressCheckout = async (event: StripeExpressCheckoutElementConfirmEvent) => {
    const result = await checkout.confirm({ expressCheckoutConfirmEvent: event });
    if (result.type === 'error') {
      setError(result.error.message || 'Payment failed');
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <ExpressCheckoutElement onConfirm={handleExpressCheckout} />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-gray-400 text-xs">Or pay with card</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <PaymentElement
        options={{
          layout: {
            type: 'accordion',
            defaultCollapsed: false,
            radios: 'always',
            spacedAccordionItems: true,
          },
        }}
      />

      {error && (
        <p className="text-red-400 text-sm mt-3">{error}</p>
      )}

      <Button
        type="submit"
        variant="secondary"
        fullWidth
        size="lg"
        disabled={processing}
        className="mt-4"
      >
        {processing ? 'Processing...' : `Deposit ${currencySymbol}${amount.toFixed(2)}`}
      </Button>
    </form>
  );
}

function SavedMethodCard({
  method,
  selected,
  onSelect,
}: {
  method: SavedMethod;
  selected: boolean;
  onSelect: (methodId: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(method.id)}
      className={`w-full flex items-center gap-3 rounded-lg p-4 transition-all ${
        selected
          ? 'bg-[#1a1a2e] border-2 border-green-500'
          : 'bg-[#1a1a2e] border border-white/10 hover:border-white/30'
      }`}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
        selected ? 'border-green-500' : 'border-gray-500'
      }`}>
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-green-500" />}
      </div>
      <div className="flex-shrink-0">
        <PaymentMethodIcon type={method.type} brand={method.brand} />
      </div>
      <div className="flex-1 text-left">
        <p className="text-white text-sm font-medium capitalize">
          {method.type === 'card' && method.brand
            ? `${method.brand} •••• ${method.last4}`
            : method.bankName
              ? `${method.bankName} •••• ${method.bankLast4}`
              : method.email || method.type.replace(/_/g, ' ')}
        </p>
        <p className="text-gray-400 text-xs">
          {method.type === 'card' && method.expMonth
            ? `Expires ${String(method.expMonth).padStart(2, '0')}/${method.expYear}`
            : method.type.replace(/_/g, ' ')}
        </p>
      </div>
    </button>
  );
}

export default function DepositPage() {
  return (
    <Suspense>
      <DepositPageInner />
    </Suspense>
  );
}

function DepositPageInner() {
  const { balance, setBalance, user, updateUser } = useBet();
  const { currencySymbol, settings } = useSettings();
  const searchParams = useSearchParams();
  const prefillAmount = searchParams.get('amount');
  const [amount, setAmount] = useState(prefillAmount ? Number(prefillAmount) : 20);
  const [clientSecret, setClientSecret] = useState('');
  const [showNewPayment, setShowNewPayment] = useState(false);
  const [success, setSuccess] = useState(false);
  const [savedMethods, setSavedMethods] = useState<SavedMethod[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [charging, setCharging] = useState(false);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  useEffect(() => {
    if (user?.customerId) {
      fetch(`/api/stripe/payment-methods?customerId=${user.customerId}`)
        .then((res) => res.json())
        .then((data) => {
          setSavedMethods(data.paymentMethods);
          if (data.paymentMethods.length > 0) {
            setSelectedMethod(data.paymentMethods[0].id);
          }
        })
        .finally(() => setLoadingMethods(false));
    } else {
      setLoadingMethods(false);
    }
  }, [user?.customerId]);

  const handleVerify = async () => {
    if (!user) return;
    setVerifying(true);
    setVerifyError('');

    try {
      const res = await fetch('/api/stripe/create-identity-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          flow: 'deposit-verification',
          customerId: user.customerId,
        }),
      });
      const data = await res.json();

      const stripe = await stripePromise;
      if (!stripe) {
        setVerifyError('Stripe failed to load');
        return;
      }

      const result = await stripe.verifyIdentity(data.clientSecret);
      if (result.error) {
        setVerifyError(result.error.message || 'Verification failed');
      } else {
        await fetch('/api/stripe/verify-customer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerId: user.customerId }),
        });
        updateUser({ verified: true });
      }
    } catch {
      setVerifyError('Something went wrong. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  if (!user?.verified) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Deposit Funds</h1>
        <div className="bg-[#0f3460] rounded-lg p-6">
          <h2 className="text-white font-bold text-lg mb-2">Identity Verification Required</h2>
          <p className="text-gray-400 text-sm mb-4">
            Before you can deposit funds, we need to verify your identity. This is required by gambling regulations and takes less than 2 minutes.
          </p>

          <div className="bg-[#1a1a2e] rounded-lg p-4 mb-4">
            <div className="space-y-2 text-sm text-gray-300">
              <p className="flex items-center gap-2"><FaCheck className="w-4 h-4 text-green-400" /> Government-issued photo ID (passport, driving licence)</p>
              <p className="flex items-center gap-2"><FaCheck className="w-4 h-4 text-green-400" /> Live selfie for facial matching</p>
              <p className="flex items-center gap-2"><FaCheck className="w-4 h-4 text-green-400" /> Encrypted &amp; processed securely by Stripe</p>
            </div>
          </div>

          {verifyError && <p className="text-red-400 text-sm mb-3">{verifyError}</p>}

          <Button
            variant="secondary"
            fullWidth
            size="lg"
            disabled={verifying}
            onClick={handleVerify}
          >
            {verifying ? 'Verifying...' : 'Verify Identity'}
          </Button>

          <button
            onClick={() => updateUser({ verified: true })}
            className="w-full mt-3 text-gray-500 text-xs hover:text-gray-300 transition-colors"
          >
            Skip for demo <FaArrowRight className="w-3 h-3 inline" />
          </button>

          <p className="text-xs text-gray-500 text-center mt-3">
            Powered by Stripe Identity
          </p>
        </div>
      </div>
    );
  }

  const handleSavedMethodDeposit = async () => {
    if (amount <= 0 || !selectedMethod) return;
    setCharging(true);
    setError('');

    try {
      const res = await fetch('/api/stripe/charge-saved-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency: settings.currency,
          customerId: user?.customerId,
          paymentMethodId: selectedMethod,
        }),
      });

      const data = await res.json();

      if (data.status === 'succeeded') {
        setBalance(balance + amount);
        setSuccess(true);
      } else {
        setError('Payment failed. Please try a different method.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setCharging(false);
    }
  };

  const handleNewPayment = async () => {
    if (amount <= 0) return;

    const res = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: settings.currency,
        customerId: user?.customerId,
        description: `Account deposit - ${currencySymbol}${amount.toFixed(2)}`,
      }),
    });

    const data = await res.json();
    setClientSecret(data.clientSecret);
    setShowNewPayment(true);
  };

  const handleSuccess = () => {
    setBalance(balance + amount);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-[#0f3460] rounded-lg p-8 text-center">
          <FaCheck className="w-12 h-12 text-green-400 mx-auto mb-4" />
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
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Deposit Funds</h1>

      <div className="bg-[#0f3460] rounded-lg p-6">
        <p className="text-gray-300 text-sm mb-4">
          Current balance: <span className="text-white font-bold">{currencySymbol}{balance.toFixed(2)}</span>
        </p>

        {/* Amount Selection */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[10, 20, 50, 100].map((preset) => (
            <button
              key={preset}
              onClick={() => { setAmount(preset); setShowNewPayment(false); setClientSecret(''); }}
              className={`py-3 rounded font-bold transition-colors ${
                amount === preset
                  ? 'bg-green-600 text-white'
                  : 'bg-[#2a3a5e] text-gray-300 hover:bg-[#3a4a6e]'
              }`}
            >
              {currencySymbol}{preset}
            </button>
          ))}
        </div>

        <div className="relative mb-6">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">{currencySymbol}</span>
          <input
            type="number"
            value={amount || ''}
            onChange={(e) => { setAmount(Number(e.target.value)); setShowNewPayment(false); setClientSecret(''); }}
            placeholder="Custom amount"
            className="w-full bg-[#1a1a2e] border border-white/10 rounded px-8 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        {/* Saved Payment Methods */}
        {loadingMethods ? (
          <div className="text-center text-gray-400 text-sm py-4">Loading payment methods...</div>
        ) : savedMethods.length > 0 && !showNewPayment ? (
          <div className="mb-4">
            <p className="text-gray-400 text-xs uppercase tracking-wide font-medium mb-3">Saved payment methods</p>
            <div className="space-y-2">
              {savedMethods.map((method) => (
                <SavedMethodCard
                  key={method.id}
                  method={method}
                  selected={selectedMethod === method.id}
                  onSelect={setSelectedMethod}
                />
              ))}
            </div>

            <Button
              variant="secondary"
              fullWidth
              size="lg"
              disabled={amount <= 0 || !selectedMethod || charging}
              onClick={handleSavedMethodDeposit}
              className="mt-4"
            >
              {charging ? 'Processing...' : `Deposit ${currencySymbol}${amount.toFixed(2)}`}
            </Button>

            <button
              onClick={handleNewPayment}
              disabled={amount <= 0}
              className="w-full mt-3 text-green-400 text-sm hover:text-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pay with a new method
            </button>
          </div>
        ) : !showNewPayment ? (
          <Button
            variant="secondary"
            fullWidth
            size="lg"
            disabled={amount <= 0}
            onClick={handleNewPayment}
          >
            Continue to Payment
          </Button>
        ) : null}

        {/* New Payment Form */}
        {showNewPayment && clientSecret && (
          <div className="mt-4">
            {savedMethods.length > 0 && (
              <button
                onClick={() => { setShowNewPayment(false); setClientSecret(''); }}
                className="text-green-400 text-sm hover:underline mb-4 block"
              >
                ← Back to saved methods
              </button>
            )}
            <CheckoutElementsProvider
              stripe={stripePromise}
              options={{
                clientSecret,
                elementsOptions: {
                  appearance: {
                    theme: 'night',
                    variables: {
                      colorPrimary: settings.branding.primaryColor,
                      colorBackground: '#1a1a2e',
                      colorText: '#ffffff',
                    },
                  },
                },
              }}
            >
              <DepositForm amount={amount} currencySymbol={currencySymbol} onSuccess={handleSuccess} />
            </CheckoutElementsProvider>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Secured by Stripe &bull; Radar fraud protection active
        </div>
      </div>
    </div>
  );
}
