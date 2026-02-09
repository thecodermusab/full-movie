import axios from "axios";

const TMDB_API_KEY = process.env.TMDB_API_KEY!;
const BASE_URL = "https://api.themoviedb.org/3";

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TMDBTVShow {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TMDBWatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority: number;
}

export interface TMDBWatchProviderRegion {
  link: string;
  flatrate?: TMDBWatchProvider[];
  rent?: TMDBWatchProvider[];
  buy?: TMDBWatchProvider[];
  free?: TMDBWatchProvider[];
  ads?: TMDBWatchProvider[];
}

const getRegionProviders = (
  results: Record<string, TMDBWatchProviderRegion> | undefined,
  region: string
): TMDBWatchProviderRegion | null => {
  if (!results) return null;
  if (results[region]) return results[region];

  const firstRegion = Object.keys(results)[0];
  return firstRegion ? results[firstRegion] : null;
};

export const getTrendingMovies = async (): Promise<TMDBMovie[]> => {
  try {
    const response = await tmdb.get("/trending/movie/week");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};

export const getPopularMovies = async (): Promise<TMDBMovie[]> => {
  try {
    const response = await tmdb.get("/movie/popular");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
};

export const getAllPopularMovies = async (maxPages: number = 10): Promise<TMDBMovie[]> => {
  const safeMaxPages = Math.max(1, maxPages);

  try {
    const firstPage = await tmdb.get("/movie/popular", {
      params: { page: 1 },
    });

    const movies: TMDBMovie[] = firstPage.data?.results ?? [];
    const totalPages = Math.min(firstPage.data?.total_pages ?? 1, safeMaxPages);

    if (totalPages <= 1) {
      return movies;
    }

    const pageRequests = [];
    for (let page = 2; page <= totalPages; page++) {
      pageRequests.push(
        tmdb.get("/movie/popular", {
          params: { page },
        })
      );
    }

    const restPages = await Promise.all(pageRequests);
    for (const pageResponse of restPages) {
      movies.push(...(pageResponse.data?.results ?? []));
    }

    // Keep movie IDs unique across pages.
    return Array.from(new Map(movies.map((movie) => [movie.id, movie])).values());
  } catch (error) {
    console.error("Error fetching all popular movies:", error);
    return [];
  }
};

export const getTopRatedMovies = async (): Promise<TMDBMovie[]> => {
  try {
    const response = await tmdb.get("/movie/top_rated");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    return [];
  }
};

export const getUpcomingMovies = async (): Promise<TMDBMovie[]> => {
  try {
    const response = await tmdb.get("/movie/upcoming");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    return [];
  }
};


export const getMovieDetails = async (id: number) => {
  if (!id || isNaN(id)) return null;
  try {
    const response = await tmdb.get(`/movie/${id}?append_to_response=videos,credits,similar`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for movie ${id}:`, error);
    return null;
  }
};

export const getMovieWatchProviders = async (
  id: number,
  region: string = "US"
): Promise<TMDBWatchProviderRegion | null> => {
  if (!id || isNaN(id)) return null;
  try {
    const response = await tmdb.get(`/movie/${id}/watch/providers`);
    return getRegionProviders(response.data?.results, region);
  } catch (error) {
    console.error(`Error fetching watch providers for movie ${id}:`, error);
    return null;
  }
};

export const getPopularTVShows = async (): Promise<TMDBTVShow[]> => {
  try {
    const response = await tmdb.get("/tv/popular");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular TV shows:", error);
    return [];
  }
};

export const getAllPopularTVShows = async (maxPages: number = 10): Promise<TMDBTVShow[]> => {
  const safeMaxPages = Math.max(1, maxPages);

  try {
    const firstPage = await tmdb.get("/tv/popular", {
      params: { page: 1 },
    });

    const shows: TMDBTVShow[] = firstPage.data?.results ?? [];
    const totalPages = Math.min(firstPage.data?.total_pages ?? 1, safeMaxPages);

    if (totalPages <= 1) {
      return shows;
    }

    const pageRequests = [];
    for (let page = 2; page <= totalPages; page++) {
      pageRequests.push(
        tmdb.get("/tv/popular", {
          params: { page },
        })
      );
    }

    const restPages = await Promise.all(pageRequests);
    for (const pageResponse of restPages) {
      shows.push(...(pageResponse.data?.results ?? []));
    }

    // Keep TV IDs unique across pages.
    return Array.from(new Map(shows.map((show) => [show.id, show])).values());
  } catch (error) {
    console.error("Error fetching all popular TV shows:", error);
    return [];
  }
};

export const getTVShowDetails = async (id: number) => {
  if (!id || isNaN(id)) return null;
  try {
    const response = await tmdb.get(`/tv/${id}?append_to_response=videos,credits,similar,season/1`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for TV show ${id}:`, error);
    return null;
  }
};

export const getTVWatchProviders = async (
  id: number,
  region: string = "US"
): Promise<TMDBWatchProviderRegion | null> => {
  if (!id || isNaN(id)) return null;
  try {
    const response = await tmdb.get(`/tv/${id}/watch/providers`);
    return getRegionProviders(response.data?.results, region);
  } catch (error) {
    console.error(`Error fetching watch providers for TV show ${id}:`, error);
    return null;
  }
};

export const getSeasonDetails = async (tvId: number, seasonNumber: number) => {
  try {
    const response = await tmdb.get(`/tv/${tvId}/season/${seasonNumber}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching season ${seasonNumber} for show ${tvId}:`, error);
    return {};
  }
};

export const searchMovies = async (query: string): Promise<TMDBMovie[]> => {
  try {
    const response = await tmdb.get("/search/movie", {
      params: { query },
    });
    return response.data.results;
  } catch (error) {
    console.error(`Error searching movies for query "${query}":`, error);
    return [];
  }
};

export const searchTVShows = async (query: string): Promise<TMDBTVShow[]> => {
  try {
    const response = await tmdb.get("/search/tv", {
        params: { query },
    });
    return response.data.results;
  } catch (error) {
    console.error(`Error searching TV shows for query "${query}":`, error);
    return [];
  }
};

export const getImageUrl = (path: string, size: "w500" | "original" = "w500") => {
  if (!path) return "/placeholder-image.jpg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
