"use client";

import { useState } from "react";
import { Server } from "lucide-react";
import { cn } from "@/lib/utils";

interface FootballPlayerProps {
  videoId?: string;
  streamUrl?: string;
  embedUrl?: string;
}

type SourceType = 'youtube' | 'embed' | 'iframe';

interface Source {
  name: string;
  type: SourceType;
  value: string;
}

export function FootballPlayer({ videoId, streamUrl, embedUrl }: FootballPlayerProps) {
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [customYouTubeId, setCustomYouTubeId] = useState("");
  const [showInput, setShowInput] = useState(!videoId || videoId.length < 5);

  const sources: Source[] = [];

  if (videoId && videoId.length > 5 && !showInput) {
    sources.push({
      name: "YouTube (Official)",
      type: "youtube",
      value: videoId,
    });
  }

  if (customYouTubeId && customYouTubeId.length > 5) {
    sources.push({
      name: "YouTube (Custom)",
      type: "youtube",
      value: customYouTubeId,
    });
  }

  if (streamUrl) {
    sources.push({
      name: "Stream Server",
      type: "embed",
      value: streamUrl,
    });
  }

  if (embedUrl) {
    sources.push({
      name: "Embed Player",
      type: "iframe",
      value: embedUrl,
    });
  }

  const currentSource = sources[currentSourceIndex];

  return (
    <div className="w-full space-y-4">
      {/* Video ID Input */}
      {showInput && (
        <div className="bg-muted p-4 rounded-lg space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">Enter YouTube Video ID:</label>
            <input
              type="text"
              placeholder="e.g., dQw4w9WgXcQ"
              value={customYouTubeId}
              onChange={(e) => setCustomYouTubeId(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Find it in YouTube URL: youtube.com/watch?v=<strong>VIDEO_ID</strong>
            </p>
          </div>
          {customYouTubeId.length > 5 && (
            <button
              onClick={() => setShowInput(false)}
              className="w-full bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition"
            >
              Load Video
            </button>
          )}
        </div>
      )}

      {/* Player */}
      {sources.length > 0 ? (
        <div className="w-full bg-black rounded-lg overflow-hidden">
          {currentSource ? (
            <>
              {currentSource.type === "youtube" && (
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full border-0"
                    src={`https://www.youtube.com/embed/${currentSource.value}?autoplay=1`}
                    title="Football Stream"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    sandbox="allow-same-origin allow-scripts allow-popups allow-presentation allow-modals allow-forms"
                  />
                </div>
              )}
              {currentSource.type === "embed" && (
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full border-0"
                    src={currentSource.value}
                    title="Football Stream"
                    allowFullScreen
                    sandbox="allow-same-origin allow-scripts allow-popups allow-presentation allow-modals"
                  />
                </div>
              )}
              {currentSource.type === "iframe" && (
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full border-0"
                    src={currentSource.value}
                    title="Football Stream"
                    allowFullScreen
                    sandbox="allow-same-origin allow-scripts allow-popups allow-presentation allow-modals"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Loading player...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full bg-muted rounded-lg p-8 text-center">
          <p className="text-muted-foreground text-sm">No stream available. Enter a YouTube video ID above to watch.</p>
        </div>
      )}

      {/* Source Selector */}
      {sources.length > 1 && (
        <div className="bg-muted rounded-lg p-4 space-y-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" /> Select Stream
            </h3>
            <span className="text-xs text-muted-foreground">Click to switch sources</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {sources.map((source, index) => (
              <button
                key={index}
                onClick={() => setCurrentSourceIndex(index)}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-all",
                  currentSourceIndex === index
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/30"
                )}
              >
                {source.name}
                {currentSourceIndex === index && " ✓"}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            If the video doesn&apos;t load, try switching to another source.
          </p>
        </div>
      )}
    </div>
  );
}
