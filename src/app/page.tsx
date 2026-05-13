'use client';

import { useState } from 'react';
import { events } from '@/lib/mock-data';
import { useSettings } from '@/lib/settings-context';
import { SportNav } from '@/components/betting/SportNav';
import { EventCard } from '@/components/betting/EventCard';
import { BetSlip } from '@/components/betting/BetSlip';

export default function HomePage() {
  const { currencySymbol } = useSettings();
  const [activeSport, setActiveSport] = useState('all');

  const filteredEvents =
    activeSport === 'all'
      ? events
      : events.filter((e) => e.sport === activeSport);

  const liveEvents = filteredEvents.filter((e) => e.isLive);
  const upcomingEvents = filteredEvents.filter((e) => !e.isLive);

  return (
    <div>
      <SportNav activeSport={activeSport} onSportChange={setActiveSport} />

      {/* Promo Banner */}
      <div className="relative bg-gradient-to-r from-green-700 via-green-800 to-green-900 py-5 px-6 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.05),transparent_60%)]" />
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
          <div>
            <p className="text-yellow-400 font-black text-lg tracking-wide">NEW CUSTOMER OFFER</p>
            <p className="text-white text-2xl font-black">
              BET {currencySymbol}5 GET {currencySymbol}40 IN FREE BETS
            </p>
          </div>
          <button
            onClick={() => (window.location.href = '/onboarding/wizard')}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded shadow-lg transition-colors"
          >
            Join Now
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {liveEvents.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <h2 className="text-white font-bold text-lg">Live Now</h2>
              </div>
              <div className="grid gap-3">
                {liveEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-white font-bold text-lg mb-4">
              {activeSport === 'all' ? 'Popular Events' : 'Upcoming'}
            </h2>
            <div className="grid gap-3">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        </div>

        {/* Bet Slip Sidebar */}
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-4">
            <BetSlip />
          </div>
        </aside>
      </div>
    </div>
  );
}
