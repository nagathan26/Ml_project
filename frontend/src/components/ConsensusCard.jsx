const EMOJI = {
  rice:"🌾", maize:"🌽", chickpea:"🫘", kidneybeans:"🫘", pigeonpeas:"🌿",
  mothbeans:"🌱", mungbean:"🌱", blackgram:"🌱", lentil:"🌿", pomegranate:"🍎",
  banana:"🍌", mango:"🥭", grapes:"🍇", watermelon:"🍉", muskmelon:"🍈",
  apple:"🍎", orange:"🍊", papaya:"🍈", coconut:"🥥", cotton:"🪴",
  jute:"🌿", coffee:"☕",
}

export default function ConsensusCard({ majority_vote, vote_count, total_models }) {
  const pct = Math.round((vote_count / total_models) * 100)

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r
                    from-green-700 via-green-600 to-emerald-500
                    shadow-xl shadow-green-200 p-6">

      {/* Background decorative circles */}
      <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
      <div className="absolute -right-4 -bottom-10 w-32 h-32 rounded-full bg-white/5" />

      <div className="relative flex items-center gap-6">

        {/* Emoji in frosted circle */}
        <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm
                        flex items-center justify-center text-5xl flex-shrink-0 shadow-inner">
          {EMOJI[majority_vote] ?? "🌿"}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-green-200 text-[10px] font-black uppercase tracking-widest mb-1">
            Consensus Recommendation
          </p>
          <p className="text-4xl font-black text-white capitalize leading-none mb-2">
            {majority_vote}
          </p>
          <div className="flex items-center gap-3">
            <p className="text-green-100 text-sm">
              <span className="font-black text-white text-base">{vote_count}</span>
              <span className="mx-1 opacity-60">of</span>
              <span className="font-black text-white text-base">{total_models}</span>
              <span className="ml-1 opacity-60">models agree</span>
            </p>
            <span className="bg-white/20 text-white text-xs font-black
                             px-2.5 py-1 rounded-full backdrop-blur-sm">
              {pct}%
            </span>
          </div>
        </div>

        {/* Big pct on right */}
        <div className="hidden md:flex flex-col items-center justify-center
                        w-20 h-20 rounded-2xl bg-white/10 flex-shrink-0">
          <span className="text-3xl font-black text-white leading-none">{pct}</span>
          <span className="text-green-200 text-xs font-bold">%</span>
        </div>

      </div>
    </div>
  )
}