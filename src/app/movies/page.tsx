import { getAllPopularMovies, searchMovies } from "@/lib/tmdb";
import { MovieCard } from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface MoviesPageProps {
  searchParams:
    | {
        query?: string;
      }
    | Promise<{
        query?: string;
      }>;
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.query?.trim();
  const movies = query ? await searchMovies(query) : await getAllPopularMovies(15);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-montserrat uppercase text-white border-l-4 border-primary pl-3">
          {query ? `Search Results for "${query}"` : "All Movies"}
        </h1>
        
        <form className="w-full md:w-auto relative">
           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
           <Input 
             name="query"
             defaultValue={query}
             placeholder="Search movies..." 
             className="pl-8 w-full md:w-[300px] bg-muted/50 border-input focus:bg-background" 
           />
        </form>
      </div>

      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          No movies found. Try searching for something else.
        </div>
      )}
    </div>
  );
}
