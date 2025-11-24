'use client';

import { useChannelAnalysis } from '@/hooks/useChannelAnalysis';
import PageHeader from '@/components/PageHeader';
import ChannelInputForm from '@/components/ChannelInputForm';
import ChannelInfoSection from '@/components/ChannelInfoSection';
import TopicsAnalysisSection from '@/components/TopicsAnalysisSection';
import VideoIdeasSection from '@/components/VideoIdeasSection';
import NewsRedditSection from '@/components/NewsRedditSection';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function Home() {
  const { url, setUrl, loading, result, error, handleSubmit } = useChannelAnalysis();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <PageHeader
          title="YouTube Content Idea Generator"
          description="Analyze your channel and get AI-powered video ideas based on trends"
        />

        <ChannelInputForm
          url={url}
          onUrlChange={setUrl}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {error && <ErrorMessage message={error} />}

        {loading && <LoadingSpinner />}

        {result && (
          <div className="space-y-8">
            <ChannelInfoSection channelInfo={result.channelInfo} />
            <TopicsAnalysisSection topics={result.topics} />
            <VideoIdeasSection videoIdeas={result.videoIdeas} />
            <NewsRedditSection news={result.news} redditPosts={result.redditPosts} />
          </div>
        )}
      </div>
    </div>
  );
}
