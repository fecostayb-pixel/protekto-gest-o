import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 text-sm shadow-md">
      <div className="font-semibold text-foreground">{name}</div>
      <div className="text-muted-foreground">{value} serviços</div>
    </div>
  )
}

export default function StatusDonutChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={3}
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-x-0 top-[92px] flex flex-col items-center">
        <span className="text-2xl font-bold text-foreground">{total}</span>
        <span className="text-xs text-muted-foreground">total</span>
      </div>
    </div>
  )
}
