import { useState } from 'react'
import { ExternalLink, ChevronDown, ChevronUp, Lightbulb, Sparkles } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import SentimentBadge from './SentimentBadge'
import CategoryBadge from './CategoryBadge'
import clsx from 'clsx'

export default function ArticleCard({ article }) {
  const [expanded, setExpanded] = useState(false)

  const publishedAt = article.published_at ? new Date(article.published_at) : null
  const timeAgo = publishedAt ? formatDistanceToNow(publishedAt, { addSuffix: true }) : null

  return (
    <article className="group flex flex-col rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-all duration-200 overflow-hidden">
      {article.image_url && (
        <div className="relative h-44 overflow-hidden bg-slate-800">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.parentElement.style.display = 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={article.category} />
          <SentimentBadge sentiment={article.ai_sentiment} score={article.ai_sentiment_score} />
        </div>

        <h2 className="text-base font-semibold text-slate-100 leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {article.title}
        </h2>

        {article.ai_summary ? (
          <div className="flex gap-2 bg-brand-500/10 border border-brand-500/20 rounded-xl p-3">
            <Sparkles className="h-4 w-4 text-brand-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-slate-300 leading-relaxed">{article.ai_summary}</p>
          </div>
        ) : article.description ? (
          <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">{article.description}</p>
        ) : null}

        {article.ai_key_insights?.length > 0 && (
          <div>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              {expanded ? 'Hide' : 'Show'} {article.ai_key_insights.length} key insights
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {expanded && (
              <ul className="mt-2 space-y-1.5">
                {article.ai_key_insights.map((insight, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-300">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                    {insight}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-800">
          <div className="flex flex-col">
            {article.source_name && (
              <span className="text-xs font-medium text-slate-400">{article.source_name}</span>
            )}
            {timeAgo && (
              <span className="text-xs text-slate-600">{timeAgo}</span>
            )}
          </div>

          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              Read full article
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
