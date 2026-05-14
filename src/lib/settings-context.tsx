'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'gbp' | 'eur' | 'usd' | 'aud' | 'cad';

export type Branding = {
  name: string;
  logoUrl: string;
  iconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
};

export type Settings = {
  currency: Currency;
  branding: Branding;
  stripeBrandingLoaded: boolean;
};

const DEFAULT_BRANDING: Branding = {
  name: 'Paddy Power',
  logoUrl: '',
  iconUrl: '',
  primaryColor: '#04B431',
  secondaryColor: '#FFD700',
  backgroundColor: '#1a1a2e',
};

const DEFAULT_SETTINGS: Settings = {
  currency: 'gbp',
  branding: DEFAULT_BRANDING,
  stripeBrandingLoaded: false,
};

export const CURRENCY_CONFIG: Record<Currency, { symbol: string; code: string; name: string }> = {
  gbp: { symbol: '£', code: 'GBP', name: 'British Pound' },
  eur: { symbol: '€', code: 'EUR', name: 'Euro' },
  usd: { symbol: '$', code: 'USD', name: 'US Dollar' },
  aud: { symbol: 'A$', code: 'AUD', name: 'Australian Dollar' },
  cad: { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar' },
};

type SettingsContextType = {
  settings: Settings;
  updateCurrency: (currency: Currency) => void;
  updateBranding: (branding: Partial<Branding>) => void;
  loadStripeBranding: () => Promise<void>;
  currencySymbol: string;
  currencyCode: string;
  adminOpen: boolean;
  setAdminOpen: (open: boolean) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [adminOpen, setAdminOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('pp-demo-settings');
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
    setHydrated(true);

    fetch('/api/stripe/branding')
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data) {
          setSettings((prev) => ({
            ...prev,
            branding: { ...prev.branding, ...data },
            stripeBrandingLoaded: true,
          }));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('pp-demo-settings', JSON.stringify(settings));
    }
  }, [settings, hydrated]);

  const updateCurrency = (currency: Currency) => {
    setSettings((prev) => ({ ...prev, currency }));
  };

  const updateBranding = (branding: Partial<Branding>) => {
    setSettings((prev) => ({
      ...prev,
      branding: { ...prev.branding, ...branding },
    }));
  };

  const loadStripeBranding = async () => {
    try {
      const res = await fetch('/api/stripe/branding');
      if (res.ok) {
        const data = await res.json();
        setSettings((prev) => ({
          ...prev,
          branding: { ...prev.branding, ...data },
          stripeBrandingLoaded: true,
        }));
      }
    } catch {
      // fallback to defaults
    }
  };

  const currencySymbol = CURRENCY_CONFIG[settings.currency].symbol;
  const currencyCode = CURRENCY_CONFIG[settings.currency].code;

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateCurrency,
        updateBranding,
        loadStripeBranding,
        currencySymbol,
        currencyCode,
        adminOpen,
        setAdminOpen,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
}
