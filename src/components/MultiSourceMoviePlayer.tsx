"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server, MonitorPlay } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSourceProps {
  tmdbId: number;
  imdbId?: string;
  season?: number;
  episode?: number;
}

const SOURCES = [
  {
    id: "vidlink",
    name: "VidLink (Recommended)",
    getUrl: ({ tmdbId, season, episode }: MultiSourceProps) =>
       season && episode
        ? `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`
        : `https://vidlink.pro/movie/${tmdbId}`,
  },
  {
    id: "vidsrc-me",
    name: "VidSrc.me",
    getUrl: ({ tmdbId, season, episode }: MultiSourceProps) =>
      season && episode
        ? `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`
        : `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`,
  },
  {
    id: "vidsrc-xyz",
    name: "VidSrc.xyz",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getUrl: ({ imdbId, tmdbId, season, episode }: MultiSourceProps) =>
      season && episode
        ? `https://vidsrc.xyz/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`
        : `https://vidsrc.xyz/embed/movie?tmdb=${tmdbId}`,
  },
  {
    id: "2embed",
    name: "2Embed",
    getUrl: ({ imdbId, tmdbId, season, episode }: MultiSourceProps) =>
       season && episode
        ? `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`
        : `https://www.2embed.cc/embed/${imdbId || tmdbId}`,
  },
  {
    id: "autoembed",
    name: "AutoEmbed",
    getUrl: ({ tmdbId, season, episode }: MultiSourceProps) =>
       season && episode
        ? `https://autoembed.co/tv/tmdb/${tmdbId}-${season}-${episode}`
        : `https://autoembed.co/movie/tmdb/${tmdbId}`,
  },
  {
    id: "superembed",
    name: "SuperEmbed",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getUrl: ({ imdbId, tmdbId, season, episode }: MultiSourceProps) =>
       season && episode
         ? `https://multiembed.mov/?video_id=${imdbId}&tmdb=1&s=${season}&e=${episode}`
         : `https://multiembed.mov/?video_id=${imdbId}&tmdb=1`,
  },
];

export function MultiSourceMoviePlayer(props: MultiSourceProps) {
  const [activeSource, setActiveSource] = useState(SOURCES[0].id);
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative w-full overflow-hidden rounded-xl bg-black shadow-lg shadow-blue-500/10 border border-white/10" style={{ paddingBottom: "56.25%" }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <div className="text-center">
              <div className="animate-spin mb-4">⏳</div>
              <p className="text-white text-sm">Loading stream...</p>
            </div>
          </div>
        )}
        <iframe
          src={SOURCES.find((s) => s.id === activeSource)?.getUrl(props)}
          className="absolute top-0 left-0 w-full h-full border-0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          sandbox="allow-same-origin allow-scripts allow-popups allow-presentation allow-modals allow-forms"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>

      <div className="bg-card rounded-lg p-3 md:p-4 border border-border space-y-3">
        <div className="space-y-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h3 className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Server className="w-3 h-3 md:w-4 md:h-4 text-primary" /> Select Server
            </h3>
            <span className="text-[10px] md:text-xs text-muted-foreground">If current server fails, try another one.</span>
          </div>
        </div>

        <Tabs value={activeSource} onValueChange={(value) => {
          setActiveSource(value);
          setIsLoading(true);
        }} className="w-full">
          <TabsList className="flex flex-wrap h-auto bg-muted/50 p-1 gap-1 md:gap-2 justify-start">
            {SOURCES.map((source) => (
              <TabsTrigger
                key={source.id}
                value={source.id}
                className={cn(
                  "flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-[10px] md:text-sm font-medium",
                  activeSource === source.id && "shadow-lg shadow-primary/20"
                )}
              >
                <MonitorPlay className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">{source.name}</span>
                <span className="sm:hidden">{source.name.split(" ")[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="bg-muted/30 p-3 rounded-lg text-[10px] md:text-xs text-muted-foreground space-y-2">
          <p className="font-semibold">⚠️ Stream not working?</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Try switching to a different server (one above)</li>
            <li>Clear your browser cache and reload</li>
            <li>Disable adblocker if you have one</li>
            <li>Some streams may not be available for all movies</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
