export interface SoilData {
  pH: number
  EC: number
  Moisture: number
  Nitrogen: number
  Phosphorus: number
  Potassium: number
  Microbial: number
  Temperature: number
}

export interface ParameterInterpretation {
  value: number
  status: string
  emoji: string
  unit: string
}

export interface AnalysisResult {
  health_score: number
  parameters: Record<string, ParameterInterpretation>
  timestamp: string
  location?: string
}

export interface AIRecommendation {
  recommendation_type: string
  content: string
  model_used: string
  timestamp: string
}

export interface SoilRecord {
  id: number
  data_hash: string
  soil_data: SoilData
  timestamp: string
  summary?: string
  location?: string
  health_score: number
}

export interface AnalysisRequest {
  soil_data: SoilData
  location?: string
  save_to_history?: boolean
}

export interface RecommendationRequest {
  soil_data: SoilData
  location?: string
  model?: string
}
