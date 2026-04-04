import PageTransition from '../components/PageTransition'
import GlassCard from '../components/GlassCard'
import StatRing from '../components/StatRing'
import TrendLineChart from '../components/TrendLineChart'
import { performanceTrend } from '../data/mockData'

export default function PerformancePage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-semibold">Performance & AI Feedback Dashboard</h1>

        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <GlassCard className="p-5">
            <div className="grid gap-4 md:grid-cols-3">
              <StatRing value={85} label="Technical Accuracy" />
              <StatRing value={92} label="Communication" />
              <StatRing value={78} label="Confidence" />
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <h2 className="mb-3 text-2xl font-semibold">Performance Trends</h2>
            <TrendLineChart data={performanceTrend} />
          </GlassCard>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <GlassCard className="p-5" hover={false}>
            <h3 className="text-2xl font-semibold">✅ Strengths</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
              <li>Clear articulation of concepts</li>
              <li>Demonstrated understanding of core principles</li>
              <li>Engaging and professional tone</li>
            </ul>
          </GlassCard>

          <GlassCard className="p-5" hover={false}>
            <h3 className="text-2xl font-semibold">⚠️ Weaknesses</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
              <li>Lack of concrete examples</li>
              <li>Hesitation during technical questions</li>
              <li>Need for faster response times</li>
            </ul>
          </GlassCard>

          <GlassCard className="p-5" hover={false}>
            <h3 className="text-2xl font-semibold">💡 Suggested Better Answers</h3>
            <div className="mt-4 text-slate-300">
              <p className="font-medium text-white">Q: “Describe a complex problem you solved.”</p>
              <p className="mt-2 leading-7">
                A: “Focus on the STAR method, clearly outlining the Situation, Task,
                Action, and Result. Be specific about your role and the positive outcome.”
              </p>
            </div>
          </GlassCard>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="rounded-xl bg-white px-5 py-3 font-medium text-slate-900">
            Start New Interview
          </button>
          <button className="rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 font-medium">
            Review Full Report
          </button>
        </div>
      </div>
    </PageTransition>
  )
}
