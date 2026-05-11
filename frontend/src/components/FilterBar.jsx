import { Search, SlidersHorizontal, X } from 'lucide-react'
import clsx from 'clsx'

const SENTIMENTS = ['all', 'positive', 'negative', 'neutral']

const SENTIMENT_ACTIVE = {
  all: 'bg-brand-500 text-white shadow-lg shadow-brand-500/25',
  positive: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25',
  negative: 'bg-red-500 text-white shadow-lg shadow-red-500/25',
  neutral: 'bg-slate-500 text-white shadow-lg shadow-slate-500/25',
}

function FilterChip({ label, active, onClick, sentimentColor }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap',
        active
          ? (sentimentColor || 'bg-brand-500 text-white shadow-lg shadow-brand-500/25')
          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
      )}
    >
      {label === 'all' ? 'All' : label.charAt(0).toUpperCase() + label.slice(1)}
    </button>
  )
}

export default function FilterBar({ filters, onChange, categoryBreakdown = {} }) {
  const { search, category, sentiment } = filters

  const CATEGORIES = ['all', ...Object.keys(categoryBreakdown).filter(k => categoryBreakdown[k] > 0).sort((a, b) => categoryBreakdown[b] - categoryBreakdown[a])]

  const handleSearch = (e) => onChange({ ...filters, search: e.target.value, page: 1 })
  const clearSearch = () => onChange({ ...filters, search: '', page: 1 })

  const hasActiveFilters =
    (search) ||
    (category && category !== 'all') ||
    (sentiment && sentiment !== 'all')

  const clearAll = () => onChange({ ...filters, search: '', category: 'all', sentiment: 'all', page: 1 })

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search articles, summaries..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50 transition-all"
        />
        {search && (
          <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mr-1">
          <SlidersHorizontal className="h-3.5 w-3.5" /> Category:
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map((c) => (
            <FilterChip
              key={c}
              label={c}
              active={category === c || (!category && c === 'all')}
              onClick={() => onChange({ ...filters, category: c, sentiment: 'all', page: 1 })}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mr-1">
          <SlidersHorizontal className="h-3.5 w-3.5" /> Sentiment:
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {SENTIMENTS.map((s) => (
            <FilterChip
              key={s}
              label={s}
              active={sentiment === s || (!sentiment && s === 'all')}
              sentimentColor={SENTIMENT_ACTIVE[s]}
              onClick={() => onChange({ ...filters, sentiment: s, category: 'all', page: 1 })}
            />
          ))}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 ml-2 transition-colors"
          >
            <X className="h-3 w-3" /> Clear all
          </button>
        )}
      </div>
    </div>
  )
}
