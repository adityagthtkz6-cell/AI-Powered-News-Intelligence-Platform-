import clsx from 'clsx'

const config = {
  positive: { label: 'Positive', classes: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30' },
  negative: { label: 'Negative', classes: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30' },
  neutral: { label: 'Neutral', classes: 'bg-slate-500/20 text-slate-400 ring-1 ring-slate-500/30' },
}

export default function SentimentBadge({ sentiment, score }) {
  if (!sentiment) return null
  const cfg = config[sentiment] || config.neutral
  return (
    <span className={clsx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', cfg.classes)}>
      <span
        className={clsx('h-1.5 w-1.5 rounded-full', {
          'bg-emerald-400': sentiment === 'positive',
          'bg-red-400': sentiment === 'negative',
          'bg-slate-400': sentiment === 'neutral',
        })}
      />
      {cfg.label}
      {score !== undefined && score !== null && (
        <span className="opacity-70">({score > 0 ? '+' : ''}{score.toFixed(2)})</span>
      )}
    </span>
  )
}
