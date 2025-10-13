export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2" 
           style={{ borderColor: 'var(--bs-primary)' }}>
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="modernize-card p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="modernize-card p-6 animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="h-80 bg-gray-200 rounded"></div>
    </div>
  )
}
