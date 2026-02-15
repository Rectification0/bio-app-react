import { useState } from 'react'
import { Sprout, Activity, History, Info } from 'lucide-react'
import Dashboard from './components/Dashboard'
import InputForm from './components/InputForm'
import HistoryView from './components/HistoryView'
import Guide from './components/Guide'

type Tab = 'dashboard' | 'input' | 'history' | 'guide'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleAnalysisComplete = () => {
    setActiveTab('dashboard')
    setRefreshTrigger(prev => prev + 1)
  }

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: Activity },
    { id: 'input' as Tab, label: 'Input', icon: Sprout },
    { id: 'history' as Tab, label: 'History', icon: History },
    { id: 'guide' as Tab, label: 'Guide', icon: Info },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-2xl">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
              <Sprout className="w-10 h-10" />
              NutriSense
            </h1>
            <p className="text-blue-100 text-lg">AI-Powered Soil Intelligence Platform</p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-blue-200">
              <span>🧪 Smart Analysis</span>
              <span>🤖 AI Insights</span>
              <span>📊 Real-time Data</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white border-b-2 border-blue-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <Dashboard key={refreshTrigger} />}
        {activeTab === 'input' && <InputForm onSuccess={handleAnalysisComplete} />}
        {activeTab === 'history' && <HistoryView />}
        {activeTab === 'guide' && <Guide />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-slate-400 text-sm">
          <p>NutriSense - AI Soil Intelligence Platform v1.0.0</p>
          <p className="mt-2">Powered by FastAPI & React</p>
        </div>
      </footer>
    </div>
  )
}

export default App
