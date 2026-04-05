export default function CodeEditorPanel({ code, setCode }) {
  return (
    <div className="h-full rounded-2xl border border-white/10 bg-[#07111F] p-4">
      <div className="mb-3 flex justify-end">
        <select className="rounded-xl border border-white/10 bg-[#0D1A2C] px-3 py-2 text-sm outline-none">
          <option>Python 3.9</option>
          <option>JavaScript</option>
          <option>Java</option>
        </select>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="h-[500px] w-full resize-none rounded-xl bg-transparent p-3 font-mono text-sm leading-7 text-slate-200 outline-none"
        spellCheck={false}
      />
    </div>
  )
}
