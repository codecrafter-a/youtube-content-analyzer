export interface VideoIdea {
  title: string;
  thumbnailDesign: string;
  videoIdea: string;
}

export interface Video {
  title: string;
  url: string;
  thumbnail: string;
}

export interface ChannelInfo {
  channelName: string;
  videos: Video[];
}

export interface Topics {
  mainTopics: string[];
  commonThemes: string[];
  contentStyle: string;
  targetAudience: string;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
}

export interface RedditPost {
  title: string;
  content: string;
  url: string;
  subreddit: string;
}

export interface AnalysisResult {
  channelInfo: ChannelInfo;
  topics: Topics;
  news: NewsArticle[];
  redditPosts: RedditPost[];
  videoIdeas: VideoIdea[];
}

