import { FootballPlayer } from "@/components/FootballPlayer";
import { Metadata } from "next";

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Watch Football - StreameX`,
    description: "Watch live football matches and highlights.",
  };
}

export default function MatchPage({ params }: PageProps) {
  // In a real app we'd fetch video details here using `params.id`
  // But YouTube API `videos.list` endpoint would require another function in lib/youtube.ts
  // For now, we just pass the ID to the player.

  return (
    <div className="min-h-screen bg-background pb-20 container mx-auto px-4 py-8">
       <div className="space-y-6">
           <h1 className="text-2xl md:text-3xl font-bold font-montserrat uppercase text-white">
            Watch Match
           </h1>
           
           <FootballPlayer videoId={params.id} />
           
           <div className="bg-card p-6 rounded-xl border border-border">
               <h2 className="text-xl font-bold mb-2">Match Stream</h2>
               <p className="text-muted-foreground">
                   You are watching a stream via YouTube. If the stream is offline, try selecting a different source or check back later.
               </p>
           </div>
       </div>
    </div>
  );
}
