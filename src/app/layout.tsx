import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { BetProvider } from '@/lib/bet-context';
import { SettingsProvider } from '@/lib/settings-context';
import { Header } from '@/components/betting/Header';
import { AdminPanel } from '@/components/ui/AdminPanel';
import { LoginModal } from '@/components/ui/LoginModal';
import { DynamicFavicon } from '@/components/ui/DynamicFavicon';
import { MobileBetSlip } from '@/components/betting/MobileBetSlip';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Paddy Power | Bet on Sports',
  description: 'Paddy Power - Stripe Demo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable}`}>
      <body className="bg-[#1a1a2e] text-white min-h-full flex flex-col font-[family-name:var(--font-inter)]">
        <SettingsProvider>
          <BetProvider>
            <DynamicFavicon />
            <Header />
            <main className="flex-1">{children}</main>
            <LoginModal />
            <MobileBetSlip />
            <AdminPanel />
          </BetProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
