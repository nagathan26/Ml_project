import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList
} from "recharts"

const COLORS = ["#16a34a","#0ea5e9","#8b5cf6","#f59e0b","#ef4444",
                 "#0d9488","#d97706","#6366f1","#ec4899","#14b8a6","#f97316","#64748b"]

const SHORT = n => n
  .replace("Logistic Regression","LR").replace("K-Nearest Neighbors","KNN")
  .replace("Gradient Boosting","GBoost").replace("Extra Trees","ExtraT")
  .replace("Random Forest","RF").replace("Decision Tree","DTree")
  .replace("Naive Bayes","NB").replace("MLP Neural Network","MLP")
  .replace("AdaBoost","ADA").replace("LightGBM","LGBM")

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xl px-4 py-3 text-sm">
      <p className="font-bold text-gray-800 mb-2 border-b border-gray-100 pb-1">{d.name}</p>
      <div className="flex flex-col gap-1">
        <p className="text-gray-600">Accuracy  <span className="font-bold text-green-600 ml-1">{d.accuracy}%</span></p>
        <p className="text-gray-600">Precision <span className="font-bold text-gray-800 ml-1">{d.precision}%</span></p>
        <p className="text-gray-600">Recall    <span className="font-bold text-gray-800 ml-1">{d.recall}%</span></p>
        <p className="text-gray-600">F1 Score  <span className="font-bold text-gray-800 ml-1">{d.f1}%</span></p>
        <p className="text-gray-600">Train     <span className="font-bold text-gray-800 ml-1">{d.train_time}s</span></p>
      </div>
    </div>
  )
}

export default function ComparisonChart({ metrics }) {
  if (!metrics) return (
    <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
      Loading metrics...
    </div>
  )

  const data = Object.entries(metrics)
    .map(([name, m]) => ({ name, shortName: SHORT(name), ...m }))
    .sort((a, b) => b.accuracy - a.accuracy)

  return (
    <div className="flex flex-col gap-6">
      {/* Bar chart */}
      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
        <p className="text-sm font-semibold text-gray-600 mb-4">Accuracy by Model</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 24, right: 8, bottom: 4, left: -15 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="shortName" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 105]} tick={{ fontSize: 11, fill: "#6b7280" }} unit="%" axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
            <Bar dataKey="accuracy" radius={[8, 8, 0, 0]}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              <LabelList
                dataKey="accuracy" position="top"
                formatter={v => `${v}%`}
                style={{ fontSize: 10, fill: "#374151", fontWeight: 700 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-400
                           border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold">Model</th>
              <th className="px-4 py-3 text-right font-semibold">Accuracy</th>
              <th className="px-4 py-3 text-right font-semibold">Precision</th>
              <th className="px-4 py-3 text-right font-semibold">Recall</th>
              <th className="px-4 py-3 text-right font-semibold">F1</th>
              <th className="px-4 py-3 text-right font-semibold">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((d, i) => (
              <tr key={d.name}
                className={`transition-colors ${i === 0
                  ? "bg-green-50"
                  : "bg-white hover:bg-gray-50"
                }`}>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {i === 0 && <span className="mr-1.5">🏆</span>}
                  {d.name}
                </td>
                <td className={`px-4 py-3 text-right font-bold tabular-nums
                  ${i === 0 ? "text-green-600" : "text-gray-700"}`}>
                  {d.accuracy}%
                </td>
                <td className="px-4 py-3 text-right text-gray-500 tabular-nums">{d.precision}%</td>
                <td className="px-4 py-3 text-right text-gray-500 tabular-nums">{d.recall}%</td>
                <td className="px-4 py-3 text-right text-gray-500 tabular-nums">{d.f1}%</td>
                <td className="px-4 py-3 text-right text-gray-400 tabular-nums">{d.train_time}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}