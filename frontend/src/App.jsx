import { useState, useEffect } from "react"
import { api } from "./services/api"
import InputForm from "./components/InputForm"
import ModelCard from "./components/ModelCard"
import ConsensusCard from "./components/ConsensusCard"
import ComparisonChart from "./components/ComparisonChart"

export default function App() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [error,   setError]   = useState(null)
  const [tab,     setTab]     = useState("predict")

  // Load comparison metrics once on mount
  useEffect(() => {
    api.metrics()
      .then(d => setMetrics(d.metrics))
      .catch(() => {})
  }, [])

  const handlePredict = async (features) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.predict(features)
      setResults(data)
      setTab("predict")
    } catch (e) {
      setError(
        e?.response?.data?.error ??
        "Cannot reach Django. Make sure it's running on port 8000."
      )
    } finally {
      setLoading(false)
    }
  }

  const TABS = [
    { key: "predict", label: "🌿 Predictions" },
    { key: "metrics", label: "📊 Comparison"  },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <header className="bg-gradient-to-r from-green-800 to-green-600 shadow-lg">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">🌾 CropIQ</h1>
            <p className="text-green-200 text-xs mt-0.5">
              Multiple ML models predict your best crop simultaneously
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-green-900/40 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-200 text-xs font-medium">
              {metrics ? `${Object.keys(metrics).length} models loaded` : "Loading..."}
            </span>
          </div>
        </div>
      </header>

      {/* ── Main grid ── */}
      <div className="max-w-screen-xl mx-auto px-4 py-6
                      grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">

        {/* ── Left: Input panel ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:sticky lg:top-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-base">
              🧪
            </div>
            <h2 className="text-base font-bold text-gray-800">Soil & Climate Input</h2>
          </div>
          <InputForm onSubmit={handlePredict} loading={loading} />
        </div>

        {/* ── Right: Results panel ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200 mb-6">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-5 py-2.5 text-sm font-semibold rounded-t-xl border-b-2 -mb-px transition-all
                  ${tab === t.key
                    ? "text-green-700 border-green-600 bg-green-50"
                    : "text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50"
                  }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200
                            text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
              <span className="text-lg leading-none">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* ── Predictions tab ── */}
          {tab === "predict" && (
            results ? (
              <div className="flex flex-col gap-6">
                {/* Consensus banner */}
                <ConsensusCard
                  majority_vote={results.majority_vote}
                  vote_count={results.vote_count}
                  total_models={results.total_models}
                />

                {/* Model cards */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                      All Model Predictions
                    </h3>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                      {results.total_models} model{results.total_models !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {results.results.map(r => (
                      <ModelCard
                        key={r.slug}
                        r={r}
                        isWinner={r.prediction === results.majority_vote}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : !loading && (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <div className="text-6xl mb-4 opacity-50">🌱</div>
                <p className="text-sm font-medium text-gray-500">No prediction yet</p>
                <p className="text-xs text-gray-400 mt-1 text-center">
                  Set your soil & climate values on the left<br />
                  then click <span className="font-semibold text-gray-500">Predict All Models</span>
                </p>
              </div>
            )
          )}

          {/* ── Metrics tab ── */}
          {tab === "metrics" && (
            <ComparisonChart metrics={metrics} />
          )}
        </div>
      </div>
    </div>
  )
}