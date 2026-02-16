import { useState } from 'react'
import { Sprout, Activity, History, Info } from 'lucide-react'
import Dashboard from './components/Dashboard'
import InputForm from './components/InputForm'
import HistoryView from './components/HistoryView'
import Guide from './components/Guide'

/**
 * Tab type definition for navigation
 */
type Tab = 'dashboard' | 'input' | 'history' | 'guide'

/**
 * Main application component for NutriSense Soil Analysis
 * 
 * Provides a tabbed interface with:
 * - Dashboard: Overview of soil analysis results
 * - Analyze Soil: Input form for new soil samples
 * - History: Historical analysis records
 * - Guide: User guide and documentation
 */
function App() {
  // Active tab state management
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  
  // Refresh trigger to force dashboard re-render after new analysis
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  /**
   * Callback handler when soil analysis is completed
   * Switches to dashboard and triggers a refresh to show new data
   */
  const handleAnalysisComplete = () => {
    setActiveTab('dashboard')
    setRefreshTrigger(prev => prev + 1)
  }

  // Navigation tab configuration
  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: Activity },
    { id: 'input' as Tab, label: 'Analyze Soil', icon: Sprout },
    { id: 'history' as Tab, label: 'History', icon: History },
    { id: 'guide' as Tab, label: 'Guide', icon: Info },
  ]

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 hidden md:flex flex-col">
        {/* App Logo and Title */}
        <div className="flex items-center gap-3 mb-10">
          <Sprout className="w-8 h-8 text-green-500" />
          <h1 className="text-xl font-bold">NutriSense</h1>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-col gap-2">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            )
          })}
        </nav>

        {/* Version Info */}
        <div className="mt-auto text-xs text-slate-500 pt-10">
          AI Soil Intelligence v1.0
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-800 flex items-center px-6 bg-slate-950">
          <h2 className="text-lg font-semibold capitalize">{activeTab}</h2>
        </header>

        {/* Dynamic Content Based on Active Tab */}
        <main className="flex-1 p-6 bg-slate-950">
          {activeTab === 'dashboard' && <Dashboard key={refreshTrigger} />}
          {activeTab === 'input' && <InputForm onSuccess={handleAnalysisComplete} />}
          {activeTab === 'history' && <HistoryView />}
          {activeTab === 'guide' && <Guide />}
        </main>
      </div>
    </div>
  )
}

export default App
