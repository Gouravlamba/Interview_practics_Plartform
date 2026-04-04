import { useEffect, useState } from 'react'
import PageTransition from '../components/PageTransition'
import GlassCard from '../components/GlassCard'
import StatRing from '../components/StatRing'
import TrendLineChart from '../components/TrendLineChart'
import { performanceTrend } from '../data/mockData'
import { analyticsApi } from '../services/api'

export default function PerformancePage() {
  const [stats, setStats] = useState({ technicalAccuracy: 85, communication: 92, confidence: 78 })
  const [trend, setTrend] = useState(performanceTrend)
  const [insights, setInsights] = useState({
    strengths: [
      'Clear articulation of concepts',
      'Demonstrated understanding of core principles',
      'Engaging and professional tone',
    ],
    weaknesses: [
      'Lack of concrete examples',
      'Hesitation during technical questions',
      'Need for faster response times',
    ],
    suggestions: [
      {
        question: 'Describe a complex problem you solved.',
        answer:
          'Focus on the STAR method, clearly outlining the Situation, Task, Action, and Result. Be specific about your role and the positive outcome.',
      },
    ],
  })

  useEffect(() => {
    analyticsApi.getTrend().then(({ data }) => {
      if (data.data?.trend?.length > 0) setTrend(data.data.trend)
      if (data.data?.stats) setStats(data.data.stats)
    }).catch(() => {})

    analyticsApi.getInsights().then(({ data }) => {
      setInsights(data.data)
    }).catch(() => {})
  }, [])

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-semibold">Performance & AI Feedback Dashboard</h1>

        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <GlassCard className="p-5">
            <div className="grid gap-4 md:grid-cols-3">
              <StatRing value={stats.technicalAccuracy} label="Technical Accuracy" />
              <StatRing value={stats.communication} label="Communication" />
              <StatRing value={stats.confidence} label="Confidence" />
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <h2 className="mb-3 text-2xl font-semibold">Performance Trends</h2>
            <TrendLineChart data={trend} />
          </GlassCard>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <GlassCard className="p-5" hover={false}>
            <h3 className="text-2xl font-semibold">Strengths</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
              {insights.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="p-5" hover={false}>
            <h3 className="text-2xl font-semibold">Weaknesses</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
              {insights.weaknesses.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="p-5" hover={false}>
            <h3 className="text-2xl font-semibold">Suggested Better Answers</h3>
            <div className="mt-4 text-slate-300">
              {insights.suggestions?.slice(0, 1).map((s, i) => (
                <div key={i}>
                  {s.question && (
                    <p className="font-medium text-white">Q: &quot;{s.question}&quot;</p>
                  )}
                  <p className="mt-2 leading-7">A: &quot;{s.answer}&quot;</p>
                </div>
              ))}
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
