import { Newspaper, Brain, TrendingUp, TrendingDown, Minus } from 'lucide-react'

function StatCard({ icon: Icon, label, value, sub, color = 'brand' }) {
  const colorMap = {
    brand: 'text-brand-400 bg-brand-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    red: 'text-red-400 bg-red-500/10',
    slate: 'text-slate-400 bg-slate-500/10',
  }
  return (
    <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <div className={`rounded-xl p-2.5 ${colorMap[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xl font-bold text-slate-100">{value ?? '—'}</div>
        <div className="text-xs text-slate-500">{label}</div>
        {sub && <div className="text-xs text-slate-600">{sub}</div>}
      </div>
    </div>
  )
}

export default function StatsBar({ stats }) {
  if (!stats) return null
  const { total_articles, ai_processed, sentiment_breakdown = {} } = stats
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard icon={Newspaper} label="Total Articles" value={total_articles} color="brand" />
      <StatCard icon={Brain} label="AI Analyzed" value={ai_processed} sub={`${total_articles ? Math.round((ai_processed / total_articles) * 100) : 0}% coverage`} color="brand" />
      <StatCard icon={TrendingUp} label="Positive" value={sentiment_breakdown.positive ?? 0} color="emerald" />
      <StatCard icon={TrendingDown} label="Negative" value={sentiment_breakdown.negative ?? 0} color="red" />
    </div>
  )
}
