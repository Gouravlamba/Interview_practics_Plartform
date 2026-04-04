import { useNavigate } from 'react-router-dom'
import { Code2, Briefcase, Rocket } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import PageTransition from '../components/PageTransition'
import DropzoneUpload from '../components/DropzoneUpload'
import RoleCard from '../components/RoleCard'
import GlowButton from '../components/GlowButton'
import { useApp } from '../context/AppContext'

const roles = [
  {
    title: 'Senior Tech Lead',
    description: 'Focuses on technical depth, algorithms, and system design.',
    icon: <Code2 className="h-6 w-6 text-cyan-300" />,
  },
  {
    title: 'HR Manager',
    description: 'Evaluates cultural fit, behavioral questions, and soft skills.',
    icon: <Briefcase className="h-6 w-6 text-cyan-300" />,
  },
  {
    title: 'Startup Founder',
    description: 'Tests adaptability, product sense, and rapid problem-solving.',
    icon: <Rocket className="h-6 w-6 text-cyan-300" />,
  },
]

export default function InterviewSetupPage() {
  const { interviewSetup, setInterviewSetup } = useApp()
  const navigate = useNavigate()

  const handleGenerate = () => {
    navigate('/interview')
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl">
        <GlassCard className="p-6">
          <h1 className="text-center text-3xl font-semibold">Interview Setup & Context</h1>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <h2 className="mb-4 text-xl font-medium">Resume Upload (PDF/Text)</h2>
              <DropzoneUpload
                fileName={interviewSetup.resumeName}
                onFileSelect={(name) => setInterviewSetup((p) => ({ ...p, resumeName: name }))}
              />
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <h2 className="mb-4 text-xl font-medium">Paste Job Description</h2>
              <textarea
                value={interviewSetup.jobDescription}
                onChange={(e) =>
                  setInterviewSetup((p) => ({ ...p, jobDescription: e.target.value }))
                }
                placeholder="Paste the full job description here to tailor the interview context..."
                className="h-[240px] w-full rounded-2xl border border-white/10 bg-white px-4 py-4 text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-5 text-center text-2xl font-medium">Interviewer Persona Selection</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {roles.map((role) => (
                <RoleCard
                  key={role.title}
                  {...role}
                  active={interviewSetup.persona === role.title}
                  onClick={() => setInterviewSetup((p) => ({ ...p, persona: role.title }))}
                />
              ))}
            </div>
          </div>

          <div className="mt-7 text-center">
            <GlowButton className="min-w-[320px] text-lg" onClick={handleGenerate}>
              Generate Questions & Start
            </GlowButton>
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  )
}
