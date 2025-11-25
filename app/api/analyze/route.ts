import { NextRequest, NextResponse } from 'next/server';
import { extractChannelId, fetchChannelVideos } from '@/lib/youtube';
import { analyzeVideoTopics, generateVideoIdeas } from '@/lib/ai';
import { fetchRelevantNews } from '@/lib/news';
import { searchRedditPosts } from '@/lib/reddit';
import { getApiKeys } from '@/lib/config';
import type { YouTubeChannelInfo } from '@/lib/types';

export const maxDuration = 60; 

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required and must be a string' },
        { status: 400 }
      );
    }

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      return NextResponse.json(
        { error: 'URL cannot be empty' },
        { status: 400 }
      );
    }

    const channelId = extractChannelId(trimmedUrl);
    if (!channelId) {
      return NextResponse.json(
        { 
          error: 'Invalid YouTube channel URL',
          hint: 'Supported formats: youtube.com/@channel, youtube.com/channel/ID, youtube.com/c/name'
        },
        { status: 400 }
      );
    }

    const { youtubeApiKey, openaiApiKey, newsApiKey, missingKeys } = getApiKeys();

    if (process.env.NODE_ENV === 'development') {
      console.log('API Keys Status:', {
        youtube: youtubeApiKey ? `Set (${youtubeApiKey.substring(0, 10)}...)` : 'Missing',
        openai: openaiApiKey ? `Set (${openaiApiKey.substring(0, 10)}...)` : 'Missing',
        news: newsApiKey ? 'Set' : 'Missing (optional)',
      });
    }

    if (missingKeys.length > 0) {
      return NextResponse.json(
        { 
          error: 'API keys not configured',
          missing: missingKeys,
          hint: 'Make sure .env.local file exists with YOUTUBE_API_KEY and OPENAI_API_KEY. Restart the dev server after creating/editing .env.local',
          debug: process.env.NODE_ENV === 'development' ? {
            envFileExists: true,
            allEnvKeys: Object.keys(process.env).filter(k => k.includes('API_KEY'))
          } : undefined
        },
        { status: 500 }
      );
    }

    const channelInfo: YouTubeChannelInfo = await fetchChannelVideos(channelId, youtubeApiKey);

    // Prepare video data for analysis
    const videoData = channelInfo.videos.map((v) => ({
      title: v.title,
      description: v.description,
    }));

    // Analyze topics from videos
    const topics = await analyzeVideoTopics(videoData, openaiApiKey);

    // Fetch news and Reddit posts in parallel
    const [news, redditPosts] = await Promise.all([
      fetchRelevantNews(topics.mainTopics, newsApiKey).catch((err) => {
        console.warn('News fetch failed:', err);
        return [];
      }),
      searchRedditPosts(topics.mainTopics).catch((err) => {
        console.warn('Reddit fetch failed:', err);
        return [];
      }),
    ]);

    if (process.env.NODE_ENV === 'development') {
      console.log('Fetched data:', {
        newsCount: news.length,
        redditCount: redditPosts.length,
        topics: topics.mainTopics,
      });
    }

    // Generate video ideas
    const videoIdeas = await generateVideoIdeas(
      {
        channelName: channelInfo.channelName,
        topics,
        recentVideos: channelInfo.videos.map((v) => ({ title: v.title })),
      },
      news,
      redditPosts,
      openaiApiKey
    );

    // Transform channel info to match expected format
    const formattedChannelInfo = {
      channelName: channelInfo.channelName,
      videos: channelInfo.videos.map((v) => ({
        title: v.title,
        url: v.url,
        thumbnail: v.thumbnail,
      })),
    };

    return NextResponse.json({
      success: true,
      channelInfo: formattedChannelInfo,
      topics,
      news,
      redditPosts,
      videoIdeas,
    });
  } catch (error: unknown) {
    console.error('Analysis error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to analyze channel';
    
    const statusCode = errorMessage.includes('not found') ? 404 :
                      errorMessage.includes('rate limit') ? 429 :
                      errorMessage.includes('timeout') ? 504 : 500;

    return NextResponse.json(
      { 
        error: errorMessage,
        success: false
      },
      { status: statusCode }
    );
  }
}