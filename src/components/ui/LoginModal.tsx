'use client';

import { useState } from 'react';
import { useBet } from '@/lib/bet-context';
import { Button } from './Button';

export function LoginModal() {
  const { showLoginModal, setShowLoginModal, login } = useBet();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!showLoginModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      await login(email);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-50"
        onClick={() => setShowLoginModal(false)}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#0f3460] rounded-lg p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold text-lg">Log In</h2>
            <button
              onClick={() => setShowLoginModal(false)}
              className="text-gray-400 hover:text-white text-xl"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs block mb-1">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-[#1a1a2e] border border-white/10 rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs block mb-1">Password</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter any password"
                className="w-full bg-[#1a1a2e] border border-white/10 rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-gray-500 text-xs mt-1">Demo mode — any password works</p>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <Button
              type="submit"
              variant="secondary"
              fullWidth
              size="lg"
              disabled={loading || !email}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-500 text-xs">
              Don&apos;t have an account?{' '}
              <a
                href="/onboarding"
                className="text-green-400 hover:underline"
                onClick={() => setShowLoginModal(false)}
              >
                Join Now
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
