import { createHttpClient, handleApiError } from './http-client';
import { MAX_VIDEOS } from './config';

const httpClient = createHttpClient();

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
}

export interface YouTubeChannelInfo {
  channelId: string;
  channelName: string;
  videos: YouTubeVideo[];
}

/**
 * Extract channel ID or username from YouTube URL
 */
export function extractChannelId(url: string): string | null {
  // Handle different YouTube URL formats
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

  // If it's just a handle/username without URL, return as-is
  if (url.startsWith('@') || /^[a-zA-Z0-9_-]+$/.test(url)) {
    return url.startsWith('@') ? url : url;
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
    let channel: any;
    
    const channelResponse = await httpClient.get(
      'https://www.googleapis.com/youtube/v3/channels',
      {
        params: {
          part: 'snippet,contentDetails',
          id: channelId,
          key: apiKey,
        },
      }
    );

    if (channelResponse.data.items?.length > 0) {
      channel = channelResponse.data.items[0];
    } else {
      const searchQuery = channelId.startsWith('@') ? channelId : `@${channelId}`;
      const searchResponse = await httpClient.get(
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
      if (searchItems?.length > 0) {
        const foundChannelId = searchItems[0].snippet.channelId;
        const channelDetailsResponse = await httpClient.get(
          'https://www.googleapis.com/youtube/v3/channels',
          {
            params: {
              part: 'snippet,contentDetails',
              id: foundChannelId,
              key: apiKey,
            },
          }
        );
        
        const channelItems = channelDetailsResponse.data.items;
        if (channelItems?.length > 0) {
          channel = channelItems[0];
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

    const videosResponse = await httpClient.get(
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

    const videos: YouTubeVideo[] = videoItems.map((item: any) => {
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

    return {
      channelId: channel.id,
      channelName: channel.snippet.title,
      videos,
    };
  } catch (error: any) {
    if (error.message.includes('Channel') || error.message.includes('videos')) {
      throw error;
    }
    handleApiError(error, 'YouTube API');
  }
}

