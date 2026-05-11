import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

const slowApi = axios.create({
  baseURL: '/api',
  timeout: 300000,
})

export const fetchArticles = (params = {}) =>
  api.get('/articles', { params }).then((r) => r.data)

export const fetchArticle = (id) =>
  api.get(`/articles/${id}`).then((r) => r.data)

export const fetchStats = () =>
  api.get('/articles/stats').then((r) => r.data)

export const triggerPipeline = () =>
  slowApi.post('/pipeline/trigger').then((r) => r.data)

export const triggerAIProcess = (batchSize = 20) =>
  slowApi.post('/pipeline/ai-process', null, { params: { batch_size: batchSize } }).then((r) => r.data)

export default api
