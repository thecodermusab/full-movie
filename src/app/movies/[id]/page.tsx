import { getImageUrl, getMovieDetails, getMovieWatchProviders, TMDBMovie, TMDBWatchProvider } from "@/lib/tmdb";
import { MultiSourceMoviePlayer } from "@/components/MultiSourceMoviePlayer";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Metadata } from "next";

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
}

interface MovieDetails extends TMDBMovie {
  imdb_id: string;
  credits?: { cast: CastMember[] };
  videos?: { results: { key: string; type: string }[] };
}

interface PageProps {
  params:
    | {
        id: string;
      }
    | Promise<{
        id: string;
      }>;
}

const dedupeProviders = (providers: TMDBWatchProvider[]): TMDBWatchProvider[] =>
  Array.from(new Map(providers.map((provider) => [provider.provider_id, provider])).values());

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  if (isNaN(movieId)) {
    return {
      title: "Movie - StreameX",
      description: "Watch movies on StreameX.",
    };
  }

  const movie = await getMovieDetails(movieId);
  if (!movie) {
    return {
      title: "Movie Not Found - StreameX",
      description: "This movie could not be found on StreameX.",
    };
  }

  return {
    title: `${movie.title} - StreameX`,
    description: movie.overview,
  };
}

export default async function MoviePage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  if (isNaN(movieId)) return <div className="p-20 text-center">Invalid Movie ID</div>;

  const movie: MovieDetails = await getMovieDetails(movieId);

  if (!movie) {
    return <div className="p-20 text-center">Movie not found</div>;
  }

  const watchProviders = await getMovieWatchProviders(movieId, "US");
  const freeProviders = dedupeProviders([...(watchProviders?.free ?? []), ...(watchProviders?.ads ?? [])]);
  const subscriptionProviders = dedupeProviders(watchProviders?.flatrate ?? []);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Backdrop */}
      <div className="relative h-[40vh] md:h-[60vh] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${getImageUrl(movie.backdrop_path, "original")})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-12 space-y-2 md:space-y-4 container mx-auto px-4">
          <h1 className="text-2xl md:text-6xl font-extrabold text-white font-montserrat uppercase drop-shadow-lg line-clamp-2">
            {movie.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm font-medium text-white/90">
            <span className="bg-primary text-black px-2 py-0.5 rounded text-[10px] font-bold">HD</span>
            <span>{movie.release_date?.split("-")[0]}</span>
            <span className="flex items-center text-yellow-500">★ {movie.vote_average.toFixed(1)}</span>
            {movie.genre_ids?.map((genreId: number) => (
              <span key={genreId} className="text-muted-foreground border border-white/20 px-2 py-0.5 rounded-full text-[10px]">Genre {genreId}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8 grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-4 md:gap-8">
        <div className="space-y-4 md:space-y-8">
          {/* Player */}
          <section id="watch">
            <MultiSourceMoviePlayer tmdbId={movie.id} imdbId={movie.imdb_id} />
          </section>

          {/* Synopsis */}
          <section className="space-y-3 md:space-y-4">
             <h2 className="text-lg md:text-2xl font-bold font-montserrat text-white border-l-4 border-primary pl-3">Synopsis</h2>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-lg">
              {movie.overview}
            </p>
          </section>

          {/* Cast */}
            {movie.credits?.cast && (
                 <section className="space-y-3 md:space-y-4">
                     <h2 className="text-lg md:text-2xl font-bold font-montserrat text-white border-l-4 border-primary pl-3">Cast</h2>
                     <div className="flex gap-2 md:gap-4 overflow-x-auto pb-4 scrollbar-hide">
                         {movie.credits.cast.slice(0, 10).map((actor: CastMember) => (
                             <div key={actor.id} className="w-20 md:w-24 flex-none space-y-1 md:space-y-2 text-center">
                                 <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-muted">
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
                                 <p className="text-[10px] md:text-xs font-medium truncate">{actor.name}</p>
                                 <p className="text-[9px] md:text-[10px] text-muted-foreground truncate">{actor.character}</p>
                             </div>
                         ))}
                     </div>
                 </section>
            )}
        </div>

        {/* Sidebar */}
        <div className="space-y-3 md:space-y-6">
            <div className="bg-card p-4 md:p-6 rounded-xl border border-border sticky top-24">
                <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 font-montserrat">Movie Info</h3>
                <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <dt className="text-muted-foreground">Original Title</dt>
                        <dd className="font-medium text-right">{movie.title}</dd>
                    </div>
                     <div className="flex justify-between">
                        <dt className="text-muted-foreground">Status</dt>
                        <dd className="font-medium">Released</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-muted-foreground">Language</dt>
                        <dd className="font-medium">English</dd>
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
