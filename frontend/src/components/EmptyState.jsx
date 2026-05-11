import { Newspaper, RefreshCw } from 'lucide-react'

export default function EmptyState({ onFetch, loading }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="bg-slate-800 rounded-full p-6 mb-5">
        <Newspaper className="h-10 w-10 text-slate-500" />
      </div>
      <h3 className="text-xl font-semibold text-slate-200 mb-2">No articles yet</h3>
      <p className="text-slate-500 text-sm mb-6 max-w-sm">
        Click "Fetch News" to pull the latest articles from NewsData.io and analyze them with AI.
      </p>
      <button
        onClick={onFetch}
        disabled={loading}
        className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-brand-500/25"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Fetching…' : 'Fetch News Now'}
      </button>
    </div>
  )
}
