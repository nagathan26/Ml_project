const EMOJI = {
  rice:"🌾", maize:"🌽", chickpea:"🫘", kidneybeans:"🫘", pigeonpeas:"🌿",
  mothbeans:"🌱", mungbean:"🌱", blackgram:"🌱", lentil:"🌿", pomegranate:"🍎",
  banana:"🍌", mango:"🥭", grapes:"🍇", watermelon:"🍉", muskmelon:"🍈",
  apple:"🍎", orange:"🍊", papaya:"🍈", coconut:"🥥", cotton:"🪴",
  jute:"🌿", coffee:"☕",
}

const MODEL_COLORS = {
  "xgboost":             { bg: "from-orange-50 to-white",  accent: "bg-orange-500",  border: "border-orange-200",  text: "text-orange-600"  },
  "random_forest":       { bg: "from-green-50 to-white",   accent: "bg-green-500",   border: "border-green-200",   text: "text-green-600"   },
  "decision_tree":       { bg: "from-blue-50 to-white",    accent: "bg-blue-500",    border: "border-blue-200",    text: "text-blue-600"    },
  "naive_bayes":         { bg: "from-purple-50 to-white",  accent: "bg-purple-500",  border: "border-purple-200",  text: "text-purple-600"  },
  "logistic_regression": { bg: "from-pink-50 to-white",    accent: "bg-pink-500",    border: "border-pink-200",    text: "text-pink-600"    },
  "svm":                 { bg: "from-teal-50 to-white",    accent: "bg-teal-500",    border: "border-teal-200",    text: "text-teal-600"    },
  "k_nearest_neighbors": { bg: "from-indigo-50 to-white",  accent: "bg-indigo-500",  border: "border-indigo-200",  text: "text-indigo-600"  },
  "gradient_boosting":   { bg: "from-yellow-50 to-white",  accent: "bg-yellow-500",  border: "border-yellow-200",  text: "text-yellow-600"  },
  "extra_trees":         { bg: "from-lime-50 to-white",    accent: "bg-lime-500",    border: "border-lime-200",    text: "text-lime-600"    },
  "adaboost":            { bg: "from-red-50 to-white",     accent: "bg-red-500",     border: "border-red-200",     text: "text-red-600"     },
  "mlp_neural_network":  { bg: "from-cyan-50 to-white",    accent: "bg-cyan-500",    border: "border-cyan-200",    text: "text-cyan-600"    },
  "lightgbm":            { bg: "from-emerald-50 to-white", accent: "bg-emerald-500", border: "border-emerald-200", text: "text-emerald-600" },
}

const DEFAULT_COLOR = { bg: "from-gray-50 to-white", accent: "bg-gray-400", border: "border-gray-200", text: "text-gray-600" }

function ConfBar({ value, colorClass }) {
  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  )
}

export default function ModelCard({ r, isWinner }) {
  const theme = MODEL_COLORS[r.slug] ?? DEFAULT_COLOR

  return (
    <div className={`relative flex flex-col rounded-2xl border-2 overflow-hidden
      transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default
      bg-gradient-to-b ${theme.bg}
      ${isWinner ? `${theme.border} shadow-lg` : "border-gray-100 shadow-sm"}`}
    >
      {/* Top accent bar */}
      <div className={`h-1.5 w-full ${theme.accent}`} />

      {/* Winner badge */}
      {isWinner && (
        <div className="absolute top-3 right-3">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
            ${theme.accent} text-white shadow-sm`}>
            🏆 Best
          </span>
        </div>
      )}

      <div className="flex flex-col gap-4 p-5">

        {/* Model name */}
        <p className={`text-[10px] font-black uppercase tracking-widest ${theme.text}`}>
          {r.name}
        </p>

        {/* Predicted crop — centered hero */}
        <div className="flex flex-col items-center gap-2 py-2">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl
            ${theme.accent} bg-opacity-10 shadow-inner`}
            style={{ background: "rgba(0,0,0,0.04)" }}>
            {EMOJI[r.prediction] ?? "🌿"}
          </div>
          <span className="font-bold text-gray-800 capitalize text-lg leading-tight text-center">
            {r.prediction}
          </span>
        </div>

        {/* Confidence */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 font-medium">Confidence</span>
            <span className={`text-sm font-black tabular-nums ${theme.text}`}>
              {r.confidence.toFixed(1)}%
            </span>
          </div>
          <ConfBar value={r.confidence} colorClass={theme.accent} />
        </div>

        {/* Top 3 */}
        <div className="bg-white/70 rounded-xl p-3 flex flex-col gap-2">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-300">
            Top 3 Crops
          </p>
          {r.top3.map((t, i) => (
            <div key={t.crop} className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0
                  ${i === 0 ? theme.accent : "bg-gray-200"}`} />
                <span className={`text-xs capitalize
                  ${i === 0 ? "font-semibold text-gray-700" : "text-gray-400"}`}>
                  {t.crop}
                </span>
              </div>
              <span className={`text-xs tabular-nums font-bold
                ${i === 0 ? theme.text : "text-gray-300"}`}>
                {t.prob.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          {[
            { label: "Accuracy", value: `${r.accuracy}%`  },
            { label: "F1",       value: `${r.f1}%`        },
            { label: "Train",    value: `${r.train_time}s` },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center px-1 py-1.5">
              <span className={`text-xs font-black tabular-nums ${theme.text}`}>
                {s.value}
              </span>
              <span className="text-[9px] text-gray-400 uppercase tracking-wide mt-0.5">
                {s.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}