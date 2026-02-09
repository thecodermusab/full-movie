import { searchLiveFootball, searchFootballHighlights } from "@/lib/youtube";
import { FootballMatchCard } from "@/components/FootballMatchCard";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function FootballPage() {
  const liveMatches = await searchLiveFootball("live football match premier league");
  const highlights = await searchFootballHighlights("football highlights today");

  return (
    <div className="container mx-auto px-4 py-8 space-y-12 min-h-screen">
      
      {/* Live Now Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
             <h2 className="text-3xl font-bold font-montserrat uppercase text-white border-l-4 border-green-500 pl-3">
            Live Matches
            </h2>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
        </div>
       
        {liveMatches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {liveMatches.map((video) => (
              <FootballMatchCard key={video.id.videoId} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground italic bg-muted/20 p-8 rounded-xl text-center">
            No live matches found on YouTube right now. Check back later!
          </div>
        )}
      </section>

      {/* Highlights Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold font-montserrat uppercase text-white border-l-4 border-primary pl-3">
          Latest Highlights
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {highlights.map((video) => (
            <FootballMatchCard key={video.id.videoId} video={video} />
          ))}
        </div>
      </section>
    </div>
  );
}
