import { useState, useCallback } from 'react'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import FilterBar from './components/FilterBar'
import ArticleCard from './components/ArticleCard'
import Pagination from './components/Pagination'
import SkeletonCard from './components/SkeletonCard'
import EmptyState from './components/EmptyState'
import { useArticles, useStats } from './hooks/useArticles'
import { triggerPipeline } from './api/client'
import { AlertTriangle } from 'lucide-react'

const DEFAULT_FILTERS = {
  search: '',
  category: 'all',
  sentiment: 'all',
  page: 1,
  page_size: 12,
  sort_by: 'published_at',
}

function buildApiParams(filters) {
  const params = { page: filters.page, page_size: filters.page_size, sort_by: filters.sort_by }
  if (filters.search) params.search = filters.search
  if (filters.category && filters.category !== 'all') params.category = filters.category
  if (filters.sentiment && filters.sentiment !== 'all') params.sentiment = filters.sentiment
  return params
}

export default function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [fetchingEmpty, setFetchingEmpty] = useState(false)

  const { data, loading, error, refresh } = useArticles(buildApiParams(filters))
  const { stats, refresh: refreshStats } = useStats()

  const handleRefreshAll = useCallback(() => {
    refresh()
    refreshStats()
  }, [refresh, refreshStats])

  const handleEmptyFetch = async () => {
    setFetchingEmpty(true)
    try {
      await triggerPipeline()
      handleRefreshAll()
    } finally {
      setFetchingEmpty(false)
    }
  }

  const articles = data?.articles || []
  const isEmpty = !loading && articles.length === 0 && !filters.search && filters.category === 'all' && filters.sentiment === 'all'

  return (
    <div className="min-h-screen bg-slate-950">
      <Header onRefresh={handleRefreshAll} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-100">News Intelligence Dashboard</h1>
          <p className="text-sm text-slate-500">
            Real-time news with AI-generated summaries, sentiment analysis, and key insights
          </p>
        </div>

        <StatsBar stats={stats} />

        <FilterBar filters={filters} onChange={setFilters} categoryBreakdown={stats?.category_breakdown || {}} />

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {isEmpty ? (
          <EmptyState onFetch={handleEmptyFetch} loading={fetchingEmpty} />
        ) : (
          <>
            {!loading && data && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  <span className="text-slate-300 font-medium">{data.total}</span> articles found
                  {filters.search && <span> for "<span className="text-brand-400">{filters.search}</span>"</span>}
                </p>
                <p className="text-xs text-slate-600">
                  Page {data.page} of {data.total_pages}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {loading
                ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
                : articles.map((article) => <ArticleCard key={article.id} article={article} />)}
            </div>

            {!loading && articles.length === 0 && (
              <div className="text-center py-16 text-slate-500">
                No articles match your current filters.
              </div>
            )}

            {data && data.total_pages > 1 && (
              <Pagination
                page={filters.page}
                totalPages={data.total_pages}
                onChange={(p) => setFilters((f) => ({ ...f, page: p }))}
              />
            )}
          </>
        )}
      </main>

      <footer className="border-t border-slate-800 mt-16 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-600">
          NewsIQ — AI-Powered News Intelligence Platform · Powered by NewsData.io & OpenAI
        </div>
      </footer>
    </div>
  )
}
