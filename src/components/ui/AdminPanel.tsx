'use client';

import { useSettings, CURRENCY_CONFIG, Currency } from '@/lib/settings-context';
import { useEffect } from 'react';

export function AdminPanel() {
  const { settings, updateCurrency, updateBranding, loadStripeBranding, adminOpen, setAdminOpen } = useSettings();

  useEffect(() => {
    if (adminOpen && !settings.stripeBrandingLoaded) {
      loadStripeBranding();
    }
  }, [adminOpen, settings.stripeBrandingLoaded, loadStripeBranding]);

  return (
    <>
      {/* Floating Stripe Button */}
      <button
        onClick={() => setAdminOpen(true)}
        className="fixed bottom-6 left-6 w-12 h-12 bg-[#635BFF] hover:bg-[#5851DB] rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
        title="Admin Settings"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 16.176.332 13.976.332 9.329.332 6.187 2.806 6.187 6.582c0 3.263 2.227 4.678 5.404 5.986 2.172.89 3.263 1.541 3.263 2.586 0 .89-.742 1.452-2.145 1.452-2.227 0-5.07-1.067-6.987-2.172l-.89 5.494c1.783.95 4.515 1.742 7.094 1.742 4.831 0 8.094-2.381 8.094-6.345.015-3.543-2.227-4.831-5.549-6.175z"
            fill="white"
          />
        </svg>
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ${
          adminOpen ? 'bg-black/60 backdrop-blur-sm pointer-events-auto' : 'bg-transparent pointer-events-none'
        }`}
        onClick={() => setAdminOpen(false)}
      />

      {/* Slide-out Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-[#0a0a0a] border-r border-white/10 z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          adminOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#635BFF] rounded flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 16.176.332 13.976.332 9.329.332 6.187 2.806 6.187 6.582c0 3.263 2.227 4.678 5.404 5.986 2.172.89 3.263 1.541 3.263 2.586 0 .89-.742 1.452-2.145 1.452-2.227 0-5.07-1.067-6.987-2.172l-.89 5.494c1.783.95 4.515 1.742 7.094 1.742 4.831 0 8.094-2.381 8.094-6.345.015-3.543-2.227-4.831-5.549-6.175z"
                    fill="white"
                  />
                </svg>
              </div>
              <span className="text-white font-bold text-sm">Demo Admin</span>
            </div>
            <button
              onClick={() => setAdminOpen(false)}
              className="text-gray-400 hover:text-white text-xl transition-colors"
            >
              &times;
            </button>
          </div>

          {/* Currency */}
          <section className="mb-8">
            <h3 className="text-gray-400 text-xs uppercase font-semibold mb-3 tracking-wider">Currency</h3>
            <div className="space-y-1">
              {(Object.keys(CURRENCY_CONFIG) as Currency[]).map((key) => (
                <button
                  key={key}
                  onClick={() => updateCurrency(key)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-all duration-200 ${
                    settings.currency === key
                      ? 'bg-[#635BFF] text-white'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <span>{CURRENCY_CONFIG[key].name}</span>
                  <span className="font-mono">{CURRENCY_CONFIG[key].symbol} {CURRENCY_CONFIG[key].code}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Branding */}
          <section className="mb-8">
            <h3 className="text-gray-400 text-xs uppercase font-semibold mb-3 tracking-wider">Branding</h3>

            {settings.stripeBrandingLoaded && (
              <div className="bg-green-500/10 border border-green-500/30 rounded p-2 mb-3">
                <p className="text-green-400 text-xs">Loaded from Stripe Dashboard</p>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-xs block mb-1">Business Name</label>
                <input
                  type="text"
                  value={settings.branding.name}
                  onChange={(e) => updateBranding({ name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs block mb-1">Primary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.branding.primaryColor}
                    onChange={(e) => updateBranding({ primaryColor: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={settings.branding.primaryColor}
                    onChange={(e) => updateBranding({ primaryColor: e.target.value })}
                    className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-xs block mb-1">Secondary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.branding.secondaryColor}
                    onChange={(e) => updateBranding({ secondaryColor: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={settings.branding.secondaryColor}
                    onChange={(e) => updateBranding({ secondaryColor: e.target.value })}
                    className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-xs block mb-1">Logo URL</label>
                <input
                  type="text"
                  value={settings.branding.logoUrl}
                  onChange={(e) => updateBranding({ logoUrl: e.target.value })}
                  placeholder="From Stripe Dashboard or custom URL"
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
                />
              </div>

              {settings.branding.logoUrl && (
                <div className="bg-white/5 rounded p-3 flex items-center justify-center">
                  <img
                    src={settings.branding.logoUrl}
                    alt="Logo preview"
                    className="max-h-12 object-contain"
                  />
                </div>
              )}

              <button
                onClick={loadStripeBranding}
                className="w-full py-2 px-3 bg-[#635BFF]/20 hover:bg-[#635BFF]/30 text-[#635BFF] rounded text-sm font-semibold transition-colors"
              >
                Reload from Stripe Dashboard
              </button>
            </div>
          </section>

          {/* Info */}
          <section className="mb-8">
            <h3 className="text-gray-400 text-xs uppercase font-semibold mb-3 tracking-wider">Stripe Products</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                Payments (Payment Element)
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                Global Payouts
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                Identity (KYC)
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                Radar (Fraud)
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                Financial Connections
              </div>
            </div>
          </section>

          {/* Reset */}
          <button
            onClick={() => {
              localStorage.removeItem('pp-demo-settings');
              window.location.reload();
            }}
            className="w-full py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-sm transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </>
  );
}
