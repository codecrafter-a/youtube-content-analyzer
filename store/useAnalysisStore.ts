import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnalysisResult } from '@/lib/types';

interface AnalysisState {
  url: string;
  loading: boolean;
  result: AnalysisResult | null;
  error: string | null;
  setUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  setResult: (result: AnalysisResult | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  analyzeChannel: (channelUrl: string) => Promise<void>;
}

const initialState = {
  url: '',
  loading: false,
  result: null,
  error: null,
};

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      ...initialState,

      setUrl: (url: string) => set({ url }),

      setLoading: (loading: boolean) => set({ loading }),

      setResult: (result: AnalysisResult | null) => set({ result }),

      setError: (error: string | null) => set({ error }),

      reset: () => set(initialState),

      analyzeChannel: async (channelUrl: string) => {
        set({ loading: true, error: null, result: null });

        try {
          const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: channelUrl }),
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to analyze channel');
          }

          const data = await response.json();
          set({ result: data, loading: false });
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : 'An error occurred';
          set({ error: errorMessage, loading: false });
        }
      },
    }),
    {
      name: 'analysis-storage',
      partialize: (state: AnalysisState) => ({
        url: state.url,
        result: state.result,
      }),
    }
  )
);

