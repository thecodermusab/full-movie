I want to build a complete Somali movie and football streaming website with the following setup:

# PROJECT OVERVIEW

Build a full-stack streaming platform with:

1. **Movies Section** - Somali-dubbed Bollywood movies with multiple FREE streaming sources
2. **Football Section** - Live matches, highlights, and replays with YouTube integration
3. **Multi-source video players** - Users can switch between sources if one fails
4. **Admin panel** - Easy content management
5. **Monetization** - Ads, ad-blocker detection, premium subscriptions, VPN affiliates

# TECH STACK

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API routes, Prisma ORM
- **Database:** PostgreSQL (Neon)
- **Auth:** NextAuth.js (email/password + Google OAuth)
- **Storage:** Cloudflare R2 for self-hosted videos (optional), VidSrc for FREE embedding
- **Video Player:** Video.js with custom controls
- **Deployment:** Vercel (frontend) + Neon (database)

# ENVIRONMENT VARIABLES I HAVE

```env
# TMDB (for movie metadata)
TMDB_API_KEY="0e12c42604cb0be5a532a922e0928ba7"
TMDB_API_READ_ACCESS_TOKEN="eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZTEyYzQyNjA0Y2IwYmU1YTUzMmE5MjJlMDkyOGJhNyIsIm5iZiI6MTc3MDU4NzcxMi4xNTgwMDAyLCJzdWIiOiI2OTg5MDY0MGU3ZjExNGZjMDk4ZmQyOTgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ALCHV_5-66YYLILsWKWkGdMT7CkqUiSnADR_kYGTfZk"
NEXT_PUBLIC_TMDB_API_KEY="0e12c42604cb0be5a532a922e0928ba7"

# YouTube (for football streams)
YOUTUBE_API_KEY=AIzaSyDoiAQYWIBmgvJ05r5sw82ELK-amhNJ1FA

# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

# Storage (optional - only if I upload my own videos)
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
```

# COMPLETE DATABASE SCHEMA

```prisma
// === USER & AUTH ===

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  password      String?
  image         String?
  role          UserRole  @default(USER)

  // Premium
  isPremium     Boolean   @default(false)
  premiumUntil  DateTime?

  // Relations
  accounts      Account[]
  sessions      Session[]
  watchHistory  WatchHistory[]
  favorites     Favorite[]
  ratings       Rating[]
  comments      Comment[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum UserRole {
  USER
  ADMIN
}

// === MOVIES ===

model Movie {
  id              String    @id @default(cuid())
  title           String
  titleSomali     String?
  slug            String    @unique
  description     String    @db.Text
  year            Int
  duration        Int       // minutes
  genre           String[]
  director        String?
  cast            String[]
  rating          Float     @default(0)

  // TMDB Integration
  tmdbId          String    @unique
  imdbId          String?

  // Images from TMDB
  posterUrl       String
  backdropUrl     String?

  // Video Hosting Strategy
  hostingType     HostingType @default(EMBEDDED)
  videoUrl        String?     // If SELF_HOSTED (R2/GCS)

  // Metadata
  views           Int       @default(0)
  isPremium       Boolean   @default(false)
  featured        Boolean   @default(false)
  status          Status    @default(PUBLISHED)

  // Relations
  watchHistory    WatchHistory[]
  favorites       Favorite[]
  ratings         Rating[]
  comments        Comment[]

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum HostingType {
  EMBEDDED        // VidSrc, 2Embed, etc. (FREE)
  SELF_HOSTED     // R2/GCS (PAID)
  HYBRID          // Top movies self-hosted, rest embedded
}

enum Status {
  DRAFT
  PUBLISHED
  ARCHIVED
}

// === TV SHOWS ===

model TVShow {
  id              String    @id @default(cuid())
  title           String
  titleSomali     String?
  slug            String    @unique
  description     String    @db.Text
  year            Int
  genre           String[]
  rating          Float     @default(0)

  // TMDB Integration
  tmdbId          String    @unique
  imdbId          String?

  // Images
  posterUrl       String
  backdropUrl     String?

  // Metadata
  totalSeasons    Int
  status          ShowStatus @default(ONGOING)
  featured        Boolean   @default(false)

  // Relations
  seasons         Season[]
  favorites       Favorite[]
  ratings         Rating[]

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model Season {
  id              String    @id @default(cuid())
  showId          String
  show            TVShow    @relation(fields: [showId], references: [id], onDelete: Cascade)

  seasonNumber    Int
  title           String?
  description     String?   @db.Text
  posterUrl       String?

  episodes        Episode[]

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@unique([showId, seasonNumber])
}

model Episode {
  id              String    @id @default(cuid())
  seasonId        String
  season          Season    @relation(fields: [seasonId], references: [id], onDelete: Cascade)

  episodeNumber   Int
  title           String
  titleSomali     String?
  description     String?   @db.Text
  duration        Int       // minutes

  // TMDB
  tmdbId          String?
  imdbId          String?

  // Video
  hostingType     HostingType @default(EMBEDDED)
  videoUrl        String?
  thumbnailUrl    String?

  // Metadata
  airDate         DateTime?
  views           Int       @default(0)

  // Relations
  watchHistory    WatchHistory[]

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@unique([seasonId, episodeNumber])
}

enum ShowStatus {
  ONGOING
  COMPLETED
  CANCELLED
}

// === FOOTBALL ===

model FootballMatch {
  id              String        @id @default(cuid())
  title           String        // "Liverpool vs Man United"
  slug            String        @unique
  league          String        // "Premier League", "La Liga"

  // Teams
  homeTeam        String
  awayTeam        String
  homeTeamLogo    String?
  awayTeamLogo    String?
  homeScore       Int?
  awayScore       Int?

  // Match Info
  matchDate       DateTime
  venue           String?

  // Streaming
  streamSources   StreamSource[]

  // Type & Status
  type            MatchType     @default(LIVE)
  status          MatchStatus   @default(UPCOMING)

  // Images
  thumbnailUrl    String?

  // Metadata
  views           Int           @default(0)
  featured        Boolean       @default(false)

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

model StreamSource {
  id          String        @id @default(cuid())
  matchId     String
  match       FootballMatch @relation(fields: [matchId], references: [id], onDelete: Cascade)

  name        String        // "YouTube Official", "StreamEast", "CricHD"
  url         String        // Full URL or YouTube video ID
  type        StreamType    @default(EMBED)
  quality     String?       // "HD", "1080p", "720p"
  language    String?       // "English", "Spanish", "Somali"
  isOfficial  Boolean       @default(false)
  isActive    Boolean       @default(true)

  createdAt   DateTime      @default(now())
}

enum MatchType {
  LIVE
  HIGHLIGHTS
  FULL_MATCH
}

enum MatchStatus {
  UPCOMING
  LIVE
  COMPLETED
}

enum StreamType {
  YOUTUBE
  EMBED
  IFRAME
}

// === BLOG ===

model BlogPost {
  id              String    @id @default(cuid())
  title           String
  slug            String    @unique
  content         String    @db.Text
  excerpt         String?

  // Images
  featuredImage   String?

  // SEO
  metaTitle       String?
  metaDescription String?

  // Organization
  category        String?
  tags            String[]

  // Metadata
  views           Int       @default(0)
  featured        Boolean   @default(false)
  status          Status    @default(PUBLISHED)
  publishedAt     DateTime?

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

// === USER INTERACTIONS ===

model WatchHistory {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  movieId     String?
  movie       Movie?    @relation(fields: [movieId], references: [id], onDelete: Cascade)

  episodeId   String?
  episode     Episode?  @relation(fields: [episodeId], references: [id], onDelete: Cascade)

  progress    Int       // seconds watched
  completed   Boolean   @default(false)
  lastWatched DateTime  @default(now())

  @@unique([userId, movieId])
  @@unique([userId, episodeId])
}

model Favorite {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  movieId   String?
  movie     Movie?    @relation(fields: [movieId], references: [id], onDelete: Cascade)

  showId    String?
  show      TVShow?   @relation(fields: [showId], references: [id], onDelete: Cascade)

  createdAt DateTime  @default(now())

  @@unique([userId, movieId])
  @@unique([userId, showId])
}

model Rating {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  movieId   String?
  movie     Movie?    @relation(fields: [movieId], references: [id], onDelete: Cascade)

  showId    String?
  show      TVShow?   @relation(fields: [showId], references: [id], onDelete: Cascade)

  rating    Int       // 1-5 stars
  review    String?   @db.Text

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@unique([userId, movieId])
  @@unique([userId, showId])
}

model Comment {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  movieId   String?
  movie     Movie?    @relation(fields: [movieId], references: [id], onDelete: Cascade)

  content   String    @db.Text
  likes     Int       @default(0)

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

// === ANALYTICS ===

model Analytics {
  id          String    @id @default(cuid())
  date        DateTime  @default(now())

  // Traffic
  pageViews   Int       @default(0)
  visitors    Int       @default(0)

  // Revenue
  adRevenue   Float     @default(0)
  premiumRevenue Float  @default(0)
  vpnRevenue  Float     @default(0)

  // Content
  movieViews  Int       @default(0)
  footballViews Int     @default(0)

  @@unique([date])
}
```

# CORE FEATURES

## 1. MOVIES SECTION

### Multi-Source Movie Player Component

Create `components/MultiSourceMoviePlayer.tsx` that:

- Uses **6 FREE embedding services** as video sources:
  1. **VidSrc.me** (Primary) - `vidsrc.me/embed/movie?tmdb={tmdbId}`
  2. **VidSrc.xyz** (Backup 1) - `vidsrc.xyz/embed/movie/{imdbId}`
  3. **2Embed** (Backup 2) - `2embed.cc/embed/{imdbId}`
  4. **SuperEmbed** (Backup 3) - `multiembed.mov/?video_id={imdbId}&tmdb=1`
  5. **AutoEmbed** (Backup 4) - `autoembed.co/movie/tmdb/{tmdbId}`
  6. **VidLink** (Backup 5) - `vidlink.pro/movie/{tmdbId}`

Features:

- Tab-based source selector (horizontal scrollable on mobile)
- Active tab highlighted in blue (#3B82F6)
- Loading spinner while iframe loads
- "If video doesn't load, try switching sources" message
- Display current source name
- Responsive design with dark mode
- Full-screen support
- Checkmark (✓) on active source

### Movie Pages

**Homepage** (`/`):

- Hero carousel with featured movies
- Horizontal scrolling sections:
  - New Releases
  - Trending
  - Popular
  - By Genre
- Netflix-style hover effects

**Movies Page** (`/movies`):

- Grid view with filters
- Search functionality
- Filter by: genre, year, rating
- Sort by: newest, popular, rating
- Pagination

**Movie Detail Page** (`/movies/[slug]`):

- Large backdrop image with gradient overlay
- Movie info (title, year, duration, rating, genre)
- Multi-source video player
- Synopsis
- Cast & crew
- Related movies
- Comments section
- Watchlist button (heart icon)

### Admin - Movies

**Add Movie** (`/admin/movies/new`):

1. Search TMDB by title
2. Select movie from results
3. Auto-fill: title, description, year, poster, backdrop, TMDB ID, IMDB ID, rating, cast
4. Add Somali title (required)
5. Choose hosting type:
   - EMBEDDED (free - uses VidSrc)
   - SELF_HOSTED (upload to R2)
6. Submit

**Edit Movie** (`/admin/movies/[id]/edit`):

- Update all fields
- Change hosting type
- Upload video if self-hosted

## 2. FOOTBALL SECTION

### Multi-Source Football Player Component

Create `components/FootballPlayer.tsx` that:

- Supports **multiple stream sources** per match
- Source types:
  - **YouTube** (official, legal streams)
  - **Embed** (StreamEast, CricHD, VIPLeague, etc.)
  - **Iframe** (any embed URL)
- Features:
  - Source tabs with "Official" badge for YouTube
  - Pulsing red "LIVE" indicator for live matches
  - Quality & language indicators
  - Auto-extract YouTube video ID from URLs
  - Switch sources if one fails
  - Loading states

### Football Pages

**Main Football Page** (`/football`):

- Three sections:
  1. **Live Now** - Currently live matches (auto-refresh every 30s)
  2. **Upcoming** - Future matches with countdown timers
  3. **Highlights** - Completed matches/replays

**Football Match Card** (`components/FootballMatchCard.tsx`):

- Team logos (left & right)
- "VS" or current score in middle
- League name
- Match date/time
- LIVE badge (pulsing animation)
- Hover effect (scale-105)
- Click to watch

**Match Detail Page** (`/football/[slug]`):

- Large team logos
- Current score (if live/completed)
- League, venue, date
- LIVE indicator (if live)
- Multi-source football player
- Match details section

### Admin - Football

**Add Match** (`/admin/football/new`):

Two methods:

**Method 1: Search YouTube**

- Input search query
- Search YouTube API for live streams
- Show results with thumbnails
- Click to auto-fill match details
- Add additional sources if needed

**Method 2: Manual Entry**

- Home team, away team
- League (dropdown)
- Match date & time
- Match type (LIVE, HIGHLIGHTS, FULL_MATCH)
- Status (UPCOMING, LIVE, COMPLETED)
- Add multiple stream sources:
  - Name (e.g., "YouTube Official", "StreamEast")
  - URL or YouTube video ID
  - Type (YouTube, Embed, Iframe)
  - Quality (optional)
  - Language (optional)
  - Is Official? (checkbox)
- Button: "+ Add Another Source"

**Edit Match** (`/admin/football/[id]/edit`):

- Update match details
- Update scores
- Add/remove/edit sources
- Change status

## 3. ADMIN DASHBOARD

**Dashboard** (`/admin`):

- Stats cards:
  - Total movies
  - Total users
  - Monthly revenue
  - Total views
- Recent uploads
- Popular content (top 10)
- Quick actions (Add Movie, Add Match)

**Analytics** (`/admin/analytics`):

- Traffic charts (daily/weekly/monthly)
- Revenue breakdown (ads, premium, VPN)
- Popular content
- User growth
- Top movies/matches

**Users Management** (`/admin/users`):

- List all users
- Filter by role, premium status
- Edit user (change role, upgrade premium)
- Delete/ban users

**Settings** (`/admin/settings`):

- Site configuration
- SEO settings
- Ad settings (PropellerAds/AdSterra codes)
- Premium pricing
- Storage credentials (R2)

## 4. MONETIZATION FEATURES

### Ad Integration

**PropellerAds / AdSterra Integration:**

- Banner ads (top, sidebar, between content)
- Native ads in content feeds
- Pop-under ads (1 per visit)
- Video pre-roll ads (before movies)

**Ad Blocker Detection:**

Component: `components/AdBlockDetector.tsx`

Features:

- Detect ad blocker after 3 seconds (not immediately)
- Show friendly popup with options:
  1. "I Disabled My Ad Blocker" (reload page)
  2. "Get Premium (Ad-Free) - $3/month"
  3. "Continue anyway (limited access)"
- Don't block content completely
- Be polite and understanding
- Show message in English + Somali

### Premium Subscription

**Pricing:**

- Monthly: $3
- Yearly: $18 (save $18)
- Lifetime: $50

**Benefits:**

- ✅ No ads
- ✅ HD quality
- ✅ Download option
- ✅ Early access to new movies
- ✅ Exclusive content

**Payment:**

- Stripe integration
- Subscription management in user dashboard

### VPN Affiliate

**NordVPN Banners:**

- Homepage (sidebar)
- Movie detail pages (after description)
- Banner text in English + Somali:
  - "Watch safely with NordVPN"
  - "Daawan si ammaan ah NordVPN"
- Commission: $50-100 per sale
- Track clicks in analytics

## 5. USER FEATURES

### User Dashboard (`/dashboard`)

Sections:

- **Continue Watching** - Resume where left off
- **Watchlist** - Favorited movies/shows
- **Watch History** - All watched content
- **Account Settings** - Profile, password, premium status

### Features Throughout Site

- **Watchlist** - Heart icon on movies/shows
- **Continue Watching** - Save progress to database
- **Ratings** - 1-5 stars
- **Comments** - Per movie/show
- **Social Sharing** - Share to social media
- **Push Notifications** - New releases

## 6. ADDITIONAL FEATURES

### TV Shows Section

- List TV shows
- Show detail with seasons/episodes
- Episode player with auto-play next episode
- Season/episode selector

### Blog Section

- Blog post listing
- Single post page with rich text
- Categories & tags
- Featured posts

### Search

- Global search (movies, shows, football, blog)
- Search suggestions
- Recent searches

## 7. API INTEGRATIONS

### TMDB Integration (`lib/tmdb.ts`)

Functions:

```typescript
- searchMovie(query: string)
- getMovieDetails(movieId: number)
- getMovieWithIds(tmdbId: number) // Returns tmdbId + imdbId
- getPopularMovies()
- getTrendingMovies()
- searchTVShow(query: string)
- getTVShowDetails(showId: number)
```

### YouTube Integration (`lib/youtube.ts`)

Functions:

```typescript
- searchLiveFootball(query: string)
- searchFootballHighlights(query: string)
- getVideoDetails(videoId: string)
```

## 8. VIDEO SOURCES CONFIGURATION

Create `lib/videoSources.ts`:

```typescript
export const MOVIE_SOURCES = [
  {
    name: "VidSrc.me",
    getUrl: (tmdb: string) => `https://vidsrc.me/embed/movie?tmdb=${tmdb}`,
    type: "tmdb",
  },
  {
    name: "VidSrc.xyz",
    getUrl: (imdb: string) => `https://vidsrc.xyz/embed/movie/${imdb}`,
    type: "imdb",
  },
  {
    name: "2Embed",
    getUrl: (imdb: string) => `https://www.2embed.cc/embed/${imdb}`,
    type: "imdb",
  },
  {
    name: "SuperEmbed",
    getUrl: (imdb: string) => `https://multiembed.mov/?video_id=${imdb}&tmdb=1`,
    type: "imdb",
  },
  {
    name: "AutoEmbed",
    getUrl: (tmdb: string) => `https://autoembed.co/movie/tmdb/${tmdb}`,
    type: "tmdb",
  },
  {
    name: "VidLink",
    getUrl: (tmdb: string) => `https://vidlink.pro/movie/${tmdb}`,
    type: "tmdb",
  },
];

export const TV_SOURCES = [
  {
    name: "VidSrc.me",
    getUrl: (tmdb: string, season: number, episode: number) =>
      `https://vidsrc.me/embed/tv?tmdb=${tmdb}&season=${season}&episode=${episode}`,
  },
  // ... similar for TV shows
];
```

# DESIGN SYSTEM

## Colors

```
Primary: #3B82F6 (blue)
Secondary: #8B5CF6 (purple)
Accent: #10B981 (green)
Success: #10B981 (green)
Warning: #F59E0B (amber)
Error: #EF4444 (red)
Background: #0F172A (dark blue-gray)
Card: #1E293B (lighter dark)
```

## Typography

- Font: Inter or System UI
- Headers: Bold, 2xl-6xl
- Body: Regular, sm-base
- Mobile-first responsive

## Layout

- Max width: 1400px
- Padding: 16px mobile, 24px desktop
- Grid gaps: 16px mobile, 24px desktop

## Components

- Rounded corners: rounded-lg (8px)
- Shadows: shadow-lg for cards
- Hover: scale-105, transition 200ms
- Focus: ring-2 ring-blue-500

# IMPLEMENTATION REQUIREMENTS

1. **TypeScript Throughout**
   - Strict mode enabled
   - Proper types for all props
   - No `any` types

2. **Next.js 14 Best Practices**
   - App Router
   - Server Components by default
   - Client Components only when needed ('use client')
   - Proper data fetching patterns

3. **Error Handling**
   - Try-catch for all async operations
   - Error boundaries for components
   - User-friendly error messages
   - Loading states everywhere

4. **Performance**
   - Image optimization (Next.js Image)
   - Lazy loading
   - Code splitting
   - Caching strategies

5. **SEO**
   - Meta tags on all pages
   - Open Graph tags
   - Structured data (JSON-LD)
   - Sitemap generation
   - Robots.txt

6. **Mobile Responsive**
   - Mobile-first approach
   - Touch-friendly buttons (44px minimum)
   - Horizontal scrolling for carousels
   - Bottom navigation for mobile

7. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Focus indicators
   - Alt text for images

8. **Security**
   - Environment variables for secrets
   - Input validation
   - SQL injection prevention (Prisma handles this)
   - XSS prevention
   - CSRF protection

# BUILD ORDER

Build in this order:

1. **Database & Auth Setup**
   - Prisma schema
   - NextAuth configuration
   - User authentication flow

2. **Movies Section**
   - TMDB integration
   - Multi-source player
   - Movie pages (list, detail)
   - Admin panel (add, edit movies)

3. **Football Section**
   - YouTube integration
   - Football player
   - Football pages (list, detail)
   - Admin panel (add, edit matches)

4. **User Features**
   - Dashboard
   - Watchlist
   - Watch history
   - Continue watching

5. **Monetization**
   - Ad integration
   - Ad blocker detection
   - Premium subscription
   - VPN affiliate

6. **Polish**
   - Blog section
   - Search
   - Analytics
   - Settings
   - SEO

# OUTPUT REQUIREMENTS

For each feature, provide:

1. ✅ Complete component code
2. ✅ API route implementation
3. ✅ Database queries
4. ✅ Type definitions
5. ✅ Usage examples
6. ✅ Error handling
7. ✅ Loading states
8. ✅ Mobile responsive
9. ✅ Comments explaining logic

# CRITICAL NOTES

- **FREE Streaming:** Use VidSrc and other embeds for movies (no video hosting cost)
- **Football:** YouTube API for official streams, manual embeds for others
- **Multi-source:** Always provide 3+ sources per content
- **Mobile:** 70%+ users on mobile, design for them first
- **Somali:** Support Somali language throughout (titles, UI elements)
- **Legal:** Offshore hosting, Cloudflare proxy, understand risks
- **Revenue:** Focus on ads + VPN affiliate (easiest to start)
- **Growth:** Start small (100 movies), scale based on traffic

Build everything now with production-quality code, proper TypeScript types, comprehensive error handling, and make it ready to deploy!
