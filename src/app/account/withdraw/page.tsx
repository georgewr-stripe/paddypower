'use client';

import { useState, useEffect, useCallback } from 'react';
import { useBet } from '@/lib/bet-context';
import { useSettings } from '@/lib/settings-context';
import { Button } from '@/components/ui/Button';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { FaArrowLeft, FaExclamationTriangle, FaClock, FaCheck, FaTimes, FaSpinner, FaBolt } from 'react-icons/fa';

const supportedCountries = [
  { code: 'gb', name: 'United Kingdom', flag: '🇬🇧', currency: 'gbp' },
  { code: 'us', name: 'United States', flag: '🇺🇸', currency: 'usd' },
  { code: 'de', name: 'Germany', flag: '🇩🇪', currency: 'eur' },
  { code: 'fr', name: 'France', flag: '🇫🇷', currency: 'eur' },
  { code: 'ie', name: 'Ireland', flag: '🇮🇪', currency: 'eur' },
  { code: 'es', name: 'Spain', flag: '🇪🇸', currency: 'eur' },
  { code: 'it', name: 'Italy', flag: '🇮🇹', currency: 'eur' },
  { code: 'nl', name: 'Netherlands', flag: '🇳🇱', currency: 'eur' },
  { code: 'au', name: 'Australia', flag: '🇦🇺', currency: 'aud' },
  { code: 'ca', name: 'Canada', flag: '🇨🇦', currency: 'cad' },
];

type Step = 'amount' | 'select-method' | 'bank-details' | 'cop-confirm' | 'confirm' | 'processing' | 'success' | 'failed';

type TestScenario = 'success' | 'no_account' | 'account_closed' | 'insufficient_funds' | 'debit_not_authorized' | 'invalid_currency';

const testScenarios: { id: TestScenario; label: string; color: string }[] = [
  { id: 'success', label: 'Success', color: 'text-green-300 bg-green-600/20 border-green-500/30' },
  { id: 'no_account', label: 'No Account', color: 'text-red-300 bg-red-600/20 border-red-500/30' },
  { id: 'account_closed', label: 'Account Closed', color: 'text-red-300 bg-red-600/20 border-red-500/30' },
  { id: 'insufficient_funds', label: 'Insufficient Funds', color: 'text-yellow-300 bg-yellow-600/20 border-yellow-500/30' },
  { id: 'debit_not_authorized', label: 'Not Authorized', color: 'text-orange-300 bg-orange-600/20 border-orange-500/30' },
  { id: 'invalid_currency', label: 'Invalid Currency', color: 'text-purple-300 bg-purple-600/20 border-purple-500/30' },
];

interface TestBankData {
  [fieldName: string]: string;
}

const testBankDataByCountry: Record<string, Record<TestScenario, TestBankData>> = {
  gb: {
    success:              { routing_number: '108800', account_number: '00012345' },
    no_account:           { routing_number: '108800', account_number: '11111116' },
    account_closed:       { routing_number: '108800', account_number: '11111113' },
    insufficient_funds:   { routing_number: '108800', account_number: '22222227' },
    debit_not_authorized: { routing_number: '108800', account_number: '33333335' },
    invalid_currency:     { routing_number: '108800', account_number: '44444440' },
  },
  us: {
    success:              { routing_number: '110000000', account_number: '000123456789' },
    no_account:           { routing_number: '110000000', account_number: '000111111116' },
    account_closed:       { routing_number: '110000000', account_number: '000111111113' },
    insufficient_funds:   { routing_number: '110000000', account_number: '000111111112' },
    debit_not_authorized: { routing_number: '110000000', account_number: '000414141416' },
    invalid_currency:     { routing_number: '110000000', account_number: '000888888883' },
  },
  de: {
    success:              { account_number: 'DE89370400440532013000' },
    no_account:           { account_number: 'DE97370400440130010130' },
    account_closed:       { account_number: 'DE48370400440130020130' },
    insufficient_funds:   { account_number: 'DE96370400440130030130' },
    debit_not_authorized: { account_number: 'DE47370400440130040130' },
    invalid_currency:     { account_number: 'DE95370400440130050130' },
  },
  fr: {
    success:              { account_number: 'FR1420041010050500013M02606' },
    no_account:           { account_number: 'FR8420041010050500013M02607' },
    account_closed:       { account_number: 'FR2720041010050130020130020' },
    insufficient_funds:   { account_number: 'FR9720041010050000002222227' },
    debit_not_authorized: { account_number: 'FR3920041010050130040130040' },
    invalid_currency:     { account_number: 'FR4520041010050130050130050' },
  },
  ie: {
    success:              { account_number: 'IE29AIBK93115212345678' },
    no_account:           { account_number: 'IE02AIBK93115212345679' },
    account_closed:       { account_number: 'IE50AIBK93115201300201' },
    insufficient_funds:   { account_number: 'IE10AIBK93115202222227' },
    debit_not_authorized: { account_number: 'IE82AIBK93115201300401' },
    invalid_currency:     { account_number: 'IE98AIBK93115201300501' },
  },
  es: {
    success:              { account_number: 'ES5720590700133000133000' },
    no_account:           { account_number: 'ES7720590700133001133001' },
    account_closed:       { account_number: 'ES9720590700133002133002' },
    insufficient_funds:   { account_number: 'ES2020590700133003133003' },
    debit_not_authorized: { account_number: 'ES4020590700133004133004' },
    invalid_currency:     { account_number: 'ES6020590700133005133005' },
  },
  it: {
    success:              { account_number: 'IT40S0542811101000000123456' },
    no_account:           { account_number: 'IT60X0542811101000000123456' },
    account_closed:       { account_number: 'IT47X0542811101013002013002' },
    insufficient_funds:   { account_number: 'IT67X0542811101013003013003' },
    debit_not_authorized: { account_number: 'IT87X0542811101013004013004' },
    invalid_currency:     { account_number: 'IT10X0542811101013005013005' },
  },
  nl: {
    success:              { account_number: 'NL39RABO0300065264' },
    no_account:           { account_number: 'NL91ABNA0417164300' },
    account_closed:       { account_number: 'NL10RABO0130020130' },
    insufficient_funds:   { account_number: 'NL03RABO1330011330' },
    debit_not_authorized: { account_number: 'NL09RABO0130040130' },
    invalid_currency:     { account_number: 'NL57RABO0130050130' },
  },
  au: {
    success:              { routing_number: '110000', account_number: '000123456' },
    no_account:           { routing_number: '110000', account_number: '111111116' },
    account_closed:       { routing_number: '110000', account_number: '111111113' },
    insufficient_funds:   { routing_number: '110000', account_number: '222222227' },
    debit_not_authorized: { routing_number: '110000', account_number: '333333335' },
    invalid_currency:     { routing_number: '110000', account_number: '444444440' },
  },
  ca: {
    success:              { routing_number: '00011000', account_number: '000123456789' },
    no_account:           { routing_number: '00011000', account_number: '000111111116' },
    account_closed:       { routing_number: '00011000', account_number: '000111111113' },
    insufficient_funds:   { routing_number: '00011000', account_number: '000222222227' },
    debit_not_authorized: { routing_number: '00011000', account_number: '000333333335' },
    invalid_currency:     { routing_number: '00011000', account_number: '000444444440' },
  },
};

interface BankAccountField {
  local_name: string;
  local_name_human: { content: string };
  stripe_name: string;
  min_length: number;
  max_length: number;
  placeholder: string;
  validation_regex: string;
  currencies?: string[];
}


export default function WithdrawPage() {
  const { balance, setBalance, user, updateUser } = useBet();
  const { currencySymbol } = useSettings();
  const [step, setStep] = useState<Step>('amount');
  const [amount, setAmount] = useState(0);
  const [country, setCountry] = useState('gb');
  const [bankFields, setBankFields] = useState<BankAccountField[]>([]);
  const [bankValues, setBankValues] = useState<Record<string, string>>({});
  const [bankFieldErrors, setBankFieldErrors] = useState<Record<string, string>>({});
  const [loadingSpec, setLoadingSpec] = useState(false);
  const [error, setError] = useState('');
  const [payoutId, setPayoutId] = useState('');
  const [showTestScenarios, setShowTestScenarios] = useState(false);
  const [existingMethods, setExistingMethods] = useState<Array<{
    id: string;
    type: string;
    availablePayoutSpeeds: string[];
    bankAccount?: { last4: string; bankName: string; country: string; supportedCurrencies: string[] };
    card?: { last4: string; expMonth: string; expYear: string };
  }>>([]);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [selectedSpeed, setSelectedSpeed] = useState<string>('standard');
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [pendingPayoutMethodId, setPendingPayoutMethodId] = useState<string | null>(null);
  const [copDetails, setCopDetails] = useState<{ matched_name?: string; result?: string; provided_name?: string; message?: string } | null>(null);

  const selectedCountry = supportedCountries.find((c) => c.code === country)!;

  const fetchBankAccountSpec = useCallback(async (countryCode: string) => {
    setLoadingSpec(true);
    try {
      const res = await fetch(`/api/stripe/bank-account-spec?countries=${countryCode.toUpperCase()}`);
      const data = await res.json();
      if (data.countries && data.countries[countryCode.toUpperCase()]) {
        const allFields: BankAccountField[] = data.countries[countryCode.toUpperCase()].fields;
        const countryCurrency = supportedCountries.find((c) => c.code === countryCode)?.currency;

        // Filter: prefer currency-specific fields; only include null-currency fields
        // if no currency-specific field exists for the same stripe_name
        const currencySpecific = allFields.filter(
          (f) => f.currencies && f.currencies.includes(countryCurrency!)
        );
        const currencySpecificNames = new Set(currencySpecific.map((f) => f.stripe_name));
        const fallbacks = allFields.filter(
          (f) => !f.currencies && !currencySpecificNames.has(f.stripe_name)
        );

        setBankFields([...currencySpecific, ...fallbacks]);
        setBankValues({});
        setBankFieldErrors({});
      } else {
        setBankFields([]);
      }
    } catch {
      setBankFields([]);
    } finally {
      setLoadingSpec(false);
    }
  }, []);

  useEffect(() => {
    if (step === 'bank-details') {
      fetchBankAccountSpec(country);
    }
  }, [step, country, fetchBankAccountSpec]);

  const handleAmountContinue = async () => {
    if (amount <= 0 || amount > balance) return;
    if (!user?.recipientId) {
      window.location.href = '/onboarding/wizard';
      return;
    }

    setLoadingMethods(true);
    try {
      const res = await fetch(`/api/stripe/payout-methods?recipientId=${user.recipientId}`);
      const data = await res.json();
      if (res.ok && data.data && data.data.length > 0) {
        setExistingMethods(data.data);
        const defaultId = user.defaultPayoutMethodId;
        const hasDefault = defaultId && data.data.some((m: { id: string }) => m.id === defaultId);
        setSelectedMethodId(hasDefault ? defaultId : data.data[0].id);
        setStep('select-method');
      } else {
        setStep('bank-details');
      }
    } catch {
      setStep('bank-details');
    } finally {
      setLoadingMethods(false);
    }
  };


  const autofillTestData = (scenario: TestScenario) => {
    const countryData = testBankDataByCountry[country];
    if (!countryData) return;
    const data = countryData[scenario];
    if (!data) return;
    setBankValues(data);
    setBankFieldErrors({});
    setShowTestScenarios(false);
  };

  const validateBankFields = (): boolean => {
    const errors: Record<string, string> = {};
    for (const field of bankFields) {
      const value = bankValues[field.stripe_name] || '';
      if (value.length < field.min_length) {
        errors[field.stripe_name] = `Minimum ${field.min_length} characters`;
      } else if (value.length > field.max_length) {
        errors[field.stripe_name] = `Maximum ${field.max_length} characters`;
      } else if (field.validation_regex) {
        try {
          // Stripe returns Ruby-style regex — strip (?-mix:...) wrapper and \A/\z anchors
          let pattern = field.validation_regex;
          const rubyMatch = pattern.match(/^\(\?-mix:([\s\S]*)\)$/);
          if (rubyMatch) pattern = rubyMatch[1];
          pattern = pattern.replace(/\\A/g, '^').replace(/\\z/g, '$');
          if (!new RegExp(pattern).test(value)) {
            errors[field.stripe_name] = `Invalid format`;
          }
        } catch {
          // Skip validation if regex can't be parsed
        }
      }
    }
    setBankFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBankDetailsContinue = () => {
    if (validateBankFields()) {
      setStep('confirm');
    }
  };

  const handleConfirmWithdraw = async () => {
    if (!user?.recipientId) return;
    setStep('processing');
    setError('');

    try {
      let payoutMethodIdToUse = selectedMethodId;

      // If no existing method selected, create one from bank details form
      if (!payoutMethodIdToUse) {
        const accountNumberField = bankFields.find((f) => f.stripe_name === 'account_number');
        const routingNumberField = bankFields.find((f) => f.stripe_name === 'routing_number');
        const branchNumberField = bankFields.find((f) => f.stripe_name === 'branch_number');
        const swiftCodeField = bankFields.find((f) => f.stripe_name === 'swift_code');

        const setupRes = await fetch('/api/stripe/create-payout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create-payout-method',
            recipientId: user.recipientId,
            country,
            currency: selectedCountry.currency,
            bankAccount: {
              country: country.toUpperCase(),
              currency: selectedCountry.currency,
              accountNumber: accountNumberField ? bankValues[accountNumberField.stripe_name] : '',
              ...(routingNumberField && bankValues[routingNumberField.stripe_name] && {
                routingNumber: bankValues[routingNumberField.stripe_name],
              }),
              ...(branchNumberField && bankValues[branchNumberField.stripe_name] && {
                branchNumber: bankValues[branchNumberField.stripe_name],
              }),
              ...(swiftCodeField && bankValues[swiftCodeField.stripe_name] && {
                swiftCode: bankValues[swiftCodeField.stripe_name],
              }),
            },
          }),
        });

        const setupData = await setupRes.json();
        if (!setupRes.ok) {
          setError(setupData.error || 'Failed to set up payout method');
          setStep('failed');
          return;
        }

        // Check if CoP acknowledgement is required (GB accounts)
        if (setupData.status === 'requires_action' && setupData.confirmationOfPayee) {
          setPendingPayoutMethodId(setupData.payoutMethodId);
          setCopDetails({
            matched_name: setupData.confirmationOfPayee.matchedName,
            result: setupData.confirmationOfPayee.matchResult,
            provided_name: setupData.confirmationOfPayee.providedName,
            message: setupData.confirmationOfPayee.message,
          });
          setStep('cop-confirm');
          return;
        }

        payoutMethodIdToUse = setupData.payoutMethodId;
        updateUser({ defaultPayoutMethodId: setupData.payoutMethodId });
      }

      await sendPayout(payoutMethodIdToUse!);
    } catch {
      setError('Network error. Please try again.');
      setStep('failed');
    }
  };

  const handleCopConfirm = async () => {
    if (!user?.recipientId || !pendingPayoutMethodId) return;
    setStep('processing');
    setError('');

    try {
      const ackRes = await fetch('/api/stripe/create-payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'acknowledge-cop',
          recipientId: user.recipientId,
          payoutMethodId: pendingPayoutMethodId,
        }),
      });

      const ackData = await ackRes.json();
      if (!ackRes.ok) {
        setError(ackData.error || 'Failed to confirm payee');
        setStep('failed');
        return;
      }

      updateUser({ defaultPayoutMethodId: pendingPayoutMethodId });
      await sendPayout(pendingPayoutMethodId);
    } catch {
      setError('Network error. Please try again.');
      setStep('failed');
    }
  };

  const sendPayout = async (payoutMethodIdToUse: string) => {
    const payoutRes = await fetch('/api/stripe/create-payout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'send-payout',
        recipientId: user!.recipientId,
        payoutMethodId: payoutMethodIdToUse,
        amount: Math.round(amount * 100),
        currency: selectedCountry.currency,
      }),
    });

    const payoutData = await payoutRes.json();
    if (!payoutRes.ok) {
      setError(payoutData.error || 'Payout failed');
      setStep('failed');
      return;
    }

    setPayoutId(payoutData.id);
    setBalance(balance - amount);
    setStep('success');
  };

  const inputClass =
    'w-full bg-[#1a1a2e] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-500';

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Withdraw Funds</h1>
        <div className="bg-[#0f3460] rounded-lg p-6 text-center">
          <p className="text-gray-400 mb-4">Please log in to withdraw funds.</p>
          <Button variant="secondary" onClick={() => (window.location.href = '/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const withdrawSteps = ['Amount', 'Method', 'Review', 'Done'];
  const withdrawStepIndex = step === 'amount' ? 0
    : (step === 'select-method' || step === 'bank-details') ? 1
    : (step === 'confirm' || step === 'cop-confirm') ? 2
    : 3;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Withdraw Funds</h1>

      {step !== 'processing' && step !== 'success' && step !== 'failed' && (
        <StepIndicator steps={withdrawSteps} currentStep={withdrawStepIndex} />
      )}

      {/* Step: Amount & Country */}
      {step === 'amount' && (
        <div className="bg-[#0f3460] rounded-lg p-6">
          <p className="text-gray-300 text-sm mb-4">
            Available to withdraw: <span className="text-white font-bold">{currencySymbol}{balance.toFixed(2)}</span>
          </p>

          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">{currencySymbol}</span>
            <input
              type="number"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Withdrawal amount"
              max={balance}
              className="w-full bg-[#1a1a2e] border border-white/10 rounded px-8 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-[#1a1a2e] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none mb-6"
          >
            {supportedCountries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>

          <Button
            variant="secondary"
            fullWidth
            size="lg"
            disabled={amount <= 0 || amount > balance || loadingMethods}
            onClick={handleAmountContinue}
          >
            {loadingMethods ? 'Loading...' : amount > balance ? 'Insufficient Balance' : 'Continue'}
          </Button>
        </div>
      )}


      {/* Step: Select Existing Payout Method */}
      {step === 'select-method' && (
        <div className="bg-[#0f3460] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setStep('amount')} className="text-gray-400 hover:text-white transition-colors">
              <FaArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-white font-bold">Select Payout Method</h2>
          </div>

          <div className="space-y-2 mb-6">
            {existingMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => {
                  setSelectedMethodId(method.id);
                  const speeds = method.availablePayoutSpeeds;
                  setSelectedSpeed(speeds.includes('instant') ? 'instant' : 'standard');
                }}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selectedMethodId === method.id
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-white/10 bg-[#1a1a2e] hover:border-white/20'
                }`}
              >
                {method.bankAccount && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {method.bankAccount.bankName || 'Bank Account'}
                        {method.id === user?.defaultPayoutMethodId && (
                          <span className="ml-2 text-xs text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">Default</span>
                        )}
                      </p>
                      <p className="text-gray-400 text-xs font-mono">
                        ****{method.bankAccount.last4}
                      </p>
                    </div>
                    <span className="text-gray-500 text-xs uppercase">{method.bankAccount.country}</span>
                  </div>
                )}
                {method.card && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold text-sm">
                        Debit Card
                        {method.id === user?.defaultPayoutMethodId && (
                          <span className="ml-2 text-xs text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">Default</span>
                        )}
                      </p>
                      <p className="text-gray-400 text-xs font-mono">
                        ****{method.card.last4} · {method.card.expMonth}/{method.card.expYear}
                      </p>
                    </div>
                    {method.availablePayoutSpeeds.includes('instant') && (
                      <span className="text-xs text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                        <FaBolt className="w-3 h-3" /> Instant
                      </span>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Payout Speed Selection */}
          {selectedMethodId && (() => {
            const selected = existingMethods.find((m) => m.id === selectedMethodId);
            if (!selected || selected.availablePayoutSpeeds.length <= 1) return null;
            return (
              <div className="mb-6">
                <p className="text-gray-400 text-xs uppercase mb-2">Payout Speed</p>
                <div className="grid grid-cols-2 gap-2">
                  {selected.availablePayoutSpeeds.includes('standard') && (
                    <button
                      onClick={() => setSelectedSpeed('standard')}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        selectedSpeed === 'standard'
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-white/10 bg-[#1a1a2e] hover:border-white/20'
                      }`}
                    >
                      <p className="text-white text-sm font-semibold">Standard</p>
                      <p className="text-gray-400 text-xs">1-3 business days</p>
                    </button>
                  )}
                  {selected.availablePayoutSpeeds.includes('instant') && (
                    <button
                      onClick={() => setSelectedSpeed('instant')}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        selectedSpeed === 'instant'
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-white/10 bg-[#1a1a2e] hover:border-white/20'
                      }`}
                    >
                      <p className="text-white text-sm font-semibold">Instant</p>
                      <p className="text-gray-400 text-xs">Within minutes</p>
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          <Button
            variant="secondary"
            fullWidth
            size="lg"
            disabled={!selectedMethodId}
            onClick={() => setStep('confirm')}
          >
            Continue with Selected Method
          </Button>

          <button
            onClick={() => {
              setSelectedMethodId(null);
              setStep('bank-details');
            }}
            className="w-full mt-3 text-gray-400 text-sm hover:text-white transition-colors text-center"
          >
            + Add a new bank account
          </button>
        </div>
      )}

      {/* Step: Bank Details (driven by bank account spec) */}
      {step === 'bank-details' && (
        <div className="bg-[#0f3460] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button onClick={() => setStep('amount')} className="text-gray-400 hover:text-white transition-colors">
                <FaArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-white font-bold">Bank Details ({selectedCountry.flag} {selectedCountry.name})</h2>
            </div>
            {testBankDataByCountry[country] && (
              <div className="relative">
                <button
                  onClick={() => setShowTestScenarios(!showTestScenarios)}
                  className="text-xs bg-purple-600/20 text-purple-300 border border-purple-500/30 px-2 py-1 rounded hover:bg-purple-600/30 transition-colors"
                >
                  Autofill test data
                </button>
                {showTestScenarios && (
                  <div className="absolute right-0 top-full mt-1 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-xl z-10 w-48 py-1">
                    {testScenarios.map((scenario) => (
                      <button
                        key={scenario.id}
                        onClick={() => autofillTestData(scenario.id)}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-white/5 transition-colors ${scenario.color.split(' ')[0]}`}
                      >
                        {scenario.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {loadingSpec ? (
            <div className="text-center py-8">
              <FaSpinner className="w-8 h-8 animate-spin mx-auto mb-2 text-white" />
              <p className="text-gray-400 text-sm">Loading bank account fields...</p>
            </div>
          ) : bankFields.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No bank account fields available for this country.</p>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {bankFields.map((field, idx) => (
                <div key={`${field.stripe_name}-${idx}`}>
                  <label className="text-gray-400 text-xs block mb-1">
                    {field.local_name_human.content}
                  </label>
                  <input
                    type="text"
                    value={bankValues[field.stripe_name] || ''}
                    onChange={(e) => {
                      setBankValues({ ...bankValues, [field.stripe_name]: e.target.value });
                      if (bankFieldErrors[field.stripe_name]) {
                        setBankFieldErrors({ ...bankFieldErrors, [field.stripe_name]: '' });
                      }
                    }}
                    placeholder={field.placeholder}
                    maxLength={field.max_length}
                    className={`${inputClass} ${bankFieldErrors[field.stripe_name] ? 'border-red-500' : ''}`}
                  />
                  {bankFieldErrors[field.stripe_name] && (
                    <p className="text-red-400 text-xs mt-1">{bankFieldErrors[field.stripe_name]}</p>
                  )}
                  {field.currencies && field.currencies.length > 0 && (
                    <p className="text-gray-500 text-xs mt-1">
                      Supported currencies: {field.currencies.join(', ').toUpperCase()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <Button
            variant="secondary"
            fullWidth
            size="lg"
            disabled={loadingSpec || bankFields.length === 0}
            onClick={handleBankDetailsContinue}
          >
            Review Withdrawal
          </Button>
        </div>
      )}

      {/* Step: Confirmation of Payee */}
      {step === 'cop-confirm' && (
        <div className="bg-[#0f3460] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setStep('bank-details')} className="text-gray-400 hover:text-white transition-colors">
              <FaArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-white font-bold">Confirm Payee</h2>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold text-sm mb-1">Name check result</p>
                {copDetails?.result === 'match' ? (
                  <div>
                    <p className="text-green-400 text-sm">
                      Name matches: <span className="font-semibold">{copDetails.matched_name}</span>
                    </p>
                    {copDetails.message && (
                      <p className="text-gray-400 text-xs mt-1">{copDetails.message}</p>
                    )}
                    {!copDetails.message && (
                      <p className="text-gray-400 text-xs mt-1">Please confirm to proceed with the payment.</p>
                    )}
                  </div>
                ) : copDetails?.result === 'partial_match' ? (
                  <div>
                    <p className="text-yellow-300 text-sm">Partial match</p>
                    {copDetails.matched_name && (
                      <p className="text-white text-sm mt-1">
                        Name on account: <span className="font-semibold">{copDetails.matched_name}</span>
                      </p>
                    )}
                    {copDetails.provided_name && (
                      <p className="text-gray-400 text-xs mt-1">
                        You provided: {copDetails.provided_name}
                      </p>
                    )}
                    {copDetails.message && (
                      <p className="text-gray-400 text-xs mt-2">{copDetails.message}</p>
                    )}
                  </div>
                ) : copDetails?.result === 'mismatch' ? (
                  <div>
                    <p className="text-red-400 text-sm">Name does not match</p>
                    {copDetails.matched_name && (
                      <p className="text-white text-sm mt-1">
                        Name on account: <span className="font-semibold">{copDetails.matched_name}</span>
                      </p>
                    )}
                    {copDetails.provided_name && (
                      <p className="text-gray-400 text-xs mt-1">
                        You provided: {copDetails.provided_name}
                      </p>
                    )}
                    {copDetails.message && (
                      <p className="text-gray-400 text-xs mt-2">{copDetails.message}</p>
                    )}
                    <p className="text-orange-300 text-xs mt-2">
                      You can still proceed, but funds may be sent to the wrong account.
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-300 text-sm">
                      {copDetails?.message || 'Confirmation of payee check could not be completed.'}
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                      Please confirm to proceed with the payment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a2e] rounded p-4 mb-6">
            <p className="text-gray-400 text-xs mb-1">Withdrawal amount</p>
            <p className="text-white text-lg font-bold">{currencySymbol}{amount.toFixed(2)}</p>
          </div>

          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

          <Button
            variant="secondary"
            fullWidth
            size="lg"
            onClick={handleCopConfirm}
          >
            Confirm &amp; Continue
          </Button>

          <button
            onClick={() => {
              setPendingPayoutMethodId(null);
              setCopDetails(null);
              setStep('bank-details');
            }}
            className="w-full mt-3 text-gray-400 text-sm hover:text-white transition-colors text-center py-2"
          >
            Cancel &amp; re-enter details
          </button>
        </div>
      )}

      {/* Step: Confirm */}
      {step === 'confirm' && (
        <div className="bg-[#0f3460] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setStep(selectedMethodId ? 'select-method' : 'bank-details')} className="text-gray-400 hover:text-white transition-colors">
              <FaArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-white font-bold">Confirm Withdrawal</h2>
          </div>

          <div className="space-y-3 mb-6">
            <div className="bg-[#1a1a2e] rounded p-4">
              <p className="text-gray-400 text-xs">Amount</p>
              <p className="text-white text-2xl font-black">{currencySymbol}{amount.toFixed(2)}</p>
            </div>
            <div className="bg-[#1a1a2e] rounded p-4">
              <p className="text-gray-400 text-xs">Destination</p>
              <p className="text-white font-semibold">{selectedCountry.flag} {selectedCountry.name}</p>
              {selectedMethodId ? (
                (() => {
                  const method = existingMethods.find((m) => m.id === selectedMethodId);
                  if (method?.bankAccount) {
                    return (
                      <p className="text-gray-400 text-sm">
                        {method.bankAccount.bankName || 'Bank Account'}: <span className="text-white font-mono">****{method.bankAccount.last4}</span>
                      </p>
                    );
                  }
                  if (method?.card) {
                    return (
                      <p className="text-gray-400 text-sm">
                        Debit Card: <span className="text-white font-mono">****{method.card.last4}</span>
                      </p>
                    );
                  }
                  return null;
                })()
              ) : (
                bankFields.map((field) => (
                  bankValues[field.stripe_name] && (
                    <p key={field.stripe_name} className="text-gray-400 text-sm">
                      {field.local_name_human.content}: <span className="text-white font-mono">
                        {field.stripe_name === 'account_number'
                          ? `****${bankValues[field.stripe_name].slice(-4)}`
                          : bankValues[field.stripe_name]
                        }
                      </span>
                    </p>
                  )
                ))
              )}
            </div>
            <div className="bg-[#1a1a2e] rounded p-3 flex items-center gap-2">
              <FaClock className="w-4 h-4 text-yellow-400" />
              <p className="text-gray-300 text-xs">
                Payout speed: <span className="text-white font-semibold capitalize">{selectedSpeed}</span>
                {' · '}
                {selectedSpeed === 'instant' ? 'Within minutes' : '1-3 business days'}
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            fullWidth
            size="lg"
            onClick={handleConfirmWithdraw}
          >
            Confirm &amp; Withdraw {currencySymbol}{amount.toFixed(2)}
          </Button>

          <p className="text-xs text-gray-500 text-center mt-3">
            Powered by Stripe Global Payouts
          </p>
        </div>
      )}

      {/* Step: Processing */}
      {step === 'processing' && (
        <div className="bg-[#0f3460] rounded-lg p-8 text-center">
          <FaSpinner className="w-12 h-12 animate-spin mx-auto mb-4 text-white" />
          <p className="text-white font-semibold">Processing withdrawal...</p>
          <p className="text-gray-400 text-sm mt-2">Creating payout method and sending payment via Stripe Global Payouts</p>
        </div>
      )}

      {/* Step: Success */}
      {step === 'success' && (
        <div className="bg-[#0f3460] rounded-lg p-8 text-center">
          <FaCheck className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Withdrawal Sent!</h2>
          <p className="text-gray-400 mb-2">
            {currencySymbol}{amount.toFixed(2)} is on its way to your bank account.
          </p>
          <p className="text-gray-300 text-sm">
            New balance: <span className="text-white font-bold">{currencySymbol}{balance.toFixed(2)}</span>
          </p>
          <div className="mt-6 p-3 bg-[#1a1a2e] rounded text-left">
            <p className="text-xs text-gray-400">Outbound Payment</p>
            <p className="text-xs text-gray-500 font-mono mt-1 break-all">{payoutId}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-yellow-400 text-sm font-semibold">Processing</span>
            </div>
          </div>
          <Button
            variant="primary"
            className="mt-6"
            onClick={() => (window.location.href = '/account')}
          >
            Back to Account
          </Button>
        </div>
      )}

      {/* Step: Failed */}
      {step === 'failed' && (
        <div className="bg-[#0f3460] rounded-lg p-8 text-center">
          <FaTimes className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Withdrawal Failed</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button
            variant="primary"
            className="mt-2"
            onClick={() => setStep('amount')}
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
