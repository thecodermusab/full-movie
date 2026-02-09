import { getTVShowDetails, getSeasonDetails, TMDBTVShow, getImageUrl, getTVWatchProviders, TMDBWatchProvider } from "@/lib/tmdb";
import { MultiSourceMoviePlayer } from "@/components/MultiSourceMoviePlayer";
import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview?: string;
  still_path?: string;
}

interface Season {
  id: number;
  season_number: number;
}

interface ShowDetails extends TMDBTVShow {
  seasons: Season[];
  credits?: { cast: CastMemberShow[] };
}

interface CastMemberShow {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
}

interface PageProps {
  params:
    | {
        id: string;
      }
    | Promise<{
        id: string;
      }>;
  searchParams:
    | {
        season?: string;
        episode?: string;
      }
    | Promise<{
        season?: string;
        episode?: string;
      }>;
}

const dedupeProviders = (providers: TMDBWatchProvider[]): TMDBWatchProvider[] =>
  Array.from(new Map(providers.map((provider) => [provider.provider_id, provider])).values());

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const show = await getTVShowDetails(parseInt(id, 10));
  if (!show) {
    return {
      title: "TV Show - StreameX",
      description: "Watch TV shows on StreameX.",
    };
  }
  return {
    title: `${show.name} - StreameX`,
    description: show.overview,
  };
}

export default async function TVShowPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const showId = parseInt(id, 10);
  if (isNaN(showId)) return <div className="p-20 text-center">Invalid TV Show ID</div>;

  const show: ShowDetails = await getTVShowDetails(showId);

  // Default to Season 1 Episode 1 if not specified
  const parsedSeason = resolvedSearchParams.season ? parseInt(resolvedSearchParams.season, 10) : 1;
  const parsedEpisode = resolvedSearchParams.episode ? parseInt(resolvedSearchParams.episode, 10) : 1;
  const seasonNum = Number.isNaN(parsedSeason) ? 1 : parsedSeason;
  const episodeNum = Number.isNaN(parsedEpisode) ? 1 : parsedEpisode;

  if (!show) {
    return <div className="p-20 text-center">TV Show not found</div>;
  }

  const watchProviders = await getTVWatchProviders(showId, "US");
  const freeProviders = dedupeProviders([...(watchProviders?.free ?? []), ...(watchProviders?.ads ?? [])]);
  const subscriptionProviders = dedupeProviders(watchProviders?.flatrate ?? []);

  // Fetch season details to get episodes list
  const seasonDetails = await getSeasonDetails(showId, seasonNum);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Backdrop */}
      <div className="relative h-[60vh] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${getImageUrl(show.backdrop_path, "original")})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 space-y-4 container mx-auto">
             <h1 className="text-4xl md:text-6xl font-extrabold text-white font-montserrat uppercase drop-shadow-lg">
            {show.name}
          </h1>
           <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/90">
                <span className="bg-primary text-black px-2 py-0.5 rounded text-xs font-bold">HD</span>
                <span>{show.first_air_date?.split("-")[0]}</span>
                <span className="flex items-center text-yellow-500">★ {show.vote_average.toFixed(1)}</span>
                <span className="text-white">S{seasonNum} E{episodeNum}</span>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-8">
        <div className="space-y-8">
          {/* Player */}
          <section id="watch">
             <MultiSourceMoviePlayer tmdbId={show.id} season={seasonNum} episode={episodeNum} />
          </section>
          
          {/* Episode Selection */}
           <section className="space-y-4">
               <div className="flex items-center justify-between">
                   <h2 className="text-2xl font-bold font-montserrat text-white border-l-4 border-primary pl-3">Episodes</h2>
                   <div className="flex gap-2">
                       {/* Simple Season Selector */}
                       {show.seasons.map((season) => (
                           <Link 
                                key={season.id} 
                                href={`/tv-shows/${show.id}?season=${season.season_number}`}
                                className={`px-3 py-1 rounded text-sm ${season.season_number === seasonNum ? 'bg-primary text-black font-bold' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                            >
                                S{season.season_number}
                            </Link>
                       ))}
                   </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                   {seasonDetails.episodes?.map((episode: Episode) => (
                       <Link 
                            key={episode.id} 
                            href={`/tv-shows/${show.id}?season=${seasonNum}&episode=${episode.episode_number}`}
                            className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${episode.episode_number === episodeNum ? 'bg-primary/10 border-primary' : 'bg-card border-border hover:border-primary/50'}`}
                        >
                           <div className="relative w-32 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                               {episode.still_path && (
                                 <Image 
                                   src={getImageUrl(episode.still_path)} 
                                   alt={episode.name}
                                   width={128}
                                   height={80}
                                   className="w-full h-full object-cover" 
                                 />
                               )}
                               <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                                   <PlayCircle className="w-8 h-8 text-white" />
                               </div>
                           </div>
                           <div className="flex-1 min-w-0">
                               <h4 className={`text-sm font-bold truncate ${episode.episode_number === episodeNum ? 'text-primary' : 'text-white'}`}>
                                   {episode.episode_number}. {episode.name}
                               </h4>
                               <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{episode.overview}</p>
                           </div>
                       </Link>
                   ))}
               </div>
           </section>

          {/* Synopsis */}
          <section className="space-y-4">
             <h2 className="text-2xl font-bold font-montserrat text-white border-l-4 border-primary pl-3">Synopsis</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {show.overview}
            </p>
          </section>

          {/* Cast */}
            {show.credits?.cast && (
                 <section className="space-y-4">
                     <h2 className="text-2xl font-bold font-montserrat text-white border-l-4 border-primary pl-3">Cast</h2>
                     <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                         {show.credits.cast.slice(0, 10).map((actor: CastMemberShow) => (
                             <div key={actor.id} className="w-24 flex-none space-y-2 text-center">
                                 <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
                                     {actor.profile_path && (
                                       <Image 
                                         src={getImageUrl(actor.profile_path)} 
                                         alt={actor.name}
                                         width={96}
                                         height={96}
                                         className="w-full h-full object-cover" 
                                       />
                                     )}
                                 </div>
                                 <p className="text-xs font-medium truncate">{actor.name}</p>
                                 <p className="text-[10px] text-muted-foreground truncate">{actor.character}</p>
                             </div>
                         ))}
                     </div>
                 </section>
            )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
            <div className="bg-card p-6 rounded-xl border border-border sticky top-24">
                <h3 className="text-lg font-bold mb-4 font-montserrat">Show Info</h3>
                <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <dt className="text-muted-foreground">Original Name</dt>
                        <dd className="font-medium text-right">{show.name}</dd>
                    </div>
                     <div className="flex justify-between">
                        <dt className="text-muted-foreground">First Air Date</dt>
                        <dd className="font-medium">{show.first_air_date}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-muted-foreground">Ratings</dt>
                        <dd className="font-medium">★ {show.vote_average.toFixed(1)}</dd>
                    </div>
                </dl>
            </div>

            {watchProviders && (
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-lg font-bold mb-4 font-montserrat">Where to Watch (US)</h3>
                <div className="space-y-4">
                  {freeProviders.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Free / Ad-supported
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {freeProviders.map((provider) => (
                          <Badge key={`free-${provider.provider_id}`} variant="secondary">
                            {provider.provider_name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {subscriptionProviders.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Subscription
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {subscriptionProviders.map((provider) => (
                          <Badge key={`sub-${provider.provider_id}`} variant="outline">
                            {provider.provider_name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {watchProviders.link && (
                    <a
                      href={watchProviders.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm font-medium text-primary hover:underline"
                    >
                      View all provider options
                    </a>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
