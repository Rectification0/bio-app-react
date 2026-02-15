import { useState, useEffect } from 'react'
import { Activity, TrendingUp, AlertCircle, Sparkles, BarChart3 } from 'lucide-react'
import { getHistory, getHealthSummary, getCropRecommendations, getFertilizerPlan } from '../services/api'
import type { SoilRecord, AIRecommendation } from '../types'
import LoadingSpinner from './LoadingSpinner'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts'

export default function Dashboard() {
  const [latestRecord, setLatestRecord] = useState<SoilRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<{
    summary?: AIRecommendation
    crops?: AIRecommendation
    fertilizer?: AIRecommendation
  }>({})

  useEffect(() => {
    loadLatestRecord()
  }, [])

  const loadLatestRecord = async () => {
    try {
      setLoading(true)
      const records = await getHistory(undefined, 1)
      if (records.length > 0) {
        setLatestRecord(records[0])
      }
    } catch (error) {
      console.error('Failed to load latest record:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAIRecommendation = async (type: 'summary' | 'crops' | 'fertilizer') => {
    if (!latestRecord) return

    try {
      setAiLoading(type)
      const request = {
        soil_data: latestRecord.soil_data,
        location: latestRecord.location,
      }

      let result: AIRecommendation
      if (type === 'summary') {
        result = await getHealthSummary(request)
      } else if (type === 'crops') {
        result = await getCropRecommendations(request)
      } else {
        result = await getFertilizerPlan(request)
      }

      setRecommendations((prev) => ({ ...prev, [type]: result }))
    } catch (error) {
      console.error(`Failed to load ${type} recommendation:`, error)
    } finally {
      setAiLoading(null)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  if (!latestRecord) {
    return (
      <div className="text-center py-16">
        <Activity className="w-24 h-24 mx-auto text-slate-600 mb-6" />
        <h2 className="text-3xl font-bold mb-4">Welcome to NutriSense</h2>
        <p className="text-slate-400 text-lg mb-8">
          Get started by entering your soil data in the <strong>Input</strong> tab
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { icon: '🧪', title: 'Chemistry Analysis', desc: 'pH, EC, NPK levels' },
            { icon: '💧', title: 'Physical Properties', desc: 'Moisture & temperature' },
            { icon: '🦠', title: 'Biological Activity', desc: 'Microbial health index' },
            { icon: '🤖', title: 'AI Insights', desc: 'Smart recommendations' },
          ].map((feature, i) => (
            <div key={i} className="card text-center">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h4 className="font-semibold mb-2">{feature.title}</h4>
              <p className="text-sm text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const { soil_data, health_score, location, timestamp } = latestRecord

  // Prepare chart data
  const radarData = Object.entries(soil_data).map(([key, value]) => {
    const optimal = getOptimalValue(key)
    const percentage = optimal > 0 ? Math.min((value / optimal) * 100, 150) : 0
    return {
      parameter: key,
      value: percentage,
      actual: value,
      unit: getUnit(key)
    }
  })

  const barData = Object.entries(soil_data).map(([key, value]) => {
    const { status, color } = getParameterStatus(key, value)
    return {
      name: key,
      value: value,
      status: status,
      color: color,
      unit: getUnit(key)
    }
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Soil Analysis Overview</h2>
        {location && <p className="text-slate-400 text-lg">📍 {location}</p>}
        <p className="text-slate-500 text-sm mt-1">
          {new Date(timestamp).toLocaleString()}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-5xl font-bold mb-2" style={{ color: getHealthColor(health_score) }}>
            {health_score.toFixed(0)}
          </div>
          <h4 className="font-semibold mb-1">Health Score</h4>
          <p className="text-sm" style={{ color: getHealthColor(health_score) }}>
            {getHealthStatus(health_score)}
          </p>
          <div className="mt-3 bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${health_score}%`,
                backgroundColor: getHealthColor(health_score),
              }}
            />
          </div>
        </div>

        <div className="card text-center">
          <div className="text-5xl font-bold text-blue-400 mb-2">8</div>
          <h4 className="font-semibold mb-1">Parameters Tracked</h4>
          <p className="text-sm text-green-400">All Systems Active</p>
        </div>

        <div className="card text-center">
          <div className="text-5xl font-bold text-blue-400 mb-2">
            {Object.values(soil_data).filter((v, i) => {
              const params = ['pH', 'EC', 'Moisture', 'Nitrogen', 'Phosphorus', 'Potassium', 'Microbial', 'Temperature']
              return isOptimal(params[i], v)
            }).length}
          </div>
          <h4 className="font-semibold mb-1">Optimal Parameters</h4>
          <p className="text-sm text-green-400">Out of 8 tracked</p>
        </div>
      </div>

      {/* Parameters */}
      <div>
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Parameter Analysis
        </h3>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Radar Chart */}
          <div className="card">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Parameter Balance Overview
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#475569" />
                <PolarAngleAxis 
                  dataKey="parameter" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 150]} 
                  tick={{ fill: '#94a3b8' }}
                />
                <Radar 
                  name="Current Level" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6} 
                />
              </RadarChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-400 text-center mt-2">
              Values shown as percentage of optimal range (100% = optimal)
            </p>
          </div>

          {/* Bar Chart */}
          <div className="card">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Parameter Values
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                  formatter={(value: any, name: string, props: any) => [
                    `${value} ${props.payload.unit}`,
                    props.payload.status
                  ]}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Parameter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(soil_data).map(([key, value]) => {
            const { status, emoji, color } = getParameterStatus(key, value)
            return (
              <div key={key} className={`card border-l-4`} style={{ borderLeftColor: color }}>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl mr-2">{emoji}</span>
                    <strong>{key}:</strong> {value.toFixed(1)} {getUnit(key)}
                  </div>
                  <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: `${color}20`, color }}>
                    {status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* AI Recommendations */}
      <div>
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          AI-Powered Insights
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            { key: 'summary', label: 'Health Summary', icon: '✨', desc: 'Overall soil condition and top actions' },
            { key: 'crops', label: 'Crop Recommendations', icon: '🌾', desc: 'Best crops for your soil' },
            { key: 'fertilizer', label: 'Fertilizer Plan', icon: '💊', desc: 'NPK ratios and application timing' },
          ].map(({ key, label, icon, desc }) => (
            <div key={key} className="card flex flex-col">
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-1 flex items-center gap-2">
                  <span className="text-2xl">{icon}</span>
                  {label}
                </h4>
                <p className="text-sm text-slate-400">{desc}</p>
              </div>
              {recommendations[key as keyof typeof recommendations] ? (
                <div className="bg-slate-700/50 rounded-lg p-4 text-sm flex-1 overflow-y-auto max-h-96">
                  {formatAIResponse(recommendations[key as keyof typeof recommendations]!.content)}
                </div>
              ) : (
                <button
                  onClick={() => loadAIRecommendation(key as any)}
                  disabled={aiLoading === key}
                  className="btn-primary w-full mt-auto"
                >
                  {aiLoading === key ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Generating...
                    </span>
                  ) : (
                    'Generate Recommendation'
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getHealthColor(score: number): string {
  if (score >= 70) return '#10b981'
  if (score >= 50) return '#f59e0b'
  return '#ef4444'
}

function getHealthStatus(score: number): string {
  if (score >= 70) return 'Excellent'
  if (score >= 50) return 'Good'
  return 'Needs Attention'
}

function getUnit(param: string): string {
  const units: Record<string, string> = {
    pH: 'pH',
    EC: 'dS/m',
    Moisture: '%',
    Nitrogen: 'mg/kg',
    Phosphorus: 'mg/kg',
    Potassium: 'mg/kg',
    Microbial: 'Index',
    Temperature: '°C',
  }
  return units[param] || ''
}

function isOptimal(param: string, value: number): boolean {
  const ranges: Record<string, [number, number]> = {
    pH: [6.5, 7.5],
    EC: [0, 0.8],
    Moisture: [25, 40],
    Nitrogen: [40, 80],
    Phosphorus: [20, 50],
    Potassium: [100, 250],
    Microbial: [3, 7],
    Temperature: [10, 30],
  }
  const [min, max] = ranges[param] || [0, 0]
  return value >= min && value <= max
}

function getParameterStatus(param: string, value: number): { status: string; emoji: string; color: string } {
  if (isOptimal(param, value)) {
    return { status: 'Optimal', emoji: '🟢', color: '#10b981' }
  }
  
  // Check if critically low or high
  const criticalRanges: Record<string, { low: number; high: number }> = {
    pH: { low: 5.5, high: 8.5 },
    EC: { low: 0, high: 2 },
    Moisture: { low: 15, high: 60 },
    Nitrogen: { low: 40, high: 80 },
    Phosphorus: { low: 20, high: 50 },
    Potassium: { low: 100, high: 250 },
    Microbial: { low: 3, high: 7 },
    Temperature: { low: 10, high: 30 },
  }
  
  const range = criticalRanges[param]
  if (range && (value < range.low || value > range.high)) {
    return { status: 'Critical', emoji: '🔴', color: '#ef4444' }
  }
  
  return { status: 'Warning', emoji: '🟡', color: '#f59e0b' }
}

function getOptimalValue(param: string): number {
  const optimalValues: Record<string, number> = {
    pH: 7.0,
    EC: 0.8,
    Moisture: 32.5,
    Nitrogen: 60,
    Phosphorus: 35,
    Potassium: 175,
    Microbial: 5,
    Temperature: 20,
  }
  return optimalValues[param] || 1
}

function formatAIResponse(content: string) {
  // Helper function to render text with bold formatting
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2)
        return <strong key={i} className="text-white font-semibold">{boldText}</strong>
      }
      return <span key={i}>{part}</span>
    })
  }

  // Split content into lines
  const lines = content.split('\n').filter(line => line.trim())
  const elements: JSX.Element[] = []
  let currentList: string[] = []
  let listType: 'bullet' | 'numbered' | null = null

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={elements.length} className="space-y-2 ml-4 mb-4">
          {currentList.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-blue-400 flex-shrink-0 mt-1 font-semibold">
                {listType === 'numbered' ? `${i + 1}.` : '•'}
              </span>
              <span className="text-slate-300 leading-relaxed">{renderText(item)}</span>
            </li>
          ))}
        </ul>
      )
      currentList = []
      listType = null
    }
  }

  lines.forEach((line) => {
    // Skip greeting/closing lines
    if (line.match(/^(Namaste|Happy farming|Remember|Consult|Additionally|Some additional tips)/i)) {
      return
    }

    // Main section headers - just **Text**: at start of line
    if (line.match(/^\d+\.\s*\*\*[^*]+\*\*:\s*$/)) {
      flushList()
      const cleanLine = line.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '').replace(':', '').trim()
      elements.push(
        <h5 key={elements.length} className="font-bold text-blue-400 mt-5 mb-3 text-base border-b border-blue-400/30 pb-2">
          {cleanLine}
        </h5>
      )
      return
    }

    // Numbered crop items: 1. **Wheat (Triticum aestivum)**: Description
    const cropMatch = line.match(/^(\d+)\.\s*\*\*([^*]+)\*\*:\s*(.+)/)
    if (cropMatch) {
      flushList()
      const [, num, title, description] = cropMatch
      elements.push(
        <div key={elements.length} className="bg-slate-700/30 rounded-lg p-4 mb-3 border-l-4 border-blue-500">
          <div className="flex gap-3">
            <span className="text-blue-400 font-bold text-lg flex-shrink-0">{num}.</span>
            <div className="flex-1">
              <h6 className="font-semibold text-white mb-2 text-base">{title}</h6>
              <p className="text-slate-300 text-sm leading-relaxed">{renderText(description)}</p>
            </div>
          </div>
        </div>
      )
      return
    }

    // Section headers without numbers: **NPK Ratio**
    if (line.match(/^\*\*[^*]+\*\*\s*$/) && line.length < 50) {
      flushList()
      const cleanLine = line.replace(/\*\*/g, '').trim()
      elements.push(
        <h5 key={elements.length} className="font-bold text-blue-400 mt-5 mb-3 text-base border-b border-blue-400/30 pb-2">
          {cleanLine}
        </h5>
      )
      return
    }

    // Subsection with content: **Timing**\nApply fertilizers...
    if (line.match(/^\*\*[^*]+\*\*$/) && line.length < 80) {
      flushList()
      const cleanLine = line.replace(/\*\*/g, '').trim()
      elements.push(
        <h6 key={elements.length} className="font-semibold text-white mt-4 mb-2">
          {cleanLine}
        </h6>
      )
      return
    }

    // Bullet points with • or -
    if (line.match(/^[•\-]\s+/)) {
      const item = line.replace(/^[•\-]\s+/, '').trim()
      if (listType !== 'bullet') {
        flushList()
        listType = 'bullet'
      }
      currentList.push(item)
      return
    }

    // Numbered list items: 1. Text (not bold)
    const simpleNumberMatch = line.match(/^(\d+)\.\s+([^*].+)/)
    if (simpleNumberMatch) {
      const [, , item] = simpleNumberMatch
      if (listType !== 'numbered') {
        flushList()
        listType = 'numbered'
      }
      currentList.push(item)
      return
    }

    // Regular paragraph
    if (line.trim()) {
      flushList()
      elements.push(
        <p key={elements.length} className="text-slate-300 leading-relaxed mb-3">
          {renderText(line)}
        </p>
      )
    }
  })

  flushList()
  return <div className="space-y-1">{elements}</div>
}
