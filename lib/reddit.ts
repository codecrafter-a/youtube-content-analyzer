import { createHttpClient } from './http-client';
import { MAX_REDDIT_POSTS } from './config';
import type { RedditPost } from './types';

const httpClient = createHttpClient();

export type { RedditPost };

export async function searchRedditPosts(
  topics: string[]
): Promise<RedditPost[]> {
  if (!topics || topics.length === 0) {
    return [];
  }

  try {
    interface RedditResponse {
      data?: {
        children?: Array<{
          data?: {
            title?: string;
            selftext?: string;
            permalink?: string;
            subreddit?: string;
            score?: number;
            created_utc?: number;
          };
        }>;
      };
      error?: string;
    }

    const query = topics.slice(0, 3).join(' OR ');
    
    const response = await httpClient.get<RedditResponse>('https://www.reddit.com/search.json', {
      params: {
        q: query,
        sort: 'relevance',
        limit: MAX_REDDIT_POSTS,
        t: 'week',
        restrict_sr: 'false',
      },
      headers: {
        'User-Agent': 'YouTube-Idea-Generator/1.0 (by /u/youtubeanalyzer)',
      },
    });

    if (response.data.error) {
      console.warn('Reddit API error:', response.data.error);
      return [];
    }

    const children = response.data?.data?.children || [];
    
    if (!children || children.length === 0) {
      console.warn('Reddit search returned no results for query:', query);
      return [];
    }
    
    const posts: RedditPost[] = children
      .map((child) => {
        const post = child.data;
        if (!post) return null;
        
        const content = post.selftext || post.title || '';
        const url = post.permalink 
          ? (post.permalink.startsWith('http') ? post.permalink : `https://reddit.com${post.permalink}`)
          : '';
        
        return {
          title: post.title || 'Untitled',
          content: content,
          url: url,
          subreddit: post.subreddit || 'unknown',
          score: post.score || 0,
          created: post.created_utc || Date.now() / 1000,
        };
      })
      .filter((post: RedditPost | null): post is RedditPost => 
        post !== null && post.title.length > 0 && post.url.length > 0
      )
      .slice(0, MAX_REDDIT_POSTS);

    return posts;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn('Reddit search error (non-critical):', errorMessage);
    return [];
  }
}

