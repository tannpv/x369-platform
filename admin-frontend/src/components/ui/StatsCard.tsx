import type { StatsCard as StatsCardType } from '../../shared/types/common'
import { cn, formatCurrency, formatNumber } from '../../shared/utils'

interface StatsCardProps extends StatsCardType {
  className?: string
  loading?: boolean
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color,
  className,
  loading = false
}) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      if (title.toLowerCase().includes('revenue') || title.toLowerCase().includes('amount')) {
        return formatCurrency(val)
      }
      return formatNumber(val)
    }
    return val
  }

  const changeColors = {
    positive: 'text-green-600 bg-green-100',
    negative: 'text-red-600 bg-red-100',
    neutral: 'text-gray-600 bg-gray-100'
  }

  if (loading) {
    return (
      <div className={cn('bg-white rounded-lg p-6 shadow-sm border', className)}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {Icon && (
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: color || '#f3f4f6' }}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <p className="text-2xl font-bold text-gray-900">
          {formatValue(value)}
        </p>
        
        {change && (
          <div className={cn(
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
            changeColors[changeType]
          )}>
            {changeType === 'positive' && '↗'}
            {changeType === 'negative' && '↘'}
            {changeType === 'neutral' && '→'}
            <span className="ml-1">{change}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatsCard
