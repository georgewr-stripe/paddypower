'use client';

import { useState, useCallback } from 'react';
import { useBet } from '@/lib/bet-context';
import { stripePromise } from '@/lib/stripe-client';
import { Button } from '@/components/ui/Button';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { Elements, AddressElement, useElements } from '@stripe/react-stripe-js';
import type { StripeAddressElementChangeEvent } from '@stripe/stripe-js';
import { Check, Loader2 } from 'lucide-react';

type Step = 'details' | 'creating' | 'identity' | 'complete';

interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  address: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  } | null;
}

const TEST_PREFILL: PersonalDetails = {
  firstName: 'Jenny',
  lastName: 'Rosen',
  email: 'jenny.rosen@example.com',
  phone: '+447911123456',
  dob: '1990-01-15',
  address: {
    line1: '27 Fredrick Ave',
    line2: null,
    city: 'London',
    state: '',
    postal_code: 'SW1A 1AA',
    country: 'GB',
  },
};

function PersonalDetailsForm({
  onSubmit,
  initialValues,
}: {
  onSubmit: (details: PersonalDetails) => void;
  initialValues: PersonalDetails;
}) {
  const elements = useElements();
  const [form, setForm] = useState(initialValues);
  const [addressComplete, setAddressComplete] = useState(!!initialValues.address);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [prefilled, setPrefilled] = useState(false);
  const [addressKey, setAddressKey] = useState(0);

  const handleAddressChange = useCallback((event: StripeAddressElementChangeEvent) => {
    setAddressComplete(event.complete);
    setForm((prev) => ({
      ...prev,
      firstName: event.value.firstName || prev.firstName,
      lastName: event.value.lastName || prev.lastName,
      phone: event.value.phone || prev.phone,
      address: event.value.address,
    }));
    if (event.complete) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.address;
        return next;
      });
    }
  }, []);

  const handlePrefill = () => {
    setForm(TEST_PREFILL);
    setPrefilled(true);
    setAddressComplete(true);
    setAddressKey((k) => k + 1);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.dob) newErrors.dob = 'Date of birth is required';
    else {
      const birthDate = new Date(form.dob);
      const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 18) newErrors.dob = 'You must be at least 18 years old';
    }
    if (!addressComplete && !prefilled) newErrors.address = 'Please complete all name and address fields';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (elements && !prefilled) {
      const addressElement = elements.getElement('address');
      if (addressElement) {
        const { complete, value } = await addressElement.getValue();
        if (complete) {
          onSubmit({
            ...form,
            firstName: value.firstName || form.firstName,
            lastName: value.lastName || form.lastName,
            phone: value.phone || form.phone,
            address: value.address,
          });
          return;
        }
      }
    }

    onSubmit(form);
  };

  const inputClass =
    'w-full bg-[#1a1a2e] border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-gray-400 text-xs block mb-1">Email</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
            if (errors.email) setErrors({ ...errors, email: '' });
          }}
          className={`${inputClass} ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="text-gray-400 text-xs block mb-1">Date of Birth</label>
        <input
          type="date"
          required
          autoComplete="bday"
          value={form.dob}
          onChange={(e) => {
            setForm({ ...form, dob: e.target.value });
            if (errors.dob) setErrors({ ...errors, dob: '' });
          }}
          className={`${inputClass} ${errors.dob ? 'border-red-500' : ''}`}
        />
        {errors.dob && <p className="text-red-400 text-xs mt-1">{errors.dob}</p>}
      </div>

      <div>
        <AddressElement
          key={addressKey}
          options={{
            mode: 'billing',
            display: { name: 'split' },
            fields: { phone: 'always' },
            validation: { phone: { required: 'always' } },
            defaultValues: {
              firstName: prefilled ? form.firstName : undefined,
              lastName: prefilled ? form.lastName : undefined,
              phone: prefilled ? form.phone : undefined,
              address: prefilled && form.address ? {
                line1: form.address.line1,
                line2: form.address.line2,
                city: form.address.city,
                state: form.address.state,
                postal_code: form.address.postal_code,
                country: form.address.country,
              } : { country: 'GB' },
            },
          }}
          onChange={handleAddressChange}
        />
        {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
      </div>

      <Button type="submit" variant="secondary" fullWidth size="lg">
        Create Account
      </Button>

      <button
        type="button"
        onClick={handlePrefill}
        className="w-full text-xs bg-purple-600/20 text-purple-300 border border-purple-500/30 px-3 py-2 rounded hover:bg-purple-600/30 transition-colors"
      >
        Pre-fill with test data (Jenny Rosen)
      </button>
    </form>
  );
}

export default function WizardOnboardingPage() {
  const [step, setStep] = useState<Step>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useBet();
  const [details, setDetails] = useState<PersonalDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    address: null,
  });

  const handleDetailsSubmit = async (submittedDetails: PersonalDetails) => {
    setDetails(submittedDetails);
    setStep('creating');
    setError('');

    try {
      // Create/fetch customer via login (sets context state + localStorage)
      await login(submittedDetails.email);

      // Read customerId from localStorage since state may not be committed yet
      const stored = localStorage.getItem('pp-demo-user');
      const customerId = stored ? JSON.parse(stored).customerId : undefined;

      if (!customerId) {
        setError('Failed to create customer account.');
        setStep('details');
        return;
      }

      // Mark customer as verified and set name on Stripe
      await fetch('/api/stripe/verify-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          name: `${submittedDetails.firstName} ${submittedDetails.lastName}`,
        }),
      });

      // Create v2 recipient account
      const [year, month, day] = submittedDetails.dob.split('-').map(Number);
      const recipientRes = await fetch('/api/stripe/create-payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-recipient',
          recipientName: `${submittedDetails.firstName} ${submittedDetails.lastName}`,
          recipientEmail: submittedDetails.email,
          country: submittedDetails.address?.country?.toLowerCase() || 'gb',
          customerId,
          dateOfBirth: { day, month, year },
          address: submittedDetails.address ? {
            line1: submittedDetails.address.line1,
            line2: submittedDetails.address.line2 || undefined,
            city: submittedDetails.address.city,
            state: submittedDetails.address.state || undefined,
            postalCode: submittedDetails.address.postal_code,
          } : undefined,
          tosAcceptedIp: '127.0.0.1',
        }),
      });

      const recipientData = await recipientRes.json();
      if (!recipientRes.ok) {
        setError(recipientData.error || 'Failed to create recipient account.');
        setStep('details');
        return;
      }

      // Re-fetch customer from Stripe to get updated state (recipientId, verified, name)
      await login(submittedDetails.email);

      setStep('identity');
    } catch {
      setError('Something went wrong creating your account. Please try again.');
      setStep('details');
    }
  };

  const handleStartIdentity = async () => {
    setLoading(true);
    setError('');
    try {
      const stored = localStorage.getItem('pp-demo-user');
      const customerId = stored ? JSON.parse(stored).customerId : undefined;

      const res = await fetch('/api/stripe/create-identity-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: details.email,
          customerId,
          flow: 'onboarding-wizard',
        }),
      });
      const data = await res.json();

      const stripe = await stripePromise;
      if (!stripe) {
        setError('Stripe failed to load');
        return;
      }

      const result = await stripe.verifyIdentity(data.clientSecret);

      if (result.error) {
        setError(result.error.message || 'Verification failed');
      } else {
        setStep('complete');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const wizardSteps = ['Details', 'Setup', 'Verify', 'Done'];
  const stepIndex = step === 'details' ? 0 : step === 'creating' ? 1 : step === 'identity' ? 2 : 3;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">Create Your Account</h1>
      <p className="text-gray-400 text-sm mb-6">Get set up in a couple of minutes.</p>

      <StepIndicator steps={wizardSteps} currentStep={stepIndex} />

      {/* Step: Personal Details */}
      {step === 'details' && (
        <div className="bg-[#0f3460] rounded-lg p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          <Elements stripe={stripePromise} options={{
            appearance: {
              theme: 'night',
              variables: {
                colorPrimary: '#22c55e',
                colorBackground: '#1a1a2e',
                colorText: '#ffffff',
                colorTextSecondary: '#9ca3af',
                colorTextPlaceholder: '#6b7280',
                borderRadius: '4px',
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontSizeBase: '14px',
                spacingUnit: '4px',
                colorDanger: '#f87171',
              },
              rules: {
                '.Input': {
                  backgroundColor: '#1a1a2e',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: '#ffffff',
                  boxShadow: 'none',
                },
                '.Input:focus': {
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 0 0 2px #22c55e',
                },
                '.Label': {
                  color: '#9ca3af',
                  fontSize: '12px',
                  fontWeight: '400',
                  marginBottom: '4px',
                },
                '.Block': {
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '0',
                },
              },
            },
          }}>
            <PersonalDetailsForm onSubmit={handleDetailsSubmit} initialValues={details} />
          </Elements>
        </div>
      )}

      {/* Step: Creating Account */}
      {step === 'creating' && (
        <div className="bg-[#0f3460] rounded-lg p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-white" />
          <p className="text-white font-semibold">Setting up your account...</p>
          <p className="text-gray-400 text-sm mt-2">This only takes a moment.</p>
        </div>
      )}

      {/* Step: Identity Verification (optional) */}
      {step === 'identity' && (
        <div className="bg-[#0f3460] rounded-lg p-6">
          <div className="text-center mb-6">
            <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-white font-semibold">Account created successfully</p>
          </div>

          <div className="border-t border-white/10 pt-6">
            <h2 className="text-white font-bold text-lg mb-2">Verify Your Identity</h2>
            <p className="text-gray-400 text-sm mb-4">
              Complete ID verification now for faster withdrawals, or do it later from your account settings.
            </p>

            <div className="bg-[#1a1a2e] rounded-lg p-4 mb-6">
              <div className="space-y-2 text-sm text-gray-300">
                <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Government-issued photo ID (passport, driving licence)</p>
                <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Live selfie for facial matching</p>
                <p className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Takes less than 2 minutes</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded p-3 mb-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              variant="secondary"
              fullWidth
              size="lg"
              onClick={handleStartIdentity}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Now'}
            </Button>

            <button
              onClick={() => setStep('complete')}
              className="w-full mt-3 text-gray-400 text-sm hover:text-white transition-colors text-center py-2"
            >
              I&apos;ll do this later
            </button>
          </div>
        </div>
      )}

      {/* Step: Complete */}
      {step === 'complete' && (
        <div className="bg-[#0f3460] rounded-lg p-8 text-center">
          <Check className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">You&apos;re all set!</h2>
          <p className="text-gray-400 mb-6">
            Your account is ready. Make a deposit to start betting.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => (window.location.href = '/account/deposit')}>
              Make First Deposit
            </Button>
            <Button variant="primary" onClick={() => (window.location.href = '/')}>
              Start Betting
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
