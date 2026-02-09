import { HeroCarousel } from "@/components/HeroCarousel";
import { MovieCard } from "@/components/MovieCard";
import { getTrendingMovies, getPopularMovies, getTopRatedMovies, TMDBMovie } from "@/lib/tmdb";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface MovieSectionProps {
  title: string;
  movies: TMDBMovie[];
  href?: string;
}

function MovieSection({ title, movies, href = "#" }: MovieSectionProps) {
  return (
    <section className="space-y-4 py-8">
      <div className="flex items-center justify-between px-4 container mx-auto">
        <h2 className="text-2xl font-bold tracking-tight text-white font-montserrat uppercase border-l-4 border-primary pl-3">
          {title}
        </h2>
        <Link
          href={href}
          className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center transition-colors"
        >
          View All <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4 px-4 container mx-auto scrollbar-hide">
          {movies.map((movie) => (
            <div key={movie.id} className="w-[160px] flex-none md:w-[200px]">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  const trendingMovies = await getTrendingMovies();
  const popularMovies = await getPopularMovies();
  const topRatedMovies = await getTopRatedMovies();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <HeroCarousel movies={trendingMovies} />

      <div className="space-y-8 mt-8">
        <MovieSection title="Trending Now" movies={trendingMovies} href="/movies?sort=trending" />
        <MovieSection title="Popular Movies" movies={popularMovies} href="/movies?sort=popular" />
        <MovieSection title="Top Rated" movies={topRatedMovies} href="/movies?sort=top_rated" />
      </div>
    </div>
  );
}
