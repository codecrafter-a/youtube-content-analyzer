import { createHttpClient } from './http-client';
import { MAX_NEWS_ARTICLES } from './config';
import type { NewsArticle } from './types';

const httpClient = createHttpClient();

export type { NewsArticle };

export async function fetchRelevantNews(
  topics: string[],
  apiKey?: string
): Promise<NewsArticle[]> {
  if (!apiKey || topics.length === 0) {
    return [];
  }

  try {
    interface NewsApiResponse {
      status?: string;
      articles?: Array<{
        title?: string;
        description?: string;
        content?: string;
        url?: string;
        publishedAt?: string;
      }>;
      message?: string;
    }

    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const fromDate = weekAgo.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];
    const query = topics.slice(0, 3).join(' OR ');

    const response = await httpClient.get<NewsApiResponse>('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        from: fromDate,
        to: toDate,
        sortBy: 'relevancy',
        pageSize: MAX_NEWS_ARTICLES,
        language: 'en',
        apiKey,
      },
    });

    if (response.data.status === 'error') {
      console.warn('NewsAPI error:', response.data.message);
      return [];
    }

    const articles = response.data.articles || [];
    
    return articles
      .slice(0, MAX_NEWS_ARTICLES)
      .map((article) => ({
        title: article.title || 'Untitled',
        description: article.description || article.content?.substring(0, 200) || '',
        url: article.url || '',
        publishedAt: article.publishedAt || new Date().toISOString(),
      }))
      .filter((article: NewsArticle) => article.title && article.url);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn('NewsAPI error (non-critical):', errorMessage);
    return [];
  }
}

