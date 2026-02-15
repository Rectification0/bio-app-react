import { BookOpen, Target, Beaker, Sprout } from 'lucide-react'

export default function Guide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">User Guide</h2>
        <p className="text-slate-400">Learn how to use NutriSense effectively</p>
      </div>

      {/* Getting Started */}
      <div className="card">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-400" />
          Getting Started
        </h3>
        <div className="space-y-4 text-slate-300">
          <div>
            <h4 className="font-semibold text-white mb-2">1. Collect Soil Sample</h4>
            <p>Take soil samples from your field and send them to a laboratory for analysis.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">2. Enter Test Results</h4>
            <p>Go to the Input tab and enter the 8 parameters from your lab report.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">3. View Analysis</h4>
            <p>Check the Dashboard for your soil health score and parameter interpretations.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">4. Get AI Recommendations</h4>
            <p>Generate AI-powered recommendations for crops, fertilizers, and irrigation.</p>
          </div>
        </div>
      </div>

      {/* Parameters */}
      <div className="card">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Beaker className="w-6 h-6 text-blue-400" />
          Soil Parameters Explained
        </h3>
        <div className="space-y-4">
          {[
            {
              name: 'pH Level',
              optimal: '6.5-7.5',
              description: 'Measures soil acidity/alkalinity. Affects nutrient availability.',
              icon: '🧪',
            },
            {
              name: 'Electrical Conductivity (EC)',
              optimal: '<0.8 dS/m',
              description: 'Indicates soil salinity. High EC can harm plant roots.',
              icon: '⚡',
            },
            {
              name: 'Moisture Content',
              optimal: '25-40%',
              description: 'Current water content in soil. Critical for plant growth.',
              icon: '💧',
            },
            {
              name: 'Nitrogen (N)',
              optimal: '40-80 mg/kg',
              description: 'Essential for leaf growth and green color.',
              icon: '🌱',
            },
            {
              name: 'Phosphorus (P)',
              optimal: '20-50 mg/kg',
              description: 'Important for root development and flowering.',
              icon: '🌿',
            },
            {
              name: 'Potassium (K)',
              optimal: '100-250 mg/kg',
              description: 'Enhances disease resistance and fruit quality.',
              icon: '🍃',
            },
            {
              name: 'Microbial Activity',
              optimal: '3-7 index',
              description: 'Biological health indicator. Higher is better.',
              icon: '🦠',
            },
            {
              name: 'Temperature',
              optimal: '10-30°C',
              description: 'Affects microbial activity and nutrient availability.',
              icon: '🌡️',
            },
          ].map((param) => (
            <div key={param.name} className="bg-slate-700/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{param.icon}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">{param.name}</h4>
                  <p className="text-sm text-green-400 mb-2">Optimal: {param.optimal}</p>
                  <p className="text-sm text-slate-300">{param.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Score */}
      <div>
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Sprout className="w-6 h-6" />
          Understanding Health Score
        </h3>
        <div className="space-y-4">
          <p className="text-slate-300 leading-relaxed">
            The health score (0-100) is calculated based on all 8 parameters with weighted contributions:
          </p>
          
          <div className="bg-slate-700/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">pH Balance</span>
              <span className="text-blue-400 font-semibold">25 points</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Electrical Conductivity</span>
              <span className="text-blue-400 font-semibold">25 points</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Moisture Content</span>
              <span className="text-blue-400 font-semibold">20 points</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">NPK Nutrients</span>
              <span className="text-blue-400 font-semibold">30 points (10 each)</span>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            <div className="flex items-start gap-4 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-bold text-green-400">70+</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white text-lg mb-1">Excellent Health</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Soil is in great condition for most crops. All parameters are within or near optimal ranges. 
                  Continue current management practices.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 leading-tight">50</div>
                  <div className="text-xs text-yellow-400">-69</div>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white text-lg mb-1">Good Health</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Soil is functional but has room for improvement. Some parameters may be slightly off. 
                  Minor adjustments recommended for optimal yields.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400 leading-tight">&lt;50</div>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white text-lg mb-1">Needs Attention</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Soil requires significant improvements. Multiple parameters are outside optimal ranges. 
                  Follow AI recommendations and consider soil amendments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-400" />
          Tips for Best Results
        </h3>
        <ul className="space-y-3 text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>Take soil samples from multiple locations in your field for better accuracy</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>Test soil at the same time each year for consistent comparisons</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>Add location information to track different fields separately</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>Use AI recommendations as guidance, but consult local experts too</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>Export your history regularly to track improvements over time</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
