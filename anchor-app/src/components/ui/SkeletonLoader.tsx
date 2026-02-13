interface SkeletonProps {
  className?: string
}

function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />
}

export function TimelineSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Tijdlijn laden...">
      <span className="sr-only">Laden...</span>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-start gap-4">
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ListSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="Lijst laden...">
      <span className="sr-only">Laden...</span>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-neutral-800/50">
          <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-3 w-16 shrink-0" />
        </div>
      ))}
    </div>
  )
}

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="status" aria-label="Grid laden...">
      <span className="sr-only">Laden...</span>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-xl bg-white dark:bg-neutral-800/50 p-4 space-y-3">
          <Skeleton className="h-2 w-full rounded-t-xl" />
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-18 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Dashboard laden...">
      <span className="sr-only">Laden...</span>
      {/* Latest Entry */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
      {/* Quick Actions */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}

export { Skeleton }
