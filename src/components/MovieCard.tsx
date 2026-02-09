import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { TMDBMovie, getImageUrl } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: TMDBMovie;
  className?: string;
}

export function MovieCard({ movie, className }: MovieCardProps) {
  const imageUrl = getImageUrl(movie.poster_path);

  return (
    <Link href={`/movies/${movie.id}`} className={cn("group block space-y-3", className)}>
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted transition-transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/20">
        <Image
          src={imageUrl}
          alt={movie.title}
          fill
          className="object-cover transition-opacity group-hover:opacity-90"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-md flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          {movie.vote_average.toFixed(1)}
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold leading-none truncate text-white">{movie.title}</h3>
        <p className="text-xs text-muted-foreground">{movie.release_date?.split("-")[0] || "Unknown"}</p>
      </div>
    </Link>
  );
}
