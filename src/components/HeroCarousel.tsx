"use client";

import * as React from "react";
import Link from "next/link";
import { Play, Info } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { TMDBMovie, getImageUrl } from "@/lib/tmdb";
import Autoplay from "embla-carousel-autoplay";

interface HeroCarouselProps {
  movies: TMDBMovie[];
}

export function HeroCarousel({ movies }: HeroCarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {movies.slice(0, 5).map((movie) => (
            <CarouselItem key={movie.id} className="relative h-[50vh] md:h-[70vh] w-full">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${getImageUrl(movie.backdrop_path, "original")})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
              </div>

              <div className="relative container mx-auto flex h-full items-end pb-12 px-4 md:pb-24">
                <div className="max-w-2xl space-y-4">
                  <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl font-montserrat uppercase drop-shadow-md">
                    {movie.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm font-medium text-white/90">
                    <span className="bg-primary px-2 py-1 text-xs font-bold text-black rounded">HD</span>
                    <span>{movie.release_date?.split("-")[0]}</span>
                    <span className="flex items-center text-yellow-500">
                      ★ {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                  <p className="line-clamp-3 text-lg text-muted-foreground md:text-xl drop-shadow-sm max-w-xl">
                    {movie.overview}
                  </p>
                  <div className="flex items-center space-x-4 pt-4">
                    <Button size="lg" className="rounded-full px-8 font-bold text-base" asChild>
                      <Link href={`/movies/${movie.id}`}>
                        <Play className="mr-2 h-5 w-5 fill-current" /> Watch Now
                      </Link>
                    </Button>
                    <Button size="lg" variant="secondary" className="rounded-full px-8 font-bold text-base bg-white/20 backdrop-blur hover:bg-white/30 text-white" asChild>
                      <Link href={`/movies/${movie.id}`}>
                        <Info className="mr-2 h-5 w-5" /> More Info
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 hidden md:flex border-none bg-background/50 hover:bg-primary hover:text-black" />
        <CarouselNext className="right-4 hidden md:flex border-none bg-background/50 hover:bg-primary hover:text-black" />
      </Carousel>
    </section>
  );
}
