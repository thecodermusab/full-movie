import { getLiveMatches, getUpcomingMatches, LEAGUES } from '@/lib/football-data';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Live Football Matches - StreameX',
  description: 'Watch live football matches, fixtures, and standings from top leagues worldwide.'
};

export default async function FootballPage() {
  const liveMatches = await getLiveMatches();
  const upcomingMatches = await getUpcomingMatches(7);

  // Combine and remove duplicates
  const allMatches = [
    ...liveMatches,
    ...upcomingMatches.filter(
      (match) => !liveMatches.find((live) => live.id === match.id)
    )
  ];

  const isLive = (status: string) => status === 'LIVE' || status === 'IN_PLAY';
  const isScheduled = (status: string) => status === 'SCHEDULED' || status === 'TIMED';
  const isFinished = (status: string) => status === 'FINISHED';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-transparent p-8 mb-8">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold font-montserrat mb-2">⚽ Football Live</h1>
          <p className="text-muted-foreground text-lg">
            Live scores, fixtures and standings from major leagues worldwide
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Live Matches Section */}
        {liveMatches.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              <h2 className="text-3xl font-bold font-montserrat">Now Playing</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {liveMatches.map((match) => (
                <Link
                  key={match.id}
                  href={`/football/${match.id}`}
                  className="group bg-gradient-to-r from-red-500/10 to-transparent border-2 border-red-500/50 p-6 rounded-lg hover:border-red-500 transition-all"
                >
                  <div className="flex items-center justify-between">
                    {/* Home Team */}
                    <div className="flex-1 flex flex-col items-center">
                      {match.homeTeam.crest && (
                        <Image
                          src={match.homeTeam.crest}
                          alt={match.homeTeam.name}
                          width={60}
                          height={60}
                          className="mb-2"
                        />
                      )}
                      <h3 className="font-bold text-center text-sm md:text-base">
                        {match.homeTeam.shortName || match.homeTeam.name}
                      </h3>
                    </div>

                    {/* Live Score */}
                    <div className="flex flex-col items-center px-4 md:px-8">
                      <div className="text-4xl md:text-5xl font-black">
                        {match.score.fullTime.home ?? '-'} - {match.score.fullTime.away ?? '-'}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground mt-2">
                        {match.minute && isLive(match.status) ? (
                          <span className="bg-red-500 text-white px-3 py-1 rounded font-bold">
                            {match.minute}' LIVE
                          </span>
                        ) : (
                          <span className="bg-red-500 text-white px-3 py-1 rounded font-bold">
                            LIVE
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex-1 flex flex-col items-center">
                      {match.awayTeam.crest && (
                        <Image
                          src={match.awayTeam.crest}
                          alt={match.awayTeam.name}
                          width={60}
                          height={60}
                          className="mb-2"
                        />
                      )}
                      <h3 className="font-bold text-center text-sm md:text-base">
                        {match.awayTeam.shortName || match.awayTeam.name}
                      </h3>
                    </div>
                  </div>

                  {/* Match Info */}
                  {match.competition && (
                    <div className="mt-4 text-center text-xs md:text-sm text-muted-foreground border-t border-border pt-3">
                      <p className="font-semibold">{match.competition.name}</p>
                    </div>
                  )}

                  {/* Watch Button */}
                  <div className="mt-4 text-center">
                    <span className="inline-block bg-red-500 text-white px-4 py-2 rounded font-bold group-hover:bg-red-600 transition-colors">
                      📺 Watch Now
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Matches Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold font-montserrat mb-6">📅 Upcoming Matches</h2>

          {allMatches.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-lg border border-border">
              <p className="text-muted-foreground text-xl">
                No matches scheduled right now. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {allMatches.slice(0, 20).map((match) => (
                <Link
                  key={match.id}
                  href={`/football/${match.id}`}
                  className="group bg-card border border-border p-4 md:p-6 rounded-lg hover:border-primary transition-all hover:shadow-lg"
                >
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Home Team */}
                    <div className="flex-1 flex items-center gap-3">
                      {match.homeTeam.crest && (
                        <Image
                          src={match.homeTeam.crest}
                          alt={match.homeTeam.name}
                          width={40}
                          height={40}
                        />
                      )}
                      <div>
                        <h3 className="font-bold text-sm md:text-base">
                          {match.homeTeam.shortName || match.homeTeam.name}
                        </h3>
                      </div>
                    </div>

                    {/* Score / Status */}
                    <div className="flex flex-col items-center text-center px-4">
                      {isFinished(match.status) ? (
                        <>
                          <div className="text-2xl font-black">
                            {match.score.fullTime.home} - {match.score.fullTime.away}
                          </div>
                          <span className="text-xs text-muted-foreground">Final</span>
                        </>
                      ) : isLive(match.status) ? (
                        <>
                          <div className="text-2xl font-black">
                            {match.score.fullTime.home ?? '-'} - {match.score.fullTime.away ?? '-'}
                          </div>
                          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded mt-1">
                            LIVE
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(match.utcDate)}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {match.status === 'POSTPONED' && '📅 Postponed'}
                            {match.status === 'CANCELLED' && '❌ Cancelled'}
                            {match.status === 'TIMED' && '⏰ Upcoming'}
                            {match.status === 'SUSPENDED' && '⏸️ Suspended'}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="flex-1 flex items-center justify-end gap-3">
                      <div className="text-right">
                        <h3 className="font-bold text-sm md:text-base">
                          {match.awayTeam.shortName || match.awayTeam.name}
                        </h3>
                      </div>
                      {match.awayTeam.crest && (
                        <Image
                          src={match.awayTeam.crest}
                          alt={match.awayTeam.name}
                          width={40}
                          height={40}
                        />
                      )}
                    </div>

                    {/* Competition Badge */}
                    {match.competition && (
                      <div className="hidden lg:block text-center">
                        <Image
                          src={match.competition.emblem}
                          alt={match.competition.name}
                          width={40}
                          height={40}
                          title={match.competition.name}
                        />
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Supported Leagues */}
          <div className="bg-card border border-border p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">📊 Supported Leagues</h3>
            <div className="space-y-2 text-sm">
              {Object.entries(LEAGUES).map(([code, name]) => (
                <div key={code} className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How to Watch */}
          <div className="bg-card border border-border p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">📺 How to Watch</h3>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>Click on any live match</li>
              <li>Match details and live score appear</li>
              <li>Search for streams on YouTube</li>
              <li>Paste the video link in the player</li>
              <li>Enjoy the match!</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-4">
              💡 Tip: Search YouTube for "[Team A] vs [Team B] live" to find official streams
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
