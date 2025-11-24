interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ 
  message = 'Analyzing channel and generating ideas...' 
}: LoadingSpinnerProps) {
  return (
    <div className="text-center py-12">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-slate-600 dark:text-slate-300">{message}</p>
    </div>
  );
}

