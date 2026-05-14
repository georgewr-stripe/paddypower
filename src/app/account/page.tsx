'use client';

import { useState, useEffect, useCallback } from 'react';
import { useBet } from '@/lib/bet-context';
import { useSettings } from '@/lib/settings-context';
import { stripePromise } from '@/lib/stripe-client';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { FaCheck, FaUniversity, FaCreditCard, FaPlus, FaArrowUp, FaArrowDown, FaStar, FaMinus, FaExternalLinkAlt, FaInfoCircle, FaTrash, FaSpinner } from 'react-icons/fa';
import { Skeleton } from '@/components/ui/Skeleton';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentMethodIcon } from '@/components/ui/PaymentMethodIcon';

interface SavedPaymentMethod {
  id: string;
  type: string;
  brand: string | null;
  last4: string | null;
  expMonth: number | null;
  expYear: number | null;
  bankName: string | null;
  bankLast4: string | null;
  email: string | null;
}

function AddCardForm({ customerId, onSuccess, onCancel }: { customerId: string; onSuccess: () => void; onCancel: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Validation failed');
      setProcessing(false);
      return;
    }

    const res = await fetch('/api/stripe/create-setup-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId }),
    });
    const { clientSecret } = await res.json();

    const result = await stripe.confirmSetup({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/account`,
      },
      redirect: 'if_required',
    });

    if (result.error) {
      setError(result.error.message || 'Failed to save payment method');
      setProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-6 py-4 border-t border-white/10">
      <p className="text-white text-sm font-medium mb-3">Add a new payment method</p>
      <PaymentElement />
      {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
      <div className="flex gap-2 mt-4">
        <Button type="submit" variant="secondary" size="sm" disabled={processing || !stripe}>
          {processing ? 'Saving...' : 'Save'}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

interface PayoutMethod {
  id: string;
  type: string;
  availablePayoutSpeeds: string[];
  bankAccount?: { last4: string; bankName: string; country: string; supportedCurrencies: string[] };
  card?: { last4: string; expMonth: string; expYear: string };
}

interface OutboundPayment {
  id: string;
  status: string;
  amount: { value: number; currency: string };
  description: string | null;
  created: string;
  expectedArrivalDate: string | null;
  statusTransitions: {
    canceled_at?: string;
    failed_at?: string;
    posted_at?: string;
    returned_at?: string;
  } | null;
  payoutMethodId: string;
  receiptUrl: string | null;
  traceId: { status: string; value: string | null } | null;
}

function TimelineEvent({ label, timestamp, active, variant = 'default' }: {
  label: string;
  timestamp?: string;
  active: boolean;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'muted';
}) {
  const dotColor = !active
    ? 'bg-gray-600 animate-pulse'
    : variant === 'success'
      ? 'bg-green-400'
      : variant === 'error'
        ? 'bg-red-400'
        : variant === 'warning'
          ? 'bg-orange-400'
          : variant === 'muted'
            ? 'bg-gray-400'
            : 'bg-blue-400';

  return (
    <div className="relative flex items-center gap-2">
      <div className={`absolute -left-[21px] w-2.5 h-2.5 rounded-full ${dotColor}`} />
      <p className={`text-xs ${active ? 'text-white' : 'text-gray-500'}`}>
        {label}
        {timestamp && (
          <span className="text-gray-500 ml-2">
            {new Date(timestamp).toLocaleString('en-GB', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
            })}
          </span>
        )}
      </p>
    </div>
  );
}

export default function AccountPage() {
  const { balance, user, updateUser } = useBet();
  const { currencySymbol } = useSettings();
  const [verifying, setVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verified' | 'failed'>(
    user?.verified ? 'verified' : 'idle'
  );
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<SavedPaymentMethod[]>([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);
  const [removingMethodId, setRemovingMethodId] = useState<string | null>(null);
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [outboundPayments, setOutboundPayments] = useState<OutboundPayment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [transactions, setTransactions] = useState<{ id: string; type: string; description: string; amount: number; date: string }[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  const fetchPayoutMethods = useCallback(async () => {
    if (!user?.recipientId) return;
    setLoadingMethods(true);
    try {
      const res = await fetch(`/api/stripe/payout-methods?recipientId=${user.recipientId}`);
      const data = await res.json();
      if (res.ok && data.data) {
        setPayoutMethods(data.data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingMethods(false);
    }
  }, [user?.recipientId]);

  const fetchOutboundPayments = useCallback(async () => {
    if (!user?.recipientId) return;
    setLoadingPayments(true);
    try {
      const res = await fetch(`/api/stripe/outbound-payments?recipientId=${user.recipientId}`);
      const data = await res.json();
      if (res.ok && data.data) {
        setOutboundPayments(data.data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingPayments(false);
    }
  }, [user?.recipientId]);

  const fetchSavedPaymentMethods = useCallback(async () => {
    if (!user?.customerId) {
      setLoadingPaymentMethods(false);
      return;
    }
    setLoadingPaymentMethods(true);
    try {
      const res = await fetch(`/api/stripe/payment-methods?customerId=${user.customerId}`);
      const data = await res.json();
      setSavedPaymentMethods(data.paymentMethods || []);
    } catch {
      // ignore
    } finally {
      setLoadingPaymentMethods(false);
    }
  }, [user?.customerId]);

  const handleAddNewMethod = () => {
    setShowAddCard(true);
  };

  const handleRemoveMethod = async (methodId: string) => {
    setRemovingMethodId(methodId);
    try {
      await fetch('/api/stripe/detach-payment-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethodId: methodId }),
      });
      setSavedPaymentMethods((prev) => prev.filter((m) => m.id !== methodId));
    } catch {
      // ignore
    } finally {
      setRemovingMethodId(null);
    }
  };

  const fetchTransactions = useCallback(async () => {
    if (!user?.customerId) {
      setLoadingTransactions(false);
      return;
    }
    setLoadingTransactions(true);
    try {
      const res = await fetch(`/api/stripe/transactions?customerId=${user.customerId}`);
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch {
      // ignore
    } finally {
      setLoadingTransactions(false);
    }
  }, [user?.customerId]);

  useEffect(() => {
    fetchSavedPaymentMethods();
    fetchPayoutMethods();
    fetchOutboundPayments();
    fetchTransactions();
  }, [fetchSavedPaymentMethods, fetchPayoutMethods, fetchOutboundPayments, fetchTransactions]);

  const handleVerifyIdentity = async () => {
    if (!user) return;
    setVerifying(true);
    try {
      const res = await fetch('/api/stripe/create-identity-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          flow: 'account-verify',
          customerId: user.customerId,
        }),
      });
      const data = await res.json();

      const stripe = await stripePromise;
      if (!stripe) return;

      const result = await stripe.verifyIdentity(data.clientSecret);
      if (result.error) {
        setVerificationStatus('failed');
      } else {
        await fetch('/api/stripe/verify-customer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerId: user.customerId }),
        });
        updateUser({ verified: true });
        setVerificationStatus('verified');
      }
    } catch {
      setVerificationStatus('failed');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">My Account</h1>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-green-700 to-green-900 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-200 text-sm">Available Balance</p>
            <p className="text-white text-4xl font-black">{currencySymbol}{balance.toFixed(2)}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/account/deposit">
              <Button variant="secondary">Deposit</Button>
            </Link>
            <Link href="/account/withdraw">
              <Button variant="ghost">Withdraw</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#0f3460] rounded-lg p-4">
          <h3 className="text-gray-400 text-xs uppercase mb-1">Deposit Limits</h3>
          <p className="text-white font-bold text-lg">{currencySymbol}500/week</p>
          <p className="text-gray-400 text-xs mt-1">{currencySymbol}350 remaining</p>
          <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '30%' }} />
          </div>
        </div>
        <div className="bg-[#0f3460] rounded-lg p-4">
          <h3 className="text-gray-400 text-xs uppercase mb-1">Open Bets</h3>
          <p className="text-white font-bold text-lg">3 Active</p>
          <p className="text-gray-400 text-xs mt-1">Total stake: {currencySymbol}25.00</p>
        </div>
        <div className="bg-[#0f3460] rounded-lg p-4">
          <h3 className="text-gray-400 text-xs uppercase mb-1">Verification</h3>
          {verificationStatus === 'verified' ? (
            <>
              <p className="text-green-400 font-bold text-lg flex items-center gap-1">Verified <FaCheck className="w-4 h-4" /></p>
              <p className="text-gray-400 text-xs mt-1">ID verified via Stripe Identity</p>
            </>
          ) : (
            <>
              <p className="text-yellow-400 font-bold text-lg">Unverified</p>
              <button
                onClick={handleVerifyIdentity}
                disabled={verifying}
                className="mt-2 text-xs bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 py-1.5 rounded font-semibold transition-colors"
              >
                {verifying ? 'Opening...' : 'Verify Identity'}
              </button>
              {verificationStatus === 'failed' && (
                <p className="text-red-400 text-xs mt-1">Verification failed. Try again.</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Saved Payment Methods */}
      <div className="bg-[#0f3460] rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-white font-bold">Payment Methods</h2>
          {!showAddCard && (
            <button
              onClick={handleAddNewMethod}
              className="text-xs text-green-400 hover:text-green-300 transition-colors flex items-center gap-1"
            >
              <FaPlus className="w-3 h-3" /> Add new
            </button>
          )}
        </div>
        {loadingPaymentMethods ? (
          <div className="px-6 py-4 space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1.5" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : savedPaymentMethods.length === 0 && !showAddCard ? (
          <div className="px-6 py-8 text-center">
            <FaCreditCard className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400 text-sm mb-3">No payment methods saved yet.</p>
            <Button variant="secondary" size="sm" onClick={handleAddNewMethod}>
              Add Payment Method
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {savedPaymentMethods.map((method) => (
              <div key={method.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PaymentMethodIcon type={method.type} brand={method.brand} />
                  <div>
                    <p className="text-white text-sm font-medium capitalize">
                      {method.type === 'card' && method.brand
                        ? `${method.brand} •••• ${method.last4}`
                        : method.type === 'us_bank_account' || method.type === 'sepa_debit'
                          ? `${method.bankName || 'Bank'} •••• ${method.bankLast4}`
                          : method.email
                            ? `${method.type} — ${method.email}`
                            : method.type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {method.type === 'card' && method.expMonth
                        ? `Expires ${String(method.expMonth).padStart(2, '0')}/${method.expYear}`
                        : method.type.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveMethod(method.id)}
                  disabled={removingMethodId === method.id}
                  className="text-gray-500 hover:text-red-400 transition-colors p-1.5 rounded hover:bg-red-500/10 disabled:opacity-50"
                >
                  {removingMethodId === method.id ? (
                    <FaSpinner className="w-4 h-4 animate-spin" />
                  ) : (
                    <FaTrash className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
        {showAddCard && (
          <Elements stripe={stripePromise} options={{ mode: 'setup', currency: 'gbp', setupFutureUsage: 'on_session', appearance: { theme: 'night', variables: { colorPrimary: '#22c55e', colorBackground: '#1a1a2e', colorText: '#ffffff' } } }}>
            <AddCardForm
              customerId={user?.customerId || ''}
              onSuccess={() => {
                setShowAddCard(false);
                fetchSavedPaymentMethods();
              }}
              onCancel={() => setShowAddCard(false)}
            />
          </Elements>
        )}
      </div>

      {/* Saved Bank Accounts */}
      {user?.recipientId && (
        <div className="bg-[#0f3460] rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-white font-bold">Withdrawal Methods</h2>
            <Link href="/account/withdraw" className="text-xs text-green-400 hover:text-green-300 transition-colors flex items-center gap-1">
              <FaPlus className="w-3 h-3" /> Add new
            </Link>
          </div>
          {loadingMethods ? (
            <div className="px-6 py-4 space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1.5" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : payoutMethods.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <FaUniversity className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400 text-sm mb-3">No bank accounts saved yet.</p>
              <Link href="/account/withdraw">
                <Button variant="secondary" size="sm">Add Bank Account</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {payoutMethods.map((method) => (
                <div key={method.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      method.type === 'card'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {method.type === 'card' ? <FaCreditCard className="w-4 h-4" /> : <FaUniversity className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">
                        {method.bankAccount?.bankName || (method.card ? 'Debit Card' : 'Payment Method')}
                        {method.id === user.defaultPayoutMethodId && (
                          <span className="ml-2 text-xs text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">Default</span>
                        )}
                      </p>
                      <p className="text-gray-400 text-xs font-mono">
                        ****{method.bankAccount?.last4 || method.card?.last4}
                        {method.bankAccount?.country && (
                          <span className="ml-2 uppercase">{method.bankAccount.country}</span>
                        )}
                        {method.card && (
                          <span className="ml-2">{method.card.expMonth}/{method.card.expYear}</span>
                        )}
                      </p>
                      <div className="flex gap-1.5 mt-1">
                        {method.availablePayoutSpeeds.map((speed) => (
                          <span
                            key={speed}
                            className={`text-xs px-1.5 py-0.5 rounded ${
                              speed === 'instant'
                                ? 'text-yellow-300 bg-yellow-500/10'
                                : 'text-gray-400 bg-white/5'
                            }`}
                          >
                            {speed === 'instant' ? 'Instant' : 'Standard'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {method.id !== user.defaultPayoutMethodId && (
                    <button
                      onClick={() => updateUser({ defaultPayoutMethodId: method.id })}
                      className="text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 rounded transition-colors"
                    >
                      Set as default
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Withdrawals */}
      {user?.recipientId && (
        <div className="bg-[#0f3460] rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-white font-bold">Withdrawals</h2>
            <Link href="/account/withdraw" className="text-xs text-green-400 hover:text-green-300 transition-colors">
              New withdrawal
            </Link>
          </div>
          {loadingPayments ? (
            <div className="px-6 py-4 space-y-4">
              {[1, 2].map((i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-16 rounded" />
                  </div>
                  <Skeleton className="h-3 w-40" />
                </div>
              ))}
            </div>
          ) : outboundPayments.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <FaArrowUp className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No withdrawals yet.</p>
              <p className="text-gray-600 text-xs mt-1">Withdrawals will appear here once you make one.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {outboundPayments.map((payment) => {
                const methodInfo = payoutMethods.find((m) => m.id === payment.payoutMethodId);
                return (
                  <div key={payment.id} className="px-6 py-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-white font-bold text-lg">
                          {payment.amount.currency.toUpperCase()} {(payment.amount.value / 100).toFixed(2)}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {methodInfo?.bankAccount
                            ? `${methodInfo.bankAccount.bankName || 'Bank Account'} ****${methodInfo.bankAccount.last4}`
                            : methodInfo?.card
                              ? `Card ****${methodInfo.card.last4}`
                              : payment.payoutMethodId}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        payment.status === 'posted'
                          ? 'text-green-400 bg-green-500/10'
                          : payment.status === 'processing'
                            ? 'text-yellow-400 bg-yellow-500/10'
                            : payment.status === 'failed'
                              ? 'text-red-400 bg-red-500/10'
                              : payment.status === 'returned'
                                ? 'text-orange-400 bg-orange-500/10'
                                : payment.status === 'canceled'
                                  ? 'text-gray-400 bg-gray-500/10'
                                  : 'text-gray-400 bg-gray-500/10'
                      }`}>
                        {payment.status}
                      </span>
                    </div>

                    {payment.expectedArrivalDate && (
                      <p className="text-gray-400 text-xs mb-3">
                        Expected arrival: <span className="text-white">{new Date(payment.expectedArrivalDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </p>
                    )}

                    {/* Trace ID & Receipt */}
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      {payment.traceId && payment.traceId.status === 'supported' && payment.traceId.value && (
                        <div className="group relative flex items-center gap-1.5 bg-[#1a1a2e] rounded px-2.5 py-1.5">
                          <span className="text-gray-400 text-xs">Trace ID:</span>
                          <span className="text-white text-xs font-mono">{payment.traceId.value}</span>
                          <FaInfoCircle className="w-3 h-3 text-gray-500" />
                          <div className="absolute bottom-full left-0 mb-1.5 hidden group-hover:block w-56 bg-gray-900 border border-white/10 rounded-lg p-2 shadow-lg z-10">
                            <p className="text-xs text-gray-300">This is the reference that will appear on your bank statement for this transaction.</p>
                          </div>
                        </div>
                      )}
                      {payment.traceId && payment.traceId.status === 'pending' && (
                        <div className="group relative flex items-center gap-1.5 bg-[#1a1a2e] rounded px-2.5 py-1.5">
                          <span className="text-gray-400 text-xs">Trace ID:</span>
                          <span className="text-yellow-400 text-xs">Pending</span>
                          <FaInfoCircle className="w-3 h-3 text-gray-500" />
                          <div className="absolute bottom-full left-0 mb-1.5 hidden group-hover:block w-56 bg-gray-900 border border-white/10 rounded-lg p-2 shadow-lg z-10">
                            <p className="text-xs text-gray-300">Once available, this will be the reference you see on your bank statement.</p>
                          </div>
                        </div>
                      )}
                      {payment.receiptUrl && (
                        <a
                          href={payment.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 bg-green-500/10 hover:bg-green-500/20 rounded px-2.5 py-1.5 transition-colors"
                        >
                          <FaExternalLinkAlt className="w-3 h-3" />
                          View Receipt
                        </a>
                      )}
                    </div>

                    {/* Status Timeline */}
                    <div className="relative pl-4 border-l border-white/10 space-y-2">
                      <TimelineEvent
                        label="Created"
                        timestamp={payment.created}
                        active={true}
                      />
                      {payment.statusTransitions?.posted_at && (
                        <TimelineEvent
                          label="Posted"
                          timestamp={payment.statusTransitions.posted_at}
                          active={true}
                          variant="success"
                        />
                      )}
                      {payment.statusTransitions?.failed_at && (
                        <TimelineEvent
                          label="Failed"
                          timestamp={payment.statusTransitions.failed_at}
                          active={true}
                          variant="error"
                        />
                      )}
                      {payment.statusTransitions?.returned_at && (
                        <TimelineEvent
                          label="Returned"
                          timestamp={payment.statusTransitions.returned_at}
                          active={true}
                          variant="warning"
                        />
                      )}
                      {payment.statusTransitions?.canceled_at && (
                        <TimelineEvent
                          label="Canceled"
                          timestamp={payment.statusTransitions.canceled_at}
                          active={true}
                          variant="muted"
                        />
                      )}
                      {payment.status === 'processing' && (
                        <TimelineEvent
                          label="In transit"
                          active={false}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-[#0f3460] rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-white font-bold">Transaction History</h2>
        </div>
        {loadingTransactions ? (
          <div className="px-6 py-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-40 mb-1.5" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <FaMinus className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No transactions yet.</p>
            <p className="text-gray-600 text-xs mt-1">Deposits, bets, and winnings will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {transactions.map((txn) => (
              <div key={txn.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      txn.type === 'deposit'
                        ? 'bg-green-500/20 text-green-400'
                        : txn.type === 'winning'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : txn.type === 'withdrawal'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {txn.type === 'deposit'
                      ? <FaArrowDown className="w-4 h-4" />
                      : txn.type === 'winning'
                        ? <FaStar className="w-4 h-4" />
                        : txn.type === 'withdrawal'
                          ? <FaArrowUp className="w-4 h-4" />
                          : <FaMinus className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-white text-sm">{txn.description}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(txn.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-bold ${
                    txn.amount > 0 ? 'text-green-400' : 'text-white'
                  }`}
                >
                  {txn.amount > 0 ? '+' : ''}{currencySymbol}{Math.abs(txn.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
