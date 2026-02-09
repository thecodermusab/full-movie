import Image from "next/image";
import Link from "next/link";
import { YouTubeVideo } from "@/lib/youtube";

interface FootballMatchCardProps {
  video?: YouTubeVideo;
  id?: string;
  homeTeam?: string;
  awayTeam?: string;
  homeScore?: number | null;
  awayScore?: number | null;
  matchDate?: string | Date;
  status?: "UPCOMING" | "LIVE" | "COMPLETED";
  thumbnailUrl?: string | null;
  league?: string;
  className?: string;
}

export function FootballMatchCard({
  video,
  id,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  matchDate,
  status,
  thumbnailUrl,
  league = "Football",
  className,
}: FootballMatchCardProps) {
  // If video prop is passed (from YouTube API)
  if (video) {
    const videoId = video.id.videoId;
    const title = video.snippet.title;
    const thumbnailUrl = video.snippet.thumbnails.high?.url;

    return (
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative block overflow-hidden rounded-xl bg-muted transition-all hover:shadow-lg hover:shadow-primary/20 hover:scale-105 cursor-pointer ${className || ""}`}
      >
        {/* Thumbnail Background */}
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            width={400}
            height={225}
            className="w-full h-auto object-cover transition-opacity group-hover:opacity-75"
          />
        ) : (
          <div className="w-full aspect-video bg-gradient-to-br from-primary/20 to-secondary/20" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <p className="text-sm font-bold text-white line-clamp-2">{title}</p>
          <p className="text-xs text-white/70 mt-2">Click to watch on YouTube</p>
        </div>

        {/* Live Badge */}
        <div className="absolute top-2 right-2 flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-bold text-red-500 uppercase bg-black/60 px-2 py-1 rounded">Live</span>
        </div>
      </a>
    );
  }

  // If regular match props are passed (for database matches)
  const matchId = id || "";
  const isLive = status === "LIVE";
  const date = matchDate ? new Date(matchDate) : new Date();

  return (
    <Link
      href={`/football/${matchId}`}
      className={`group relative block overflow-hidden rounded-xl bg-muted transition-all hover:shadow-lg hover:shadow-primary/20 hover:scale-105 ${className || ""}`}
    >
      {/* Thumbnail Background */}
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={`${homeTeam} vs ${awayTeam}`}
          fill
          className="object-cover transition-opacity group-hover:opacity-75"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative flex flex-col h-full p-4 space-y-3">
        {/* League & Date */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-white/70 uppercase tracking-widest">{league}</p>
          <p className="text-xs text-white/60">
            {date.toLocaleDateString()} · {date.toLocaleTimeString()}
          </p>
        </div>

        {/* Match Info */}
        <div className="flex-1 flex flex-col justify-center items-center space-y-2">
          {/* Home Team */}
          <p className="text-sm font-bold text-white text-center">{homeTeam || "Team 1"}</p>

          {/* Score or VS */}
          {homeScore !== null && homeScore !== undefined && awayScore !== null && awayScore !== undefined ? (
            <div className="text-2xl font-black text-white">
              {homeScore} - {awayScore}
            </div>
          ) : (
            <div className="text-lg font-bold text-white/60">VS</div>
          )}

          {/* Away Team */}
          <p className="text-sm font-bold text-white text-center">{awayTeam || "Team 2"}</p>
        </div>

        {/* Live Badge */}
        {isLive && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-red-500 uppercase">Live</span>
          </div>
        )}
      </div>
    </Link>
  );
}
