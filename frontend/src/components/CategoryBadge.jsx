import clsx from 'clsx'

const palette = {
  technology: 'bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/30',
  business: 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30',
  science: 'bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/30',
  health: 'bg-pink-500/15 text-pink-400 ring-1 ring-pink-500/30',
  sports: 'bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30',
  entertainment: 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30',
  general: 'bg-slate-500/20 text-slate-400 ring-1 ring-slate-500/30',
}

export default function CategoryBadge({ category }) {
  if (!category) return null
  const classes = palette[category?.toLowerCase()] || palette.general
  return (
    <span className={clsx('inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize', classes)}>
      {category}
    </span>
  )
}
