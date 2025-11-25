import { useAnalysisStore } from '@/store/useAnalysisStore';

export function useChannelAnalysis() {
  const {
    url,
    setUrl,
    loading,
    result,
    error,
    analyzeChannel,
  } = useAnalysisStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    await analyzeChannel(url);
  };

  return {
    url,
    setUrl,
    loading,
    result,
    error,
    handleSubmit,
  };
}

