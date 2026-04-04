import GlassCard from '../components/GlassCard'
import PageTransition from '../components/PageTransition'
import SectionTitle from '../components/SectionTitle'
import InterviewList from '../components/InterviewList'
import RecordingsList from '../components/RecordingsList'
import RadarInsightsChart from '../components/RadarInsightsChart'
import { upcomingInterviews, recordings, radarData } from '../data/mockData'
import { useApp } from '../context/AppContext'

export default function DashboardPage() {
  const { user } = useApp()

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl">
        <SectionTitle title="Ready for your next session?" />
        <GlassCard className="mt-5 rounded-3xl border border-fuchsia-400/20 px-6 py-5">
          <h3 className="text-3xl font-bold">Welcome back, {user?.name || 'Alex Chen'}.</h3>
          <p className="mt-2 text-slate-300">Here is your interview progress overview.</p>
        </GlassCard>

        <div className="mt-6 grid gap-5 xl:grid-cols-3">
          <GlassCard className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Upcoming Interviews</h3>
            </div>
            <InterviewList items={upcomingInterviews} />
            <button className="mx-auto mt-5 block rounded-xl border border-white/10 bg-white/[0.06] px-5 py-2 text-sm shadow-neon">
              View All
            </button>
          </GlassCard>

          <GlassCard className="p-5">
            <h3 className="text-2xl font-semibold">Performance Insights</h3>
            <RadarInsightsChart data={radarData} />
            <div className="text-center">
              <p className="text-4xl font-bold text-cyan-100">88%</p>
              <p className="mt-3 text-slate-300">
                Strong in technical skills. <br />
                Communication needs improvement.
              </p>
              <button className="mt-5 rounded-xl border border-cyan-300/20 bg-white/[0.06] px-5 py-2 text-sm shadow-neon">
                View Full Report
              </button>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <h3 className="mb-4 text-2xl font-semibold">Past Recordings</h3>
            <RecordingsList items={recordings} />
            <button className="mx-auto mt-5 block rounded-xl border border-white/10 bg-white/[0.06] px-5 py-2 text-sm shadow-neon">
              Watch Recording
            </button>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  )
}
