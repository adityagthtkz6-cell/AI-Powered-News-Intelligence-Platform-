import { useState } from 'react'
import { Zap, RefreshCw, Brain, CheckCircle2, AlertCircle } from 'lucide-react'
import { triggerPipeline, triggerAIProcess } from '../api/client'
import clsx from 'clsx'

export default function Header({ onRefresh }) {
  const [pipelineState, setPipelineState] = useState('idle')
  const [aiState, setAiState] = useState('idle')
  const [message, setMessage] = useState(null)

  const handlePipeline = async () => {
    setPipelineState('loading')
    setMessage(null)
    try {
      const result = await triggerPipeline()
      if (result.new_articles === 0) {
        setMessage({ type: 'warn', text: 'No new articles — all fetched articles already exist in the database' })
        setPipelineState('idle')
      } else {
        setMessage({ type: 'success', text: `Fetched ${result.new_articles} new articles, AI processed ${result.ai_processed}` })
        setPipelineState('done')
        onRefresh?.()
      }
    } catch (e) {
      setMessage({ type: 'error', text: e.response?.data?.detail || 'Pipeline failed' })
      setPipelineState('idle')
    }
    setTimeout(() => { setPipelineState('idle'); setMessage(null) }, 5000)
  }

  const handleAI = async () => {
    setAiState('loading')
    setMessage(null)
    try {
      const result = await triggerAIProcess(20)
      if (result.processed === 0) {
        setMessage({ type: 'warn', text: 'All articles are already AI-analyzed — nothing to process' })
      } else {
        setMessage({ type: 'success', text: result.message })
        onRefresh?.()
      }
      setAiState('done')
    } catch (e) {
      setMessage({ type: 'error', text: 'AI processing failed' })
      setAiState('idle')
    }
    setTimeout(() => { setAiState('idle'); setMessage(null) }, 5000)
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-xl px-3 py-1.5">
              <Zap className="h-4 w-4 text-brand-400" />
              <span className="text-sm font-bold text-brand-300">NewsIQ</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs text-slate-500">AI-Powered News Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {message && (
              <div className={clsx(
                'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg max-w-xs',
                message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                message.type === 'warn' ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-red-500/10 text-red-400'
              )}>
                {message.type === 'success' ? <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" /> : <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />}
                <span className="truncate">{message.text}</span>
              </div>
            )}
            <button
              onClick={handleAI}
              disabled={aiState === 'loading'}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 text-xs font-medium px-3 py-2 rounded-lg transition-all disabled:opacity-50"
            >
              <Brain className={clsx('h-3.5 w-3.5', aiState === 'loading' && 'animate-pulse')} />
              <span className="hidden sm:inline">{aiState === 'loading' ? 'Analyzing…' : 'AI Process'}</span>
            </button>
            <button
              onClick={handlePipeline}
              disabled={pipelineState === 'loading'}
              className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all disabled:opacity-60 shadow-lg shadow-brand-500/25"
            >
              <RefreshCw className={clsx('h-3.5 w-3.5', pipelineState === 'loading' && 'animate-spin')} />
              <span className="hidden sm:inline">{pipelineState === 'loading' ? 'Fetching…' : 'Fetch News'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
