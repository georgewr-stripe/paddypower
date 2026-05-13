'use client';

import { Event, teamLogos } from '@/lib/mock-data';
import { OddsButton } from './OddsButton';
import Link from 'next/link';
import Image from 'next/image';

interface EventCardProps {
  event: Event;
}

function TeamLogo({ team }: { team: string }) {
  const logo = teamLogos[team];
  if (!logo) return null;
  return (
    <Image
      src={logo}
      alt={team}
      width={24}
      height={24}
      className="w-6 h-6 object-contain"
    />
  );
}

export function EventCard({ event }: EventCardProps) {
  const eventName = event.awayTeam
    ? `${event.homeTeam} vs ${event.awayTeam}`
    : event.homeTeam;

  return (
    <div className={`bg-[#0f3460] rounded-lg p-4 hover:bg-[#0f3460]/80 transition-colors border border-white/5 ${event.isLive ? 'border-l-2 border-l-red-500' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400">{event.league}</span>
        {event.isLive && (
          <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded animate-pulse">
            LIVE
          </span>
        )}
      </div>

      <Link href={`/bet/${event.id}`} className="block mb-3">
        <div className="text-white font-semibold hover:text-green-400 transition-colors">
          {event.awayTeam ? (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TeamLogo team={event.homeTeam} />
                <span>{event.homeTeam}</span>
              </div>
              <span className="text-xs text-gray-400">vs</span>
              <div className="flex items-center gap-2">
                <span>{event.awayTeam}</span>
                <TeamLogo team={event.awayTeam} />
              </div>
            </div>
          ) : (
            <span>{event.homeTeam}</span>
          )}
        </div>
      </Link>

      {event.awayTeam && event.odds.home > 0 && (
        <div className="flex gap-2 justify-between">
          <div className="flex-1 text-center">
            <div className="text-xs text-gray-400 mb-1">Home</div>
            <OddsButton
              eventId={event.id}
              eventName={eventName}
              market="Match Result"
              selection={event.homeTeam}
              odds={event.odds.home}
            />
          </div>
          {event.odds.draw > 0 && (
            <div className="flex-1 text-center">
              <div className="text-xs text-gray-400 mb-1">Draw</div>
              <OddsButton
                eventId={event.id}
                eventName={eventName}
                market="Match Result"
                selection="Draw"
                odds={event.odds.draw}
              />
            </div>
          )}
          <div className="flex-1 text-center">
            <div className="text-xs text-gray-400 mb-1">Away</div>
            <OddsButton
              eventId={event.id}
              eventName={eventName}
              market="Match Result"
              selection={event.awayTeam}
              odds={event.odds.away}
            />
          </div>
        </div>
      )}
    </div>
  );
}
