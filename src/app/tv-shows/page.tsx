import Image from "next/image";
import { getAllPopularTVShows, searchTVShows, TMDBTVShow, getImageUrl } from "@/lib/tmdb";
import { Input } from "@/components/ui/input";
import { Search, Star } from "lucide-react";
import Link from "next/link";

interface PageProps {
  searchParams:
    | {
        query?: string;
      }
    | Promise<{
        query?: string;
      }>;
}

function TVShowCard({ show }: { show: TMDBTVShow }) {
  const imageUrl = getImageUrl(show.poster_path);

  return (
    <Link href={`/tv-shows/${show.id}`} className="group block space-y-3">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted transition-transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/20">
        <Image
          src={imageUrl}
          alt={show.name}
          fill
          className="object-cover transition-opacity group-hover:opacity-90"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-md flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          {show.vote_average.toFixed(1)}
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold leading-none truncate text-white">{show.name}</h3>
        <p className="text-xs text-muted-foreground">
          {show.first_air_date?.split("-")[0] || "Unknown"}
        </p>
      </div>
    </Link>
  );
}

export default async function TVShowsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params?.query;

  const shows: TMDBTVShow[] = query
    ? await searchTVShows(query)
    : await getAllPopularTVShows();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">TV Shows</h1>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <form action="/tv-shows" method="GET">
            <Input
              type="text"
              placeholder="Search shows..."
              name="query"
              defaultValue={query}
              className="pl-10"
            />
          </form>
        </div>

        {/* Grid */}
        {shows && shows.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {shows.map((show) => (
              <TVShowCard key={show.id} show={show} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No shows found</p>
          </div>
        )}
      </div>
    </div>
  );
}
