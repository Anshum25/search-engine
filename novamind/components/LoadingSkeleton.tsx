export function LoadingSkeleton({ type }: { type?: 'all' | 'ai' | 'images' | 'grid' }) {
  if (type === 'ai') {
    return (
      <div className="max-w-3xl animate-pulse">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-zinc-200 rounded dark:bg-zinc-800" />
            <div className="h-3 w-48 bg-zinc-100 rounded dark:bg-zinc-900" />
          </div>
        </div>
        <div className="space-y-4 mb-8">
          <div className="h-4 w-full bg-zinc-200 rounded dark:bg-zinc-800" />
          <div className="h-4 w-[90%] bg-zinc-200 rounded dark:bg-zinc-800" />
          <div className="h-4 w-[95%] bg-zinc-200 rounded dark:bg-zinc-800" />
          <div className="h-4 w-[85%] bg-zinc-200 rounded dark:bg-zinc-800" />
        </div>
        <div className="h-32 w-full bg-zinc-100 rounded-xl dark:bg-zinc-900" />
      </div>
    );
  }

  if (type === 'images') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] bg-zinc-200 rounded-xl dark:bg-zinc-800" />
        ))}
      </div>
    );
  }

  if (type === 'grid') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-pulse">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-square bg-zinc-200 rounded-xl dark:bg-zinc-800" />
            <div className="h-4 w-full bg-zinc-200 rounded dark:bg-zinc-800" />
            <div className="h-4 w-2/3 bg-zinc-200 rounded dark:bg-zinc-800" />
          </div>
        ))}
      </div>
    );
  }

  // Default web layout 'all'
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 animate-pulse">
      {/* Main column */}
      <div className="flex-grow w-full max-w-3xl space-y-8">
        {/* AI block placeholder */}
        <div className="h-48 w-full bg-zinc-100 rounded-2xl dark:bg-zinc-900" />
        
        {/* Results placeholders */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-zinc-200 rounded shrink-0 dark:bg-zinc-800" />
              <div className="h-3 w-32 bg-zinc-200 rounded dark:bg-zinc-800" />
            </div>
            <div className="h-6 w-[80%] bg-zinc-200 rounded dark:bg-zinc-800" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-zinc-100 rounded dark:bg-zinc-900" />
              <div className="h-4 w-[90%] bg-zinc-100 rounded dark:bg-zinc-900" />
            </div>
          </div>
        ))}
      </div>

      {/* Right Column / Knowledge Panel placeholder */}
      <div className="w-full lg:w-[350px] shrink-0 hidden md:block">
        <div className="h-96 w-full bg-zinc-100 rounded-2xl dark:bg-zinc-900" />
      </div>
    </div>
  );
}
