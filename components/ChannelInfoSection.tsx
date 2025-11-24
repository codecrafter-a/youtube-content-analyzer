import { ChannelInfo } from '@/lib/types';

interface ChannelInfoSectionProps {
  channelInfo: ChannelInfo;
}

export default function ChannelInfoSection({ channelInfo }: ChannelInfoSectionProps) {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
        {channelInfo.channelName}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {channelInfo.videos.slice(0, 5).map((video) => (
          <a
            key={video.url}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full rounded-lg mb-2"
            />
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
              {video.title}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}

