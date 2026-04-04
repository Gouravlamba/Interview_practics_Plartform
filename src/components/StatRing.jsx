export default function StatRing({ value, label }) {
  const angle = Math.round((value / 100) * 360)

  return (
    <div className="glass-soft rounded-3xl p-5 text-center">
      <div
        className="mx-auto grid h-28 w-28 place-items-center rounded-full"
        style={{
          background: `conic-gradient(#7EB4FF ${angle}deg, rgba(255,255,255,0.1) ${angle}deg)`,
        }}
      >
        <div className="grid h-20 w-20 place-items-center rounded-full bg-[#111826] text-2xl font-semibold">
          {value}%
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-200">{label}</p>
    </div>
  )
}
