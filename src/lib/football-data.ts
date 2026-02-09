import axios from 'axios';

const footballDataApi = axios.create({
  baseURL: 'https://api.football-data.org/v4',
  headers: {
    'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY || ''
  }
});

// Types for Football-Data.org responses
export interface Match {
  id: number;
  utcDate: string;
  status: 'TIMED' | 'LIVE' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'POSTPONED' | 'CANCELLED' | 'SUSPENDED';
  minute: number | null;
  injuryTime: number | null;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
    halfTime: {
      home: number | null;
      away: number | null;
    };
    liveScore?: {
      home: number | null;
      away: number | null;
    };
  };
  goals?: Array<{
    minute: number;
    injuryTime?: number;
    type: 'PENALTY' | 'OWN_GOAL' | 'REGULAR';
    scorer: {
      id: number;
      name: string;
    };
    assist?: {
      id: number;
      name: string;
    };
    team: {
      id: number;
      name: string;
    };
  }>;
  competitionId?: number;
  competition?: {
    id: number;
    name: string;
    code: string;
    emblem: string;
  };
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  address: string;
  website: string;
  founded: number;
  clubColors: string;
  venue: string;
  currentSeason: {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday: number;
    winner: string | null;
  };
}

export interface Standings {
  position: number;
  team: {
    id: number;
    name: string;
    crest: string;
  };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

// Get live matches
export const getLiveMatches = async (): Promise<Match[]> => {
  try {
    const response = await fetch('/api/football/live');
    const data = await response.json();
    return data.matches || [];
  } catch (error) {
    console.error('Error fetching live matches:', error);
    return [];
  }
};

// Get all upcoming and live matches
export const getUpcomingMatches = async (days: number = 7): Promise<Match[]> => {
  try {
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    
    const response = await footballDataApi.get('/matches', {
      params: {
        dateFrom: today.toISOString().split('T')[0],
        dateTo: futureDate.toISOString().split('T')[0],
        status: 'SCHEDULED,LIVE,IN_PLAY'
      }
    });
    return response.data.matches || [];
  } catch (error) {
    console.error('Error fetching upcoming matches:', error);
    return [];
  }
};

// Get matches by competition (league)
export const getLeagueMatches = async (competitionCode: string): Promise<Match[]> => {
  try {
    const response = await footballDataApi.get(`/competitions/${competitionCode}/matches`);
    return response.data.matches || [];
  } catch (error) {
    console.error(`Error fetching ${competitionCode} matches:`, error);
    return [];
  }
};

// Get specific match details
export const getMatchDetails = async (matchId: number): Promise<Match | null> => {
  try {
    const response = await fetch(`/api/football/matches/${matchId}`);
    const data = await response.json();
    return data.match || null;
  } catch (error) {
    console.error('Error fetching match details:', error);
    return null;
  }
};

// Get team information
export const getTeamInfo = async (teamId: number): Promise<Team | null> => {
  try {
    const response = await footballDataApi.get(`/teams/${teamId}`);
    return response.data.team || null;
  } catch (error) {
    console.error('Error fetching team info:', error);
    return null;
  }
};

// Get league standings
export const getLeagueStandings = async (competitionCode: string): Promise<Standings[]> => {
  try {
    const response = await footballDataApi.get(`/competitions/${competitionCode}/standings`);
    if (response.data.standings && response.data.standings[0]) {
      return response.data.standings[0].table || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching standings:', error);
    return [];
  }
};

// Get today's matches
export const getTodaysMatches = async (): Promise<Match[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await footballDataApi.get('/matches', {
      params: {
        dateFrom: today,
        dateTo: today
      }
    });
    return response.data.matches || [];
  } catch (error) {
    console.error('Error fetching today matches:', error);
    return [];
  }
};

// Major leagues codes
export const LEAGUES = {
  PL: 'Premier League (England)',
  PD: 'La Liga (Spain)',
  SA: 'Serie A (Italy)',
  BL1: 'Bundesliga (Germany)',
  FL1: 'Ligue 1 (France)',
  PPL: 'Primeira Liga (Portugal)',
  DED: 'Eredivisie (Netherlands)',
  CL: 'Champions League',
  EL: 'Europa League',
  WC: 'World Cup'
};

// Get matches by league code
export const getLeagueMatchesByCode = async (leagueCode: keyof typeof LEAGUES): Promise<Match[]> => {
  return getLeagueMatches(leagueCode);
};
