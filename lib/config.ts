/**
 * Centralized configuration and constants
 */

export const API_TIMEOUT = 30000; // 30 seconds
export const MAX_VIDEOS = 10;
export const MAX_TOPICS = 7;
export const MAX_NEWS_ARTICLES = 10;
export const MAX_REDDIT_POSTS = 10;
export const MAX_VIDEO_IDEAS = 5;
export const DESCRIPTION_MAX_LENGTH = 500;
export const REDDIT_CONTENT_MAX_LENGTH = 200;
export const NEWS_SUMMARY_LENGTH = 150;
export const REDDIT_SUMMARY_LENGTH = 150;


export function getApiKeys() {
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const newsApiKey = process.env.NEWS_API_KEY;

  if (process.env.NODE_ENV === 'development') {
    console.log('Environment check:');
    console.log('YOUTUBE_API_KEY:', youtubeApiKey ? '✓ Set' : '✗ Missing');
    console.log('OPENAI_API_KEY:', openaiApiKey ? '✓ Set' : '✗ Missing');
    console.log('NEWS_API_KEY:', newsApiKey ? '✓ Set (optional)' : '✗ Missing (optional)');
  }

  const missingKeys: string[] = [];
  if (!youtubeApiKey) missingKeys.push('YOUTUBE_API_KEY');
  if (!openaiApiKey) missingKeys.push('OPENAI_API_KEY');

  return {
    youtubeApiKey: youtubeApiKey || '',
    openaiApiKey: openaiApiKey || '',
    newsApiKey: newsApiKey || '',
    missingKeys,
  };
}


export function isValidYouTubeUrl(url: string): boolean {
  const youtubePatterns = [
    /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/,
    /^@?[a-zA-Z0-9_-]+$/,
  ];

  return youtubePatterns.some((pattern) => pattern.test(url));
}
