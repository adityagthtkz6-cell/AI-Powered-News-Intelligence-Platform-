import { useState, useEffect, useCallback } from 'react'
import { fetchArticles, fetchStats } from '../api/client'

export function useArticles(filters) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchArticles(filters)
      setData(result)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to load articles')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters)])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, refresh: load }
}

export function useStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const result = await fetchStats()
      setStats(result)
    } catch (_) {
      /* silent */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { stats, loading, refresh: load }
}
