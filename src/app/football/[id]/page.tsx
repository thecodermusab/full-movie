'use client';

import { getMatchDetails } from '@/lib/football-data';
import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { FootballPlayer } from '@/components/FootballPlayer';

interface Match {
  id: number;
  status: string;
  minute: number | null;
  homeTeam: any;
  awayTeam: any;
  score: any;
  goals?: any[];
  competition?: any;
  utcDate: string;
}

export default function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const data = await getMatchDetails(parseInt(id));
        setMatch(data);
      } catch (error) {
        console.error('Error fetching match:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">⚽</div>
          <p className="mt-4 text-muted-foreground">Loading match details...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold">❌ Match not found</p>
          <a href="/football" className="text-primary hover:underline mt-4 inline-block">
            ← Back to all matches
          </a>
        </div>
      </div>
    );
  }

  const isLive = match.status === 'LIVE' || match.status === 'IN_PLAY';
  const isFinished = match.status === 'FINISHED';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Match Header */}
      <div className="bg-gradient-to-b from-primary/20 to-transparent p-4 md:p-8">
        <div className="container mx-auto px-4 md:px-0">
          {/* Status Badge */}
          <div className="mb-6 flex items-center gap-2">
            {isLive && (
              <div className="flex items-center gap-2 bg-red-500 text-white px-3 md:px-4 py-2 rounded-full font-bold animate-pulse text-sm md:text-base">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                LIVE
              </div>
            )}
            {isFinished && (
              <div className="bg-muted text-muted-foreground px-3 md:px-4 py-2 rounded-full font-bold text-sm md:text-base">
                FINAL
              </div>
            )}
          </div>

          {/* Team Matchup */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
            {/* Home Team */}
            <div className="flex-1 text-center">
              {match.homeTeam.crest && (
                <Image
                  src={match.homeTeam.crest}
                  alt={match.homeTeam.name}
                  width={80}
                  height={80}
                  className="mx-auto mb-2 md:mb-4 w-20 h-20 md:w-32 md:h-32"
                />
              )}
              <h2 className="text-xl md:text-3xl font-bold break-words">{match.homeTeam.name}</h2>
            </div>

            {/* Score */}
            <div className="text-center px-2 md:px-8 order-first md:order-none">
              <div className="text-4xl md:text-6xl font-black mb-2 md:mb-4">
                {match.score.fullTime.home ?? '-'} - {match.score.fullTime.away ?? '-'}
              </div>
              {match.score.halfTime.home !== null && (
                <div className="text-muted-foreground text-sm">
                  HT: {match.score.halfTime.home} - {match.score.halfTime.away}
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex-1 text-center">
              {match.awayTeam.crest && (
                <Image
                  src={match.awayTeam.crest}
                  alt={match.awayTeam.name}
                  width={80}
                  height={80}
                  className="mx-auto mb-2 md:mb-4 w-20 h-20 md:w-32 md:h-32"
                />
              )}
              <h2 className="text-xl md:text-3xl font-bold break-words">{match.awayTeam.name}</h2>
            </div>
          </div>

          {/* Match Info */}
          <div className="mt-6 text-center text-muted-foreground">
            {match.competition && (
              <p className="font-semibold text-lg mb-2">{match.competition.name}</p>
            )}
            <p>{formatDate(match.utcDate)}</p>
            {isLive && match.minute && (
              <p className="text-primary font-bold mt-2">{match.minute}' in progress</p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Watch Section */}
        <div className="mb-12">
          <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
            <span>📺</span> Watch Live
          </h3>
          <div className="bg-card border border-border p-4 md:p-6 rounded-lg">
            <FootballPlayer
              videoId={id}
              streamUrl={`https://www.youtube.com/embed/search?q=${match.homeTeam.name}%20vs%20${match.awayTeam.name}%20live`}
            />

            {/* Instructions */}
            <div className="mt-6 p-3 md:p-4 bg-muted rounded-lg text-xs md:text-sm">
              <h4 className="font-bold mb-2">⚽ How to watch:</h4>
              <ol className="space-y-2 list-decimal list-inside text-muted-foreground">
                <li>Search YouTube for "{match.homeTeam.name} vs {match.awayTeam.name} live"</li>
                <li>Copy the video ID from the URL (youtube.com/watch?v=<strong>VIDEO_ID</strong>)</li>
                <li>Paste the VIDEO_ID above</li>
                <li>Enjoy the match!</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Goals Section */}
        {match.goals && match.goals.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl md:text-2xl font-bold mb-6">⚽ Goals</h3>
            <div className="space-y-3 bg-card border border-border rounded-lg p-4 md:p-6">
              {match.goals.map((goal, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-border pb-3 last:border-0 text-sm md:text-base">
                  <div>
                    <p className="font-bold">{goal.scorer.name}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {goal.team.name} {goal.type === 'OWN_GOAL' ? '(OG)' : ''}
                    </p>
                  </div>
                  <span className="text-muted-foreground">{goal.minute}'</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teams Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Home Team Info */}
          <div className="bg-card border border-border p-4 md:p-6 rounded-lg">
            <h3 className="text-lg md:text-xl font-bold mb-4">{match.homeTeam.name}</h3>
            <div className="space-y-2 text-xs md:text-sm">
              {match.homeTeam.address && (
                <div>
                  <span className="text-muted-foreground">📍 Address:</span>
                  <p className="text-xs md:text-sm">{match.homeTeam.address}</p>
                </div>
              )}
              {match.homeTeam.venue && (
                <div>
                  <span className="text-muted-foreground">🏟️ Venue:</span>
                  <p className="text-xs md:text-sm">{match.homeTeam.venue}</p>
                </div>
              )}
              {match.homeTeam.website && (
                <div>
                  <a
                    href={match.homeTeam.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-xs md:text-sm"
                  >
                    🌐 Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Away Team Info */}
          <div className="bg-card border border-border p-4 md:p-6 rounded-lg">
            <h3 className="text-lg md:text-xl font-bold mb-4">{match.awayTeam.name}</h3>
            <div className="space-y-2 text-xs md:text-sm">
              {match.awayTeam.address && (
                <div>
                  <span className="text-muted-foreground">📍 Address:</span>
                  <p className="text-xs md:text-sm">{match.awayTeam.address}</p>
                </div>
              )}
              {match.awayTeam.venue && (
                <div>
                  <span className="text-muted-foreground">🏟️ Venue:</span>
                  <p className="text-xs md:text-sm">{match.awayTeam.venue}</p>
                </div>
              )}
              {match.awayTeam.website && (
                <div>
                  <a
                    href={match.awayTeam.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-xs md:text-sm"
                  >
                    🌐 Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <a
            href="/football"
            className="inline-block bg-primary text-primary-foreground px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors text-sm md:text-base"
          >
            ← Back to All Matches
          </a>
        </div>
      </div>
    </div>
  );
}
