import { NewsArticle, RedditPost } from '@/lib/types';

interface NewsRedditSectionProps {
  news: NewsArticle[];
  redditPosts: RedditPost[];
}

export default function NewsRedditSection({ news, redditPosts }: NewsRedditSectionProps) {
  return (
    <details className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
      <summary className="text-xl font-bold text-slate-900 dark:text-white cursor-pointer">
        Sources: News & Reddit Discussions
      </summary>
      <div className="mt-4 space-y-6">
        {news.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Relevant News:
            </h3>
            <ul className="space-y-2">
              {news.map((article, i) => (
                <li key={i} className="text-sm">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {article.title}
                  </a>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    {article.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {redditPosts.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Reddit Discussions:
            </h3>
            <ul className="space-y-2">
              {redditPosts.map((post, i) => (
                <li key={i} className="text-sm">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {post.title}
                  </a>
                  <span className="text-slate-500 dark:text-slate-500 ml-2">
                    r/{post.subreddit}
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    {post.content}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </details>
  );
}

