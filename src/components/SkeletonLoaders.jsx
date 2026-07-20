// --- SKELETON CARD (PROJECTS) ---
export function SkeletonCard() {
  return (
    <div className="w-full rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden p-6 space-y-4 animate-pulse">
      <div className="w-full h-64 bg-white/5 rounded-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 w-1/3 bg-white/10 rounded-md" />
        <div className="h-3 w-1/6 bg-accent/20 rounded-md" />
      </div>
      <div className="h-6 w-3/4 bg-white/10 rounded-md" />
      <div className="h-3 w-full bg-white/5 rounded-md" />
    </div>
  );
}

// --- SKELETON INSIGHT ---
export function SkeletonInsight() {
  return (
    <div className="w-full p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-3 w-16 bg-accent/20 rounded-full" />
        <div className="h-3 w-20 bg-white/10 rounded-full" />
      </div>
      <div className="h-6 w-5/6 bg-white/10 rounded-md" />
      <div className="h-4 w-full bg-white/5 rounded-md" />
      <div className="h-4 w-2/3 bg-white/5 rounded-md" />
    </div>
  );
}

// --- SKELETON DASHBOARD ---
export function SkeletonDashboard() {
  return (
    <div className="w-full p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-white/10" />
        <div className="space-y-2 flex-1">
          <div className="h-5 w-1/3 bg-white/10 rounded-md" />
          <div className="h-3 w-1/4 bg-white/5 rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-white/5 rounded-xl p-4 space-y-2">
            <div className="h-3 w-1/2 bg-white/10 rounded" />
            <div className="h-5 w-3/4 bg-accent/20 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
