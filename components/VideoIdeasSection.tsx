import { VideoIdea } from '@/lib/types';

interface VideoIdeasSectionProps {
  videoIdeas: VideoIdea[];
}

export default function VideoIdeasSection({ videoIdeas }: VideoIdeasSectionProps) {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Generated Video Ideas
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videoIdeas.map((idea, index) => (
          <div
            key={index}
            className="border border-slate-200 dark:border-slate-700 rounded-lg p-5 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              {idea.title}
            </h3>
            <div className="mb-3">
              <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Thumbnail Design:
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {idea.thumbnailDesign}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Video Concept:
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {idea.videoIdea}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

