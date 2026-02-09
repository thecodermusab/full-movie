import axios from "axios";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

const youtube = axios.create({
  baseURL: BASE_URL,
  params: {
    key: YOUTUBE_API_KEY,
  },
});

export interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
    liveBroadcastContent: string;
  };
}

export const searchLiveFootball = async (query: string = "live football match"): Promise<YouTubeVideo[]> => {
  try {
    const response = await youtube.get("/search", {
      params: {
        part: "snippet",
        q: query,
        type: "video",
        eventType: "live",
        maxResults: 10,
        relevanceLanguage: "en",
      },
    });
    return response.data.items;
  } catch (error) {
    console.error("Error searching live football:", error);
    return [];
  }
};

export const searchFootballHighlights = async (query: string = "football highlights"): Promise<YouTubeVideo[]> => {
  try {
    const response = await youtube.get("/search", {
      params: {
        part: "snippet",
        q: query,
        type: "video",
        maxResults: 10,
        relevanceLanguage: "en",
        order: "date",
      },
    });
    return response.data.items;
  } catch (error) {
    console.error("Error searching football highlights:", error);
    return [];
  }
};
