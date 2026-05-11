export default function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden animate-pulse">
      <div className="h-44 bg-slate-800" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-20 bg-slate-800 rounded-full" />
          <div className="h-5 w-16 bg-slate-800 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-800 rounded w-4/5" />
        </div>
        <div className="h-16 bg-slate-800/50 rounded-xl" />
        <div className="flex justify-between pt-2 border-t border-slate-800">
          <div className="h-3 w-24 bg-slate-800 rounded" />
          <div className="h-3 w-20 bg-slate-800 rounded" />
        </div>
      </div>
    </div>
  )
}
