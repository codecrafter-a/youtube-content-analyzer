import { createHttpClient } from './http-client';
import { MAX_NEWS_ARTICLES } from './config';

const httpClient = createHttpClient();

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
}

export async function fetchRelevantNews(
  topics: string[],
  apiKey?: string
): Promise<NewsArticle[]> {
  if (!apiKey || topics.length === 0) {
    return [];
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const query = topics.slice(0, 3).join(' OR ');

    const response = await httpClient.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        from: today,
        sortBy: 'relevancy',
        pageSize: MAX_NEWS_ARTICLES,
        language: 'en',
        apiKey,
      },
    });

    const articles = response.data.articles || [];
    
    return articles
      .slice(0, MAX_NEWS_ARTICLES)
      .map((article: any) => ({
        title: article.title || 'Untitled',
        description: article.description || article.content?.substring(0, 200) || '',
        url: article.url || '',
        publishedAt: article.publishedAt || new Date().toISOString(),
      }))
      .filter((article: NewsArticle) => article.title && article.url);
  } catch (error: any) {
    // Silently fail for news - it's optional
    console.warn('NewsAPI error (non-critical):', error.message);
    return [];
  }
}

