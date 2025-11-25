export interface TopicAnalysis {
  mainTopics: string[];
  commonThemes: string[];
  contentStyle: string;
  targetAudience: string;
}

export interface VideoIdea {
  title: string;
  thumbnailDesign: string;
  videoIdea: string;
}

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

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
}

export interface RedditPost {
  title: string;
  content: string;
  url: string;
  subreddit: string;
  score: number;
  created: number;
}

export interface ChannelInfo {
  channelName: string;
  videos: Array<{ title: string; url: string; thumbnail: string }>;
}

export interface AnalysisResult {
  channelInfo: ChannelInfo;
  topics: TopicAnalysis;
  news: NewsArticle[];
  redditPosts: RedditPost[];
  videoIdeas: VideoIdea[];
}

