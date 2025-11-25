import { createHttpClient, handleApiError } from './http-client';
import { MAX_VIDEOS } from './config';
import type { YouTubeVideo, YouTubeChannelInfo } from './types';

const httpClient = createHttpClient();

export type { YouTubeVideo, YouTubeChannelInfo };

export function extractChannelId(url: string): string | null {
  const patterns = [
    /youtube\.com\/channel\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/c\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/user\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/@([a-zA-Z0-9_-]+)/,
    /youtu\.be\/.*[?&]channel_id=([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=[\w-]+&.*channel_id=([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  if (url.startsWith('@')) {
    return url;
  }
  
  if (/^[a-zA-Z0-9_-]+$/.test(url)) {
    return url;
  }

  return null;
}


export async function fetchChannelVideos(
  channelId: string,
  apiKey: string
): Promise<YouTubeChannelInfo> {
  if (!apiKey) {
    throw new Error('YouTube API key is required');
  }

  try {
    interface YouTubeChannelItem {
      id: string;
      snippet: {
        title: string;
      };
      contentDetails?: {
        relatedPlaylists?: {
          uploads?: string;
        };
      };
    }

    interface YouTubeChannelResponse {
      items?: YouTubeChannelItem[];
    }

    interface YouTubeSearchItem {
      snippet: {
        channelId: string;
      };
    }

    interface YouTubeSearchResponse {
      items?: YouTubeSearchItem[];
    }

    interface YouTubePlaylistItem {
      snippet: {
        title: string;
        description: string;
        publishedAt: string;
        thumbnails: {
          high?: { url: string };
          default?: { url: string };
        };
      };
      contentDetails: {
        videoId: string;
      };
    }

    interface YouTubePlaylistResponse {
      items?: YouTubePlaylistItem[];
    }

    let channel: YouTubeChannelItem | undefined;
    
    const channelResponse = await httpClient.get<YouTubeChannelResponse>(
      'https://www.googleapis.com/youtube/v3/channels',
      {
        params: {
          part: 'snippet,contentDetails',
          id: channelId,
          key: apiKey,
        },
      }
    );

    const channelItems = channelResponse.data.items;
    if (channelItems && channelItems.length > 0) {
      channel = channelItems[0];
    } else {
      const searchQuery = channelId.startsWith('@') ? channelId : `@${channelId}`;
      const searchResponse = await httpClient.get<YouTubeSearchResponse>(
        'https://www.googleapis.com/youtube/v3/search',
        {
          params: {
            part: 'snippet',
            q: searchQuery,
            type: 'channel',
            maxResults: 1,
            key: apiKey,
          },
        }
      );

      const searchItems = searchResponse.data.items;
      if (searchItems && searchItems.length > 0) {
        const foundChannelId = searchItems[0].snippet.channelId;
        const channelDetailsResponse = await httpClient.get<YouTubeChannelResponse>(
          'https://www.googleapis.com/youtube/v3/channels',
          {
            params: {
              part: 'snippet,contentDetails',
              id: foundChannelId,
              key: apiKey,
            },
          }
        );
        
        const channelDetailsItems = channelDetailsResponse.data.items;
        if (channelDetailsItems && channelDetailsItems.length > 0) {
          channel = channelDetailsItems[0];
        } else {
          throw new Error('Channel details not found');
        }
      } else {
        throw new Error('Channel not found. Please check the URL or channel handle');
      }
    }

    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) {
      throw new Error('Channel uploads playlist not found');
    }

    const videosResponse = await httpClient.get<YouTubePlaylistResponse>(
      'https://www.googleapis.com/youtube/v3/playlistItems',
      {
        params: {
          part: 'snippet,contentDetails',
          playlistId: uploadsPlaylistId,
          maxResults: MAX_VIDEOS,
          key: apiKey,
        },
      }
    );

    const videoItems = videosResponse.data.items;
    if (!videoItems || videoItems.length === 0) {
      throw new Error('No videos found for this channel');
    }

    const videos: YouTubeVideo[] = videoItems.map((item) => {
      const snippet = item.snippet;
      const contentDetails = item.contentDetails;
      const thumbnails = snippet.thumbnails;
      
      return {
        id: contentDetails.videoId,
        title: snippet.title,
        description: snippet.description || '',
        publishedAt: snippet.publishedAt,
        thumbnail: thumbnails.high?.url || thumbnails.default?.url || '',
        url: `https://www.youtube.com/watch?v=${contentDetails.videoId}`,
      };
    });

    if (!channel) {
      throw new Error('Channel information is missing');
    }

    return {
      channelId: channel.id,
      channelName: channel.snippet.title,
      videos,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('Channel') || error.message.includes('videos')) {
        throw error;
      }
    }
    handleApiError(error, 'YouTube API');
  }
}

