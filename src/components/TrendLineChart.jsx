import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function TrendLineChart({ data }) {
  return (
    <div className="h-[230px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="session" tick={{ fill: '#C8D2E8', fontSize: 12 }} />
          <YAxis tick={{ fill: '#C8D2E8', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: '#0E1424',
              border: '1px solid rgba(117,155,255,.2)',
              borderRadius: '12px',
              color: '#fff',
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#9CC0FF"
            strokeWidth={3}
            dot={{ r: 4, fill: '#9CC0FF' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
