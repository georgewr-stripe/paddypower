export type Sport = {
  id: string;
  name: string;
  icon: string;
};

export type Event = {
  id: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string;
  awayLogo?: string;
  startTime: string;
  isLive: boolean;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  markets?: Market[];
};

export const teamLogos: Record<string, string> = {
  'Arsenal': '/teams/arsenal.png',
  'Manchester City': '/teams/manchester-city.png',
  'Liverpool': '/teams/liverpool.png',
  'Chelsea': '/teams/chelsea.png',
  'Manchester United': '/teams/manchester-united.png',
  'Tottenham': '/teams/tottenham.png',
  'Leeds United': '/teams/leeds-united.png',
  'Leicester City': '/teams/leicester-city.png',
  'Barcelona': '/teams/barcelona.png',
  'Real Madrid': '/teams/real-madrid.png',
};

export type Market = {
  name: string;
  selections: Selection[];
};

export type Selection = {
  name: string;
  odds: number;
};

export type BetSlipItem = {
  eventId: string;
  selection: string;
  odds: number;
  market: string;
  eventName: string;
};

export const sports: Sport[] = [
  { id: 'football', name: 'Football', icon: '⚽' },
  { id: 'horse-racing', name: 'Horse Racing', icon: '🏇' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'golf', name: 'Golf', icon: '⛳' },
  { id: 'cricket', name: 'Cricket', icon: '🏏' },
  { id: 'boxing', name: 'Boxing', icon: '🥊' },
  { id: 'darts', name: 'Darts', icon: '🎯' },
  { id: 'greyhounds', name: 'Greyhounds', icon: '🐕' },
];

export const events: Event[] = [
  {
    id: 'evt_1',
    sport: 'football',
    league: 'Premier League',
    homeTeam: 'Arsenal',
    awayTeam: 'Manchester City',
    startTime: '2024-12-15T15:00:00Z',
    isLive: true,
    odds: { home: 2.4, draw: 3.2, away: 2.8 },
    markets: [
      {
        name: 'Both Teams to Score',
        selections: [
          { name: 'Yes', odds: 1.7 },
          { name: 'No', odds: 2.1 },
        ],
      },
      {
        name: 'Over/Under 2.5 Goals',
        selections: [
          { name: 'Over 2.5', odds: 1.85 },
          { name: 'Under 2.5', odds: 1.95 },
        ],
      },
    ],
  },
  {
    id: 'evt_2',
    sport: 'football',
    league: 'Premier League',
    homeTeam: 'Liverpool',
    awayTeam: 'Chelsea',
    startTime: '2024-12-15T17:30:00Z',
    isLive: false,
    odds: { home: 1.9, draw: 3.5, away: 4.0 },
    markets: [
      {
        name: 'Both Teams to Score',
        selections: [
          { name: 'Yes', odds: 1.65 },
          { name: 'No', odds: 2.2 },
        ],
      },
      {
        name: 'Over/Under 2.5 Goals',
        selections: [
          { name: 'Over 2.5', odds: 1.75 },
          { name: 'Under 2.5', odds: 2.05 },
        ],
      },
    ],
  },
  {
    id: 'evt_3',
    sport: 'football',
    league: 'Premier League',
    homeTeam: 'Manchester United',
    awayTeam: 'Tottenham',
    startTime: '2024-12-16T14:00:00Z',
    isLive: false,
    odds: { home: 2.6, draw: 3.3, away: 2.7 },
    markets: [
      {
        name: 'Both Teams to Score',
        selections: [
          { name: 'Yes', odds: 1.6 },
          { name: 'No', odds: 2.3 },
        ],
      },
    ],
  },
  {
    id: 'evt_4',
    sport: 'football',
    league: 'Championship',
    homeTeam: 'Leeds United',
    awayTeam: 'Leicester City',
    startTime: '2024-12-15T12:30:00Z',
    isLive: true,
    odds: { home: 2.1, draw: 3.4, away: 3.2 },
  },
  {
    id: 'evt_5',
    sport: 'football',
    league: 'La Liga',
    homeTeam: 'Barcelona',
    awayTeam: 'Real Madrid',
    startTime: '2024-12-15T20:00:00Z',
    isLive: false,
    odds: { home: 2.2, draw: 3.3, away: 3.0 },
    markets: [
      {
        name: 'Both Teams to Score',
        selections: [
          { name: 'Yes', odds: 1.55 },
          { name: 'No', odds: 2.4 },
        ],
      },
      {
        name: 'Over/Under 2.5 Goals',
        selections: [
          { name: 'Over 2.5', odds: 1.65 },
          { name: 'Under 2.5', odds: 2.2 },
        ],
      },
      {
        name: 'First Goalscorer',
        selections: [
          { name: 'Lewandowski', odds: 4.5 },
          { name: 'Vinicius Jr', odds: 5.0 },
          { name: 'Raphinha', odds: 6.0 },
          { name: 'Bellingham', odds: 6.5 },
        ],
      },
    ],
  },
  {
    id: 'evt_6',
    sport: 'horse-racing',
    league: 'Cheltenham',
    homeTeam: 'Race 1 - 14:00',
    awayTeam: '',
    startTime: '2024-12-15T14:00:00Z',
    isLive: false,
    odds: { home: 3.5, draw: 0, away: 0 },
    markets: [
      {
        name: 'Winner',
        selections: [
          { name: 'Thunder Strike', odds: 3.5 },
          { name: 'Golden Arrow', odds: 4.0 },
          { name: 'Midnight Run', odds: 5.5 },
          { name: 'Celtic Warrior', odds: 7.0 },
        ],
      },
    ],
  },
  {
    id: 'evt_7',
    sport: 'tennis',
    league: 'ATP Finals',
    homeTeam: 'Djokovic',
    awayTeam: 'Alcaraz',
    startTime: '2024-12-15T19:00:00Z',
    isLive: false,
    odds: { home: 2.1, draw: 0, away: 1.75 },
    markets: [
      {
        name: 'Set Betting',
        selections: [
          { name: 'Djokovic 2-0', odds: 3.5 },
          { name: 'Djokovic 2-1', odds: 4.0 },
          { name: 'Alcaraz 2-0', odds: 3.0 },
          { name: 'Alcaraz 2-1', odds: 3.8 },
        ],
      },
    ],
  },
  {
    id: 'evt_8',
    sport: 'golf',
    league: 'The Open Championship',
    homeTeam: 'Tournament Winner',
    awayTeam: '',
    startTime: '2024-12-20T08:00:00Z',
    isLive: false,
    odds: { home: 0, draw: 0, away: 0 },
    markets: [
      {
        name: 'Outright Winner',
        selections: [
          { name: 'Rory McIlroy', odds: 8.0 },
          { name: 'Scottie Scheffler', odds: 6.5 },
          { name: 'Jon Rahm', odds: 9.0 },
          { name: 'Brooks Koepka', odds: 12.0 },
        ],
      },
    ],
  },
  // Horse Racing
  {
    id: 'evt_9',
    sport: 'horse-racing',
    league: 'Ascot',
    homeTeam: 'Race 2 - 14:35',
    awayTeam: '',
    startTime: '2024-12-15T14:35:00Z',
    isLive: false,
    odds: { home: 0, draw: 0, away: 0 },
    markets: [
      {
        name: 'Winner',
        selections: [
          { name: 'Desert Crown', odds: 2.8 },
          { name: 'Frankel\'s Pride', odds: 4.5 },
          { name: 'Sea The Stars II', odds: 6.0 },
          { name: 'Galileo\'s Gift', odds: 8.0 },
          { name: 'Night Raider', odds: 12.0 },
        ],
      },
    ],
  },
  {
    id: 'evt_10',
    sport: 'horse-racing',
    league: 'Leopardstown',
    homeTeam: 'Race 3 - 15:10',
    awayTeam: '',
    startTime: '2024-12-15T15:10:00Z',
    isLive: true,
    odds: { home: 0, draw: 0, away: 0 },
    markets: [
      {
        name: 'Winner',
        selections: [
          { name: 'Irish Legend', odds: 3.0 },
          { name: 'Paddy\'s Delight', odds: 5.0 },
          { name: 'Green Machine', odds: 6.5 },
          { name: 'Emerald Star', odds: 9.0 },
        ],
      },
    ],
  },
  {
    id: 'evt_11',
    sport: 'horse-racing',
    league: 'Aintree',
    homeTeam: 'Race 5 - 16:00',
    awayTeam: '',
    startTime: '2024-12-15T16:00:00Z',
    isLive: false,
    odds: { home: 0, draw: 0, away: 0 },
    markets: [
      {
        name: 'Winner',
        selections: [
          { name: 'Red Rum\'s Legacy', odds: 4.0 },
          { name: 'Fencing Master', odds: 5.5 },
          { name: 'Grand National', odds: 7.0 },
          { name: 'Tiger Roll Jr', odds: 3.5 },
        ],
      },
    ],
  },
  // Tennis
  {
    id: 'evt_12',
    sport: 'tennis',
    league: 'Australian Open',
    homeTeam: 'Sinner',
    awayTeam: 'Medvedev',
    startTime: '2024-12-16T09:00:00Z',
    isLive: false,
    odds: { home: 1.55, draw: 0, away: 2.5 },
    markets: [
      {
        name: 'Set Betting',
        selections: [
          { name: 'Sinner 3-0', odds: 3.2 },
          { name: 'Sinner 3-1', odds: 3.8 },
          { name: 'Medvedev 3-0', odds: 5.5 },
          { name: 'Medvedev 3-1', odds: 5.0 },
        ],
      },
      {
        name: 'Total Games',
        selections: [
          { name: 'Over 35.5', odds: 1.8 },
          { name: 'Under 35.5', odds: 2.0 },
        ],
      },
    ],
  },
  {
    id: 'evt_13',
    sport: 'tennis',
    league: 'WTA Finals',
    homeTeam: 'Swiatek',
    awayTeam: 'Sabalenka',
    startTime: '2024-12-15T16:00:00Z',
    isLive: true,
    odds: { home: 1.9, draw: 0, away: 1.9 },
    markets: [
      {
        name: 'Set Betting',
        selections: [
          { name: 'Swiatek 2-0', odds: 3.0 },
          { name: 'Swiatek 2-1', odds: 3.5 },
          { name: 'Sabalenka 2-0', odds: 3.0 },
          { name: 'Sabalenka 2-1', odds: 3.5 },
        ],
      },
    ],
  },
  {
    id: 'evt_14',
    sport: 'tennis',
    league: 'ATP Finals',
    homeTeam: 'Nadal',
    awayTeam: 'Zverev',
    startTime: '2024-12-15T21:00:00Z',
    isLive: false,
    odds: { home: 2.3, draw: 0, away: 1.65 },
  },
  // Cricket
  {
    id: 'evt_15',
    sport: 'cricket',
    league: 'Indian Premier League',
    homeTeam: 'Mumbai Indians',
    awayTeam: 'Chennai Super Kings',
    startTime: '2024-12-15T14:30:00Z',
    isLive: true,
    odds: { home: 1.8, draw: 0, away: 2.05 },
    markets: [
      {
        name: 'Top Batsman',
        selections: [
          { name: 'Rohit Sharma', odds: 4.0 },
          { name: 'MS Dhoni', odds: 6.0 },
          { name: 'Suryakumar Yadav', odds: 5.0 },
          { name: 'Ruturaj Gaikwad', odds: 5.5 },
        ],
      },
      {
        name: 'Total Runs',
        selections: [
          { name: 'Over 340.5', odds: 1.85 },
          { name: 'Under 340.5', odds: 1.95 },
        ],
      },
    ],
  },
  {
    id: 'evt_16',
    sport: 'cricket',
    league: 'The Ashes',
    homeTeam: 'England',
    awayTeam: 'Australia',
    startTime: '2024-12-16T10:00:00Z',
    isLive: false,
    odds: { home: 2.8, draw: 3.5, away: 2.4 },
    markets: [
      {
        name: 'Match Result',
        selections: [
          { name: 'England', odds: 2.8 },
          { name: 'Draw', odds: 3.5 },
          { name: 'Australia', odds: 2.4 },
        ],
      },
      {
        name: 'Top Bowler',
        selections: [
          { name: 'Anderson', odds: 5.0 },
          { name: 'Cummins', odds: 4.5 },
          { name: 'Broad', odds: 6.0 },
          { name: 'Starc', odds: 4.0 },
        ],
      },
    ],
  },
  {
    id: 'evt_17',
    sport: 'cricket',
    league: 'T20 World Cup',
    homeTeam: 'India',
    awayTeam: 'Pakistan',
    startTime: '2024-12-17T14:00:00Z',
    isLive: false,
    odds: { home: 1.7, draw: 0, away: 2.2 },
    markets: [
      {
        name: 'Man of the Match',
        selections: [
          { name: 'Virat Kohli', odds: 5.0 },
          { name: 'Babar Azam', odds: 5.5 },
          { name: 'Jasprit Bumrah', odds: 7.0 },
          { name: 'Shaheen Afridi', odds: 8.0 },
        ],
      },
    ],
  },
  // Boxing
  {
    id: 'evt_18',
    sport: 'boxing',
    league: 'Heavyweight Championship',
    homeTeam: 'Tyson Fury',
    awayTeam: 'Oleksandr Usyk',
    startTime: '2024-12-21T22:00:00Z',
    isLive: false,
    odds: { home: 2.1, draw: 21.0, away: 1.8 },
    markets: [
      {
        name: 'Method of Victory',
        selections: [
          { name: 'Fury by KO', odds: 3.5 },
          { name: 'Fury by Decision', odds: 4.0 },
          { name: 'Usyk by KO', odds: 5.0 },
          { name: 'Usyk by Decision', odds: 3.0 },
        ],
      },
      {
        name: 'Round Betting',
        selections: [
          { name: 'Rounds 1-3', odds: 9.0 },
          { name: 'Rounds 4-6', odds: 6.0 },
          { name: 'Rounds 7-9', odds: 5.0 },
          { name: 'Rounds 10-12', odds: 4.5 },
        ],
      },
    ],
  },
  {
    id: 'evt_19',
    sport: 'boxing',
    league: 'Middleweight',
    homeTeam: 'Canelo Alvarez',
    awayTeam: 'Jermall Charlo',
    startTime: '2024-12-22T04:00:00Z',
    isLive: false,
    odds: { home: 1.4, draw: 17.0, away: 3.2 },
    markets: [
      {
        name: 'Method of Victory',
        selections: [
          { name: 'Canelo by KO', odds: 2.5 },
          { name: 'Canelo by Decision', odds: 2.8 },
          { name: 'Charlo by KO', odds: 8.0 },
          { name: 'Charlo by Decision', odds: 7.0 },
        ],
      },
    ],
  },
  // Darts
  {
    id: 'evt_20',
    sport: 'darts',
    league: 'PDC World Championship',
    homeTeam: 'Luke Humphries',
    awayTeam: 'Luke Littler',
    startTime: '2024-12-15T20:00:00Z',
    isLive: false,
    odds: { home: 1.65, draw: 0, away: 2.3 },
    markets: [
      {
        name: 'Correct Score',
        selections: [
          { name: 'Humphries 7-5', odds: 5.5 },
          { name: 'Humphries 7-3', odds: 6.0 },
          { name: 'Littler 7-5', odds: 7.0 },
          { name: 'Littler 7-4', odds: 8.0 },
        ],
      },
      {
        name: 'Most 180s',
        selections: [
          { name: 'Humphries', odds: 2.1 },
          { name: 'Littler', odds: 1.75 },
        ],
      },
    ],
  },
  {
    id: 'evt_21',
    sport: 'darts',
    league: 'PDC World Championship',
    homeTeam: 'Michael van Gerwen',
    awayTeam: 'Gerwyn Price',
    startTime: '2024-12-15T21:30:00Z',
    isLive: true,
    odds: { home: 1.8, draw: 0, away: 2.05 },
    markets: [
      {
        name: 'Most 180s',
        selections: [
          { name: 'Van Gerwen', odds: 1.9 },
          { name: 'Price', odds: 1.9 },
        ],
      },
    ],
  },
  {
    id: 'evt_22',
    sport: 'darts',
    league: 'Premier League Darts',
    homeTeam: 'Rob Cross',
    awayTeam: 'Nathan Aspinall',
    startTime: '2024-12-16T19:00:00Z',
    isLive: false,
    odds: { home: 1.7, draw: 0, away: 2.2 },
  },
  // Greyhounds
  {
    id: 'evt_23',
    sport: 'greyhounds',
    league: 'Shelbourne Park',
    homeTeam: 'Race 4 - 20:15',
    awayTeam: '',
    startTime: '2024-12-15T20:15:00Z',
    isLive: false,
    odds: { home: 0, draw: 0, away: 0 },
    markets: [
      {
        name: 'Winner',
        selections: [
          { name: 'Trap 1 - Blue Lightning', odds: 3.0 },
          { name: 'Trap 2 - Rapid Fire', odds: 4.5 },
          { name: 'Trap 3 - Storm Chaser', odds: 5.0 },
          { name: 'Trap 4 - Golden Rocket', odds: 6.0 },
        ],
      },
      {
        name: 'Forecast',
        selections: [
          { name: '1-2', odds: 8.0 },
          { name: '1-3', odds: 10.0 },
          { name: '3-1', odds: 12.0 },
          { name: '2-4', odds: 15.0 },
        ],
      },
    ],
  },
  {
    id: 'evt_24',
    sport: 'greyhounds',
    league: 'Romford',
    homeTeam: 'Race 7 - 21:00',
    awayTeam: '',
    startTime: '2024-12-15T21:00:00Z',
    isLive: false,
    odds: { home: 0, draw: 0, away: 0 },
    markets: [
      {
        name: 'Winner',
        selections: [
          { name: 'Trap 1 - Midnight Express', odds: 4.0 },
          { name: 'Trap 2 - Ballymac Vic', odds: 3.5 },
          { name: 'Trap 3 - Droopys Hero', odds: 5.5 },
          { name: 'Trap 4 - Clonbrien Hero', odds: 7.0 },
        ],
      },
    ],
  },
  // More Football
  {
    id: 'evt_25',
    sport: 'football',
    league: 'Serie A',
    homeTeam: 'AC Milan',
    awayTeam: 'Inter Milan',
    startTime: '2024-12-15T19:45:00Z',
    isLive: false,
    odds: { home: 3.0, draw: 3.2, away: 2.4 },
    markets: [
      {
        name: 'Both Teams to Score',
        selections: [
          { name: 'Yes', odds: 1.6 },
          { name: 'No', odds: 2.3 },
        ],
      },
      {
        name: 'Over/Under 2.5 Goals',
        selections: [
          { name: 'Over 2.5', odds: 1.7 },
          { name: 'Under 2.5', odds: 2.1 },
        ],
      },
    ],
  },
  {
    id: 'evt_26',
    sport: 'football',
    league: 'Bundesliga',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    startTime: '2024-12-16T17:30:00Z',
    isLive: false,
    odds: { home: 1.7, draw: 3.8, away: 4.5 },
    markets: [
      {
        name: 'Both Teams to Score',
        selections: [
          { name: 'Yes', odds: 1.55 },
          { name: 'No', odds: 2.4 },
        ],
      },
      {
        name: 'First Goalscorer',
        selections: [
          { name: 'Harry Kane', odds: 3.5 },
          { name: 'Jamal Musiala', odds: 5.5 },
          { name: 'Donyell Malen', odds: 6.0 },
          { name: 'Karim Adeyemi', odds: 7.0 },
        ],
      },
    ],
  },
  {
    id: 'evt_27',
    sport: 'football',
    league: 'Ligue 1',
    homeTeam: 'PSG',
    awayTeam: 'Marseille',
    startTime: '2024-12-15T20:45:00Z',
    isLive: false,
    odds: { home: 1.5, draw: 4.2, away: 6.0 },
    markets: [
      {
        name: 'Over/Under 2.5 Goals',
        selections: [
          { name: 'Over 2.5', odds: 1.55 },
          { name: 'Under 2.5', odds: 2.4 },
        ],
      },
    ],
  },
  {
    id: 'evt_28',
    sport: 'football',
    league: 'Champions League',
    homeTeam: 'Liverpool',
    awayTeam: 'Real Madrid',
    startTime: '2024-12-17T20:00:00Z',
    isLive: false,
    odds: { home: 2.1, draw: 3.4, away: 3.3 },
    markets: [
      {
        name: 'Both Teams to Score',
        selections: [
          { name: 'Yes', odds: 1.6 },
          { name: 'No', odds: 2.3 },
        ],
      },
      {
        name: 'First Goalscorer',
        selections: [
          { name: 'Mohamed Salah', odds: 5.0 },
          { name: 'Vinicius Jr', odds: 5.5 },
          { name: 'Darwin Nunez', odds: 6.0 },
          { name: 'Bellingham', odds: 6.5 },
        ],
      },
    ],
  },
  // Golf
  {
    id: 'evt_29',
    sport: 'golf',
    league: 'PGA Championship',
    homeTeam: 'Tournament Winner',
    awayTeam: '',
    startTime: '2024-12-19T08:00:00Z',
    isLive: false,
    odds: { home: 0, draw: 0, away: 0 },
    markets: [
      {
        name: 'Outright Winner',
        selections: [
          { name: 'Scottie Scheffler', odds: 5.5 },
          { name: 'Xander Schauffele', odds: 10.0 },
          { name: 'Collin Morikawa', odds: 14.0 },
          { name: 'Viktor Hovland', odds: 16.0 },
        ],
      },
      {
        name: 'Top 5 Finish',
        selections: [
          { name: 'Rory McIlroy', odds: 2.5 },
          { name: 'Scottie Scheffler', odds: 2.0 },
          { name: 'Jon Rahm', odds: 3.0 },
          { name: 'Jordan Spieth', odds: 5.0 },
        ],
      },
    ],
  },
  {
    id: 'evt_30',
    sport: 'golf',
    league: 'Ryder Cup',
    homeTeam: 'Europe vs USA',
    awayTeam: '',
    startTime: '2024-12-20T12:00:00Z',
    isLive: false,
    odds: { home: 0, draw: 0, away: 0 },
    markets: [
      {
        name: 'Match Winner',
        selections: [
          { name: 'Europe', odds: 2.2 },
          { name: 'USA', odds: 1.75 },
          { name: 'Tie', odds: 9.0 },
        ],
      },
    ],
  },
];

export function formatOdds(decimal: number): string {
  if (decimal <= 1) return 'EVS';
  const numerator = Math.round((decimal - 1) * 100);
  const denominator = 100;
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(numerator, denominator);
  return `${numerator / divisor}/${denominator / divisor}`;
}

export type Transaction = {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'winning';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
};

export const mockTransactions: Transaction[] = [
  { id: 'txn_1', type: 'deposit', amount: 50, description: 'Deposit via Visa', date: '2024-12-14', status: 'completed' },
  { id: 'txn_2', type: 'bet', amount: -10, description: 'Arsenal vs Man City - Arsenal to Win', date: '2024-12-14', status: 'completed' },
  { id: 'txn_3', type: 'winning', amount: 24, description: 'Liverpool vs Chelsea - Liverpool Win', date: '2024-12-13', status: 'completed' },
  { id: 'txn_4', type: 'bet', amount: -5, description: 'Acca: 4-fold Premier League', date: '2024-12-13', status: 'completed' },
  { id: 'txn_5', type: 'deposit', amount: 100, description: 'Deposit via Pay by Bank', date: '2024-12-12', status: 'completed' },
  { id: 'txn_6', type: 'withdrawal', amount: -30, description: 'Withdrawal to bank account', date: '2024-12-11', status: 'completed' },
];
