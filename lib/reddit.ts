import { createHttpClient } from './http-client';
import { MAX_REDDIT_POSTS } from './config';

const httpClient = createHttpClient();

export interface RedditPost {
  title: string;
  content: string;
  url: string;
  subreddit: string;
  score: number;
  created: number;
}

export async function searchRedditPosts(
  topics: string[]
): Promise<RedditPost[]> {
  if (!topics || topics.length === 0) {
    return [];
  }

  try {
    const query = topics.slice(0, 3).join(' OR ');
    
    const response = await httpClient.get('https://www.reddit.com/search.json', {
      params: {
        q: query,
        sort: 'relevance',
        limit: MAX_REDDIT_POSTS,
        t: 'week', // Last week
      },
    });

    const children = response.data?.data?.children || [];
    
    const posts: RedditPost[] = children
      .map((child: any) => {
        const post = child.data;
        if (!post) return null;
        
        return {
          title: post.title || 'Untitled',
          content: post.selftext || post.title || '',
          url: post.permalink ? `https://reddit.com${post.permalink}` : '',
          subreddit: post.subreddit || 'unknown',
          score: post.score || 0,
          created: post.created_utc || Date.now() / 1000,
        };
      })
      .filter((post: RedditPost | null): post is RedditPost => 
        post !== null && post.content.length > 0 && post.url.length > 0
      )
      .slice(0, MAX_REDDIT_POSTS);

    return posts;
  } catch (error: any) {
    console.warn('Reddit search error (non-critical):', error.message);
    return [];
  }
}

