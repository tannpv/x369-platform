import type { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function Card({ children, className, title, subtitle, actions }: CardProps) {
  return (
    <div className={clsx('bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 hover:shadow-md', className)}>
      {(title || subtitle || actions) && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center space-x-2">{actions}</div>}
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

export function StatsCard({ title, value, change, changeType }: {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}) {
  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/90">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2 tracking-tight">{value}</p>
          {change && (
            <p className={clsx('text-sm mt-2 font-medium', {
              'text-success': changeType === 'positive',
              'text-destructive': changeType === 'negative',
              'text-muted-foreground': changeType === 'neutral',
            })}>
              {change}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
