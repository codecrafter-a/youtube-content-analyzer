import { Topics } from '@/lib/types';

interface TopicsAnalysisSectionProps {
  topics: Topics;
}

export default function TopicsAnalysisSection({ topics }: TopicsAnalysisSectionProps) {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
        Content Analysis
      </h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Main Topics:
          </h3>
          <div className="flex flex-wrap gap-2">
            {topics.mainTopics.map((topic, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Content Style:
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {topics.contentStyle}
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Target Audience:
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {topics.targetAudience}
          </p>
        </div>
      </div>
    </section>
  );
}

