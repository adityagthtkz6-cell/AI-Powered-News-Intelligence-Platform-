import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const delta = 2
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages[0] > 1 && (
        <>
          <button onClick={() => onChange(1)} className="px-3 py-1.5 text-sm rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all">1</button>
          {pages[0] > 2 && <span className="text-slate-600 px-1">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={clsx(
            'px-3 py-1.5 text-sm rounded-lg font-medium transition-all',
            p === page
              ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          )}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="text-slate-600 px-1">…</span>}
          <button onClick={() => onChange(totalPages)} className="px-3 py-1.5 text-sm rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
