'use client';

import { use } from 'react';
import { events } from '@/lib/mock-data';
import { OddsButton } from '@/components/betting/OddsButton';
import { BetSlip } from '@/components/betting/BetSlip';
import Link from 'next/link';

export default function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const event = events.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-white text-xl">Event not found</h1>
        <Link href="/" className="text-green-400 hover:underline mt-4 inline-block">
          Back to Sports
        </Link>
      </div>
    );
  }

  const eventName = event.awayTeam
    ? `${event.homeTeam} vs ${event.awayTeam}`
    : event.homeTeam;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
      <div className="flex-1">
        {/* Event Header */}
        <div className="bg-[#0f3460] rounded-lg p-6 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/" className="text-green-400 text-sm hover:underline">
              Sports
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-400 text-sm">{event.league}</span>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-white text-2xl font-bold">{eventName}</h1>
            {event.isLive && (
              <span className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded animate-pulse">
                LIVE
              </span>
            )}
          </div>
        </div>

        {/* Match Result Market */}
        {event.awayTeam && event.odds.home > 0 && (
          <div className="bg-[#0f3460] rounded-lg p-4 mb-4">
            <h3 className="text-white font-semibold mb-3">Match Result</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-gray-400 text-xs mb-2">{event.homeTeam}</p>
                <OddsButton
                  eventId={event.id}
                  eventName={eventName}
                  market="Match Result"
                  selection={event.homeTeam}
                  odds={event.odds.home}
                />
              </div>
              {event.odds.draw > 0 && (
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-2">Draw</p>
                  <OddsButton
                    eventId={event.id}
                    eventName={eventName}
                    market="Match Result"
                    selection="Draw"
                    odds={event.odds.draw}
                  />
                </div>
              )}
              <div className="text-center">
                <p className="text-gray-400 text-xs mb-2">{event.awayTeam}</p>
                <OddsButton
                  eventId={event.id}
                  eventName={eventName}
                  market="Match Result"
                  selection={event.awayTeam}
                  odds={event.odds.away}
                />
              </div>
            </div>
          </div>
        )}

        {/* Additional Markets */}
        {event.markets?.map((market) => (
          <div key={market.name} className="bg-[#0f3460] rounded-lg p-4 mb-4">
            <h3 className="text-white font-semibold mb-3">{market.name}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {market.selections.map((sel) => (
                <div key={sel.name} className="text-center">
                  <p className="text-gray-400 text-xs mb-2">{sel.name}</p>
                  <OddsButton
                    eventId={event.id}
                    eventName={eventName}
                    market={market.name}
                    selection={sel.name}
                    odds={sel.odds}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bet Slip Sidebar */}
      <aside className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-4">
          <BetSlip />
        </div>
      </aside>
    </div>
  );
}
