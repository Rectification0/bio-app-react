import { useState, useEffect } from 'react'
import { Trash2, Download, Search } from 'lucide-react'
import { getHistory, deleteRecord, exportHistory } from '../services/api'
import type { SoilRecord } from '../types'
import LoadingSpinner from './LoadingSpinner'

export default function HistoryView() {
  const [records, setRecords] = useState<SoilRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [locationFilter, setLocationFilter] = useState('')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    loadRecords()
  }, [locationFilter])

  const loadRecords = async () => {
    try {
      setLoading(true)
      const data = await getHistory(locationFilter || undefined, 50)
      setRecords(data)
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this record?')) return

    try {
      await deleteRecord(id)
      setRecords((prev) => prev.filter((r) => r.id !== id))
    } catch (error) {
      console.error('Failed to delete record:', error)
      alert('Failed to delete record')
    }
  }

  const handleExport = async () => {
    try {
      setExporting(true)
      const blob = await exportHistory(locationFilter || undefined, 100)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `soil_history_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to export history:', error)
      alert('Failed to export history')
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading history..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Analysis History</h2>
          <p className="text-slate-400">View and manage past soil analyses</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || records.length === 0}
          className="btn-secondary flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Filter by location..."
            className="input flex-1"
          />
        </div>
      </div>

      {/* Records */}
      {records.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-slate-400 text-lg">No records found</p>
          {locationFilter && (
            <button
              onClick={() => setLocationFilter('')}
              className="btn-secondary mt-4"
            >
              Clear Filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {records.map((record) => (
            <div key={record.id} className="card hover:border-blue-500/50 transition-colors">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">
                      {record.location || 'Unknown Location'}
                    </h3>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: getHealthColor(record.health_score) + '20',
                        color: getHealthColor(record.health_score),
                      }}
                    >
                      Score: {record.health_score.toFixed(0)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">
                    {new Date(record.timestamp).toLocaleString()}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    {Object.entries(record.soil_data).map(([key, value]) => (
                      <div key={key} className="bg-slate-700/30 rounded px-2 py-1">
                        <span className="text-slate-400">{key}:</span>{' '}
                        <span className="font-medium">{value.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                  {record.summary && (
                    <div className="mt-3 bg-slate-700/30 rounded-lg p-3 text-sm">
                      <p className="text-slate-300 line-clamp-2">{record.summary}</p>
                    </div>
                  )}
                </div>
                <div className="flex md:flex-col gap-2">
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="btn-secondary flex items-center gap-2 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-400">{records.length}</div>
            <p className="text-sm text-slate-400">Total Records</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400">
              {records.filter((r) => r.health_score >= 70).length}
            </div>
            <p className="text-sm text-slate-400">Excellent Health</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-400">
              {records.filter((r) => r.health_score < 70 && r.health_score >= 50).length}
            </div>
            <p className="text-sm text-slate-400">Needs Attention</p>
          </div>
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
