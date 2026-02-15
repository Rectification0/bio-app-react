import { useState } from 'react'
import { Send, AlertCircle } from 'lucide-react'
import { analyzeSoil } from '../services/api'
import type { SoilData } from '../types'

interface Props {
  onSuccess: () => void
}

export default function InputForm({ onSuccess }: Props) {
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [soilData, setSoilData] = useState<SoilData>({
    pH: 7.0,
    EC: 1.5,
    Moisture: 30.0,
    Nitrogen: 60.0,
    Phosphorus: 35.0,
    Potassium: 180.0,
    Microbial: 5.5,
    Temperature: 25.0,
  })

  const handleChange = (field: keyof SoilData, value: string) => {
    setSoilData((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await analyzeSoil({
        soil_data: soilData,
        location: location || undefined,
        save_to_history: true,
      })
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to analyze soil data')
    } finally {
      setLoading(false)
    }
  }

  const parameters = [
    {
      key: 'pH' as keyof SoilData,
      label: 'pH Level',
      min: 0,
      max: 14,
      step: 0.1,
      help: 'Soil acidity/alkalinity. Optimal: 6.5-7.5',
      icon: '🧪',
    },
    {
      key: 'EC' as keyof SoilData,
      label: 'Electrical Conductivity (dS/m)',
      min: 0,
      max: 20,
      step: 0.1,
      help: 'Soil salinity. <2.0 dS/m is ideal',
      icon: '⚡',
    },
    {
      key: 'Moisture' as keyof SoilData,
      label: 'Moisture Content (%)',
      min: 0,
      max: 100,
      step: 1,
      help: 'Current soil water content. Optimal: 25-40%',
      icon: '💧',
    },
    {
      key: 'Nitrogen' as keyof SoilData,
      label: 'Available Nitrogen (mg/kg)',
      min: 0,
      max: 500,
      step: 1,
      help: 'Essential for plant growth. Optimal: 40-80 mg/kg',
      icon: '🌱',
    },
    {
      key: 'Phosphorus' as keyof SoilData,
      label: 'Available Phosphorus (mg/kg)',
      min: 0,
      max: 200,
      step: 1,
      help: 'Important for root development. Optimal: 20-50 mg/kg',
      icon: '🌿',
    },
    {
      key: 'Potassium' as keyof SoilData,
      label: 'Available Potassium (mg/kg)',
      min: 0,
      max: 500,
      step: 1,
      help: 'Essential for disease resistance. Optimal: 100-250 mg/kg',
      icon: '🍃',
    },
    {
      key: 'Microbial' as keyof SoilData,
      label: 'Microbial Activity Index',
      min: 0,
      max: 10,
      step: 0.1,
      help: 'Biological activity level (0-10). Higher is better',
      icon: '🦠',
    },
    {
      key: 'Temperature' as keyof SoilData,
      label: 'Soil Temperature (°C)',
      min: 0,
      max: 50,
      step: 0.5,
      help: 'Current soil temperature',
      icon: '🌡️',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Enter Soil Test Results</h2>
        <p className="text-slate-400">Input your laboratory soil analysis data for AI-powered insights</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location */}
        <div className="card">
          <label className="block mb-2 font-medium">📍 Location Information (Optional)</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., North Field, Farm Block A, GPS coordinates..."
            className="input w-full"
          />
          <p className="text-sm text-slate-400 mt-2">
            Adding location helps provide more targeted recommendations
          </p>
        </div>

        {/* Parameters */}
        <div className="card">
          <h3 className="text-xl font-bold mb-4">🧪 Soil Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {parameters.map((param) => (
              <div key={param.key}>
                <label className="block mb-2 font-medium flex items-center gap-2">
                  <span className="text-xl">{param.icon}</span>
                  {param.label}
                </label>
                <input
                  type="number"
                  value={soilData[param.key]}
                  onChange={(e) => handleChange(param.key, e.target.value)}
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  required
                  className="input w-full"
                />
                <p className="text-xs text-slate-400 mt-1">{param.help}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-400">Error</p>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Analyze Soil Data
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
