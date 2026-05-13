'use client';

import Link from 'next/link';
import { useBet } from '@/lib/bet-context';
import { useSettings } from '@/lib/settings-context';
import { Button } from '@/components/ui/Button';

export function Header() {
  const { balance, isLoggedIn, user, logout, setShowLoginModal } = useBet();
  const { settings, currencySymbol } = useSettings();
  const { branding } = settings;

  return (
    <header className="bg-[#0d1b2a]/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt={branding.name} className="h-8 object-contain" />
            ) : (
              <div className="rounded-lg px-3 py-1" style={{ backgroundColor: branding.primaryColor }}>
                <span className="text-white font-black text-xl tracking-tight">
                  {branding.name.split(' ')[0]?.toUpperCase() || 'PADDY'}
                </span>
                <span style={{ color: branding.secondaryColor }} className="font-black text-xl tracking-tight">
                  {branding.name.split(' ').slice(1).join(' ').toUpperCase() || 'POWER'}
                </span>
              </div>
            )}
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-white text-sm font-semibold hover:text-green-400 transition-colors">
              Sports
            </Link>
            <Link href="/" className="text-gray-400 text-sm font-semibold hover:text-green-400 transition-colors">
              In-Play
            </Link>
            {isLoggedIn && (
              <>
                <Link href="/account" className="text-gray-400 text-sm font-semibold hover:text-green-400 transition-colors">
                  My Account
                </Link>
                <Link href="/account/deposit" className="text-gray-400 text-sm font-semibold hover:text-green-400 transition-colors">
                  Deposit
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <div className="text-right mr-2">
                <p className="text-xs text-gray-400 truncate max-w-[120px]">{user?.email}</p>
                <p className="text-white font-bold">{currencySymbol}{balance.toFixed(2)}</p>
              </div>
              <Link href="/account/deposit">
                <Button variant="primary" size="sm">Deposit</Button>
              </Link>
              <button
                onClick={logout}
                className="text-gray-400 text-sm hover:text-white"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-white text-sm font-semibold hover:text-green-400"
              >
                Log In
              </button>
              <Link href="/onboarding">
                <Button variant="secondary" size="sm">Join Now</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
