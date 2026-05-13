'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BetSlipItem } from './mock-data';

export type User = {
  email: string;
  customerId: string;
  name?: string;
  recipientId?: string;
  verified?: boolean;
  defaultPayoutMethodId?: string;
};

type BetContextType = {
  betSlip: BetSlipItem[];
  addBet: (bet: BetSlipItem) => void;
  removeBet: (eventId: string, selection: string) => void;
  clearSlip: () => void;
  stake: number;
  setStake: (stake: number) => void;
  balance: number;
  setBalance: (balance: number) => void;
  isLoggedIn: boolean;
  user: User | null;
  updateUser: (updates: Partial<User>) => void;
  login: (email: string) => Promise<void>;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (v: boolean) => void;
};

const BetContext = createContext<BetContextType | undefined>(undefined);

export function BetProvider({ children }: { children: ReactNode }) {
  const [betSlip, setBetSlip] = useState<BetSlipItem[]>([]);
  const [stake, setStake] = useState(0);
  const [balance, setBalance] = useState(129.0);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('pp-demo-user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      const base = prev || (() => {
        try {
          const stored = localStorage.getItem('pp-demo-user');
          return stored ? JSON.parse(stored) : null;
        } catch { return null; }
      })();
      if (!base) return prev;
      const updated = { ...base, ...updates };
      localStorage.setItem('pp-demo-user', JSON.stringify(updated));
      return updated;
    });
  };

  const login = async (email: string) => {
    const res = await fetch('/api/stripe/customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) throw new Error('Login failed');

    const data = await res.json();
    const newUser: User = {
      email: data.email,
      customerId: data.id,
      name: data.name || undefined,
      recipientId: data.recipientId || undefined,
      verified: data.verified || false,
    };
    setUser(newUser);
    localStorage.setItem('pp-demo-user', JSON.stringify(newUser));
    setShowLoginModal(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pp-demo-user');
  };

  const addBet = (bet: BetSlipItem) => {
    setBetSlip((prev) => {
      const exists = prev.find(
        (b) => b.eventId === bet.eventId && b.selection === bet.selection
      );
      if (exists) return prev;
      return [...prev, bet];
    });
  };

  const removeBet = (eventId: string, selection: string) => {
    setBetSlip((prev) =>
      prev.filter((b) => !(b.eventId === eventId && b.selection === selection))
    );
  };

  const clearSlip = () => {
    setBetSlip([]);
    setStake(0);
  };

  return (
    <BetContext.Provider
      value={{
        betSlip,
        addBet,
        removeBet,
        clearSlip,
        stake,
        setStake,
        balance,
        setBalance,
        isLoggedIn: !!user,
        user,
        updateUser,
        login,
        logout,
        showLoginModal,
        setShowLoginModal,
      }}
    >
      {children}
    </BetContext.Provider>
  );
}

export function useBet() {
  const context = useContext(BetContext);
  if (!context) throw new Error('useBet must be used within BetProvider');
  return context;
}
