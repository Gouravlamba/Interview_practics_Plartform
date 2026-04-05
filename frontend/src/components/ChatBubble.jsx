export default function ChatBubble({ sender, text, time }) {
  const isUser = sender === 'user'

  return (
    <div className={`mb-4 flex ${isUser ? 'justify-start' : 'justify-start'}`}>
      <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-200">
            {isUser ? 'User' : 'AI Interviewer'}
          </span>
          <span className="text-xs text-slate-400">{time}</span>
        </div>
        <p className="text-sm leading-6 text-slate-200">{text}</p>
      </div>
    </div>
  )
}
