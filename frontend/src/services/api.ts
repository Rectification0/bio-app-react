import axios from 'axios'
import type {
  SoilData,
  AnalysisResult,
  AIRecommendation,
  SoilRecord,
  AnalysisRequest,
  RecommendationRequest,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Analysis endpoints
export const analyzeSoil = async (request: AnalysisRequest): Promise<AnalysisResult> => {
  const response = await api.post<AnalysisResult>('/api/analyze', request)
  return response.data
}

export const getHealthSummary = async (
  request: RecommendationRequest
): Promise<AIRecommendation> => {
  const response = await api.post<AIRecommendation>(
    '/api/analyze/recommendations/health-summary',
    request
  )
  return response.data
}

export const getCropRecommendations = async (
  request: RecommendationRequest
): Promise<AIRecommendation> => {
  const response = await api.post<AIRecommendation>(
    '/api/analyze/recommendations/crops',
    request
  )
  return response.data
}

export const getFertilizerPlan = async (
  request: RecommendationRequest
): Promise<AIRecommendation> => {
  const response = await api.post<AIRecommendation>(
    '/api/analyze/recommendations/fertilizer',
    request
  )
  return response.data
}

export const getIrrigationPlan = async (
  request: RecommendationRequest
): Promise<AIRecommendation> => {
  const response = await api.post<AIRecommendation>(
    '/api/analyze/recommendations/irrigation',
    request
  )
  return response.data
}

// History endpoints
export const getHistory = async (
  location?: string,
  limit: number = 20,
  offset: number = 0
): Promise<SoilRecord[]> => {
  const params = new URLSearchParams()
  if (location) params.append('location', location)
  params.append('limit', limit.toString())
  params.append('offset', offset.toString())

  const response = await api.get<SoilRecord[]>(`/api/history?${params}`)
  return response.data
}

export const getRecordById = async (id: number): Promise<SoilRecord> => {
  const response = await api.get<SoilRecord>(`/api/history/${id}`)
  return response.data
}

export const deleteRecord = async (id: number): Promise<void> => {
  await api.delete(`/api/history/${id}`)
}

export const exportHistory = async (location?: string, limit: number = 100): Promise<Blob> => {
  const params = new URLSearchParams()
  if (location) params.append('location', location)
  params.append('limit', limit.toString())

  const response = await api.post(`/api/history/export?${params}`, null, {
    responseType: 'blob',
  })
  return response.data
}

// Health check
export const healthCheck = async (): Promise<any> => {
  const response = await api.get('/health')
  return response.data
}

export default api
