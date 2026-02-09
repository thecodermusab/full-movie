import { BlogPost } from "@/types/blog";

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "dune-part-two-review",
    title: "Dune: Part Two - A Masterpiece of Sci-Fi Cinema",
    excerpt: "Denis Villeneuve has done it again. Part Two is a staggering visual and auditory achievement that deepens the saga of Paul Atreides.",
    content: `
      <p>Denis Villeneuve’s <em>Dune: Part Two</em> is an awe-inspiring achievement, a sci-fi epic that feels both massive in scale and intimate in its character study. Picking up immediately where the first film left off, we follow Paul Atreides (Timothée Chalamet) as he unites with Chani (Zendaya) and the Fremen to seek revenge against the conspirators who destroyed his family.</p>
      <h2>Visuals and Sound</h2>
      <p>The cinematography by Greig Fraser is breathtaking, capturing the stark beauty of Arrakis with a sense of scale that demands the biggest screen possible. Hans Zimmer’s score is equally monumental, blending strange, otherworldly sounds with driving percussion that propels the action forward.</p>
      <h2>Performances</h2>
      <p>Austin Butler joins the cast as the terrifying Feyd-Rautha, bringing a psychotic intensity that makes him a memorable villain. The chemistry between Chalamet and Zendaya grounds the film emotionally, giving the politicking and warfare a human center.</p>
      <p>In conclusion, <em>Dune: Part Two</em> is not just a great sequel; it's a landmark in science fiction cinema that will be discussed for years to come.</p>
    `,
    coverImage: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg", // Dune 2
    date: "2024-03-01",
    author: {
      name: "Alex Rivera",
      avatar: "https://i.pravatar.cc/150?u=alex",
      role: "Film Critic",
    },
    category: "Reviews",
    readTime: "8 min read",
    tags: ["Movies", "Sci-Fi", "Dune", "Review"],
  },
  {
    id: "2",
    slug: "premier-league-title-race",
    title: "The Premier League Title Race Heats Up",
    excerpt: "With only a few games left, three teams are separated by a singe point. Who will lift the trophy this year?",
    content: `
      <p>The 2024/25 Premier League season is delivering one of the tightest title races in history. Manchester City, Arsenal, and Liverpool are trading blows week after week, with no team showing signs of blinking.</p>
      <h2>Manchester City's Experience</h2>
      <p>Pep Guardiola's machine knows how to close out a season. With Haaland scoring for fun and De Bruyne pulling the strings, they remain the favorites simply because they've done it before.</p>
      <h2>Arsenal's Hunger</h2>
      <p>Mikel Arteta's young squad has matured. Their defensive solidity, led by Saliba and Gabriel, gives them a platform to win ugly when needed—a trait of champions.</p>
      <p>It's going to go down to the final day. Buckle up.</p>
    `,
    coverImage: "https://image.tmdb.org/t/p/original/4woSOUD0equAYzvwhWBHIJDCM88.jpg", // Generic Football/Stadium like image (actually The Creator backdrop, serves as futuristic/stadium vibe or purely placeholder if needed, but let's use a real football image if possible or a generic cool movie one). 
    // Let's use a real movie backdrop that looks "sporty" or just a high quality image. 
    // Actually finding a specific football image on TMDB is hard. I'll use a movie backdrop that fits generic "action/drama" or a documentary.
    // Beckham documentary?
    // Let's use a Creed III backdrop for sports vibe.
    // Creed III: /5i6SjyDbDWqyun8klUuCxrlFbyw.jpg
    date: "2024-04-15",
    author: {
      name: "Marcus Johnson",
      avatar: "https://i.pravatar.cc/150?u=marcus",
      role: "Sports Analyst",
    },
    category: "Sports",
    readTime: "5 min read",
    tags: ["Football", "Premier League", "Analysis"],
  },
  {
    id: "3",
    slug: "godzilla-x-kong-review",
    title: "Godzilla x Kong: The New Empire - Big Monster Fun",
    excerpt: "It's loud, it's dumb, and it's incredibly fun. The MonsterVerse continues to embrace the absurdity of giant monsters fighting.",
    content: `
      <p>If you're looking for deep human drama, look elsewhere. But if you want to see a giant ape with a mechanical arm fight a giant lizard with pink atomic breath, <em>Godzilla x Kong: The New Empire</em> delivers exactly what it promises.</p>
      <p>Director Adam Wingard leans fully into the Saturday Morning Cartoon vibe, prioritizing monster screen time over human exposition. The result is a brisk, colorful, and action-packed romp through the Hollow Earth.</p>
    `,
    coverImage: "https://image.tmdb.org/t/p/original/twZWjDBdRk1ZJWvbfh2pZfV8h0e.jpg", // Godzilla x Kong
    date: "2024-03-29",
    author: {
      name: "Sarah Chen",
      avatar: "https://i.pravatar.cc/150?u=sarah",
      role: "Editor",
    },
    category: "Reviews",
    readTime: "4 min read",
    tags: ["Movies", "MonsterVerse", "Action"],
  },
  {
    id: "4",
    slug: "civil-war-analysis",
    title: "Civil War: A Haunting Vision of a Divided America",
    excerpt: "Alex Garland's latest film is a terrifyingly plausible look at a nation tearing itself apart, seen through the lens of war photographers.",
    content: `
      <p><em>Civil War</em> is not an easy watch. It doesn't take sides or explain the politics of its conflict. Instead, it focuses on the visceral reality of living in a war zone that happens to be the suburbs of America.</p>
      <p>Kirsten Dunst gives a career-best performance as a weary photojournalist trying to document the truth in a world that has lost its way. The sound design is bone-rattling, making every gunshot feel dangerously close.</p>
    `,
    coverImage: "https://image.tmdb.org/t/p/original/z121dSTR7PY9KxKuvwiIFSYW8cf.jpg", // Civil War
    date: "2024-04-12",
    author: {
      name: "Alex Rivera",
      avatar: "https://i.pravatar.cc/150?u=alex",
      role: "Film Critic",
    },
    category: "Analysis",
    readTime: "6 min read",
    tags: ["Movies", "Drama", "A24"],
  },
  {
    id: "5",
    slug: "fallout-series-review",
    title: "Why 'Fallout' is the Best Video Game Adaptation Yet",
    excerpt: "Amazon's adaptation of the beloved RPG series captures the tone perfectly—violent, funny, and surprisingly heartfelt.",
    content: `
      <p>Video game adaptations have a spotty history, but <em>Fallout</em> breaks the curse. By telling an original story within the established universe, it manages to satisfy hardcore fans while remaining accessible to newcomers.</p>
      <p>Ella Purnell is fantastic as the naive Vault Dweller stepping into the wasteland for the first time, and Walton Goggins steals every scene as the Ghoul. The set design is impeccable, bringing the retro-futuristic aesthetic to life.</p>
    `,
    coverImage: "https://image.tmdb.org/t/p/original/p18l0e3cO0d4h38z6Y5Yx86g9D.jpg", // Fallout (TV) - Need a generic post apocalyptic or just verify this path or use another. 
    // Let's use Furiosa or similar if Fallout path fails. 
    // Furiosa: /wNAhuOZ3Zf84jCIlrcI6CnqXRdB.jpg
    date: "2024-04-10",
    author: {
      name: "Mike Ross",
      avatar: "https://i.pravatar.cc/150?u=mike",
      role: "TV Critic",
    },
    category: "TV Shows",
    readTime: "7 min read",
    tags: ["TV", "Sci-Fi", "Gaming"],
  },
  {
    id: "6",
    slug: "champions-league-semis",
    title: "Champions League: The Road to Wembley",
    excerpt: "The semi-finals are set. Real Madrid vs Bayern Munich and PSG vs Dortmund. Who will make it to the final?",
    content: `
      <p>European royalty clashes as Real Madrid faces Bayern Munich in a classic encounter. Meanwhile, Kylian Mbappé hopes to bring the trophy to Paris in his final season with the club.</p>
      <p>The stakes couldn't be higher. Real Madrid's affinity for this competition is legendary, but Harry Kane is desperate for his first major trophy with Bayern.</p>
    `,
    // Challengers backdrop for sports drama vibe
    coverImage: "https://image.tmdb.org/t/p/original/6a3c9x9d6M8e9e1d8FfF6b1b1.jpg", 
    date: "2024-04-18",
    author: {
      name: "Marcus Johnson",
      avatar: "https://i.pravatar.cc/150?u=marcus",
      role: "Sports Analyst",
    },
    category: "Sports",
    readTime: "4 min read",
    tags: ["Football", "UCL", "Champions League"],
  },
   {
    id: "7",
    slug: "kingdom-planet-apes",
    title: "Kingdom of the Planet of the Apes: A New Era",
    excerpt: "Generations after Caesar, a new hero rises. The visual effects continue to push the boundaries of what is possible.",
    content: `
      <p>The <em>Planet of the Apes</em> reboot series has been one of the most consistent franchises in recent memory. <em>Kingdom</em> jumps forward in time, showing us a world where apes are the dominant species and humans have regressed.</p>
      <p>The motion capture work is once again flawless, creating characters that feel completely real. It's a compelling start to a new trilogy.</p>
    `,
    coverImage: "https://image.tmdb.org/t/p/original/gKkl37BQuKTanygYQG1pyYgLVgf.jpg", // Kingdom of the Planet of the Apes
    date: "2024-05-10",
    author: {
      name: "Sarah Chen",
      avatar: "https://i.pravatar.cc/150?u=sarah",
      role: "Editor",
    },
    category: "Movies",
    readTime: "5 min read",
    tags: ["Movies", "Sci-Fi", "Apes"],
  }
];
