'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaLock } from 'react-icons/fa';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError('Incorrect password');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600/20 mb-4">
            <FaLock className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Paddy Power Demo</h1>
          <p className="text-gray-400 text-sm mt-1">Enter the password to access this demo</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0f3460] rounded-lg p-6 border border-white/5">
          <div className="mb-4">
            <label htmlFor="password" className="text-gray-400 text-xs block mb-1.5">
              Demo Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter password"
              autoFocus
              className={`w-full bg-[#1a1a2e] border rounded px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                error ? 'border-red-500' : 'border-white/10'
              }`}
            />
            {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded transition-colors"
          >
            {loading ? 'Checking...' : 'Enter Demo'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-4">
          Powered by Stripe
        </p>
      </div>
    </div>
  );
}
