interface PageHeaderProps {
  title: string;
  description: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h1>
      <p className="text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  );
}

