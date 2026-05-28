import { useState } from "react"

const FIELDS = [
  { key: "N",           label: "Nitrogen",     unit: "mg/kg", min: 0,  max: 140, step: 1,    def: 50  },
  { key: "P",           label: "Phosphorus",   unit: "mg/kg", min: 5,  max: 145, step: 1,    def: 53  },
  { key: "K",           label: "Potassium",    unit: "mg/kg", min: 5,  max: 205, step: 1,    def: 48  },
  { key: "temperature", label: "Temperature",  unit: "°C",    min: 0,  max: 50,  step: 0.1,  def: 25  },
  { key: "humidity",    label: "Humidity",     unit: "%",     min: 0,  max: 100, step: 0.1,  def: 71  },
  { key: "ph",          label: "Soil pH",      unit: "pH",    min: 0,  max: 14,  step: 0.01, def: 6.5 },
  { key: "rainfall",    label: "Rainfall",     unit: "mm",    min: 0,  max: 300, step: 0.1,  def: 103 },
]

const init = () => Object.fromEntries(FIELDS.map(f => [f.key, f.def]))

export default function InputForm({ onSubmit, loading }) {
  const [vals, setVals] = useState(init)
  const set = (k, v) => setVals(p => ({ ...p, [k]: parseFloat(v) }))

  return (
    <form
      onSubmit={e => { e.preventDefault(); onSubmit(vals) }}
      className="flex flex-col gap-5"
    >
      {FIELDS.map(f => (
        <div key={f.key} className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-700">{f.label}</label>
            <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
              {f.unit}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range" min={f.min} max={f.max} step={f.step} value={vals[f.key]}
              onChange={e => set(f.key, e.target.value)}
              className="flex-1 h-1.5 accent-green-600 cursor-pointer"
            />
            <input
              type="number" min={f.min} max={f.max} step={f.step} value={vals[f.key]}
              onChange={e => set(f.key, e.target.value)}
              className="w-20 text-right text-sm px-2 py-1.5 border border-gray-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
                         tabular-nums"
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-300 px-0.5">
            <span>{f.min}</span>
            <span>{f.max}</span>
          </div>
        </div>
      ))}

      <div className="flex gap-3 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setVals(init())}
          className="px-4 py-2.5 text-sm font-medium text-gray-500 bg-gray-100
                     rounded-xl hover:bg-gray-200 transition-colors"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 text-sm font-semibold text-white bg-green-600
                     rounded-xl hover:bg-green-700 active:scale-95 disabled:opacity-50
                     disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Predicting...
            </span>
          ) : "🌱 Predict All Models"}
        </button>
      </div>
    </form>
  )
}