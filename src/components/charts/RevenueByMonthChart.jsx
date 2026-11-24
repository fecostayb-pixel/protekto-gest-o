import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function currency(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function CustomTooltip({ active, payload, label, showEmbelezamento, showLanternagem, showMecanica }) {
  if (!active || !payload?.length) return null
  const emb = payload.find((p) => p.dataKey === 'embelezamento')
  const lant = payload.find((p) => p.dataKey === 'lanternagem')
  const mec = payload.find((p) => p.dataKey === 'mecanica')
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 text-sm shadow-md">
      <div className="mb-1 font-semibold text-foreground">{label}</div>
      {showEmbelezamento && (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: 'oklch(0.92 0.195 97)' }} />
          Embelezamento: {currency(emb?.value || 0)}
        </div>
      )}
      {showLanternagem && (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: 'oklch(0.72 0.003 0)' }} />
          Lanternagem: {currency(lant?.value || 0)}
        </div>
      )}
      {showMecanica && (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-primary" />
          Mecânica: {currency(mec?.value || 0)}
        </div>
      )}
    </div>
  )
}

export default function RevenueByMonthChart({ data, setor = 'Todos' }) {
  const showEmbelezamento = setor !== 'Lanternagem' && setor !== 'Mecânica'
  const showLanternagem = setor !== 'Mecânica' && setor !== 'Embelezamento'
  const showMecanica = setor !== 'Lanternagem' && setor !== 'Embelezamento'

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.929 0.003 0)" />
        <XAxis
          dataKey="label"
          tick={{ fill: 'oklch(0.554 0.003 0)', fontSize: 12 }}
          axisLine={{ stroke: 'oklch(0.929 0.003 0)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'oklch(0.554 0.003 0)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          domain={[0, (max) => (max > 0 ? max : 1000)]}
          tickFormatter={(v) => `R$${v / 1000}k`}
        />
        <Tooltip
          content={
            <CustomTooltip showEmbelezamento={showEmbelezamento} showLanternagem={showLanternagem} showMecanica={showMecanica} />
          }
          cursor={{ fill: 'oklch(0.968 0.003 0)' }}
        />
        {showEmbelezamento && (
          <Bar dataKey="embelezamento" fill="oklch(0.92 0.195 97)" radius={[4, 4, 0, 0]} maxBarSize={22} />
        )}
        {showLanternagem && (
          <Bar dataKey="lanternagem" fill="oklch(0.72 0.003 0)" radius={[4, 4, 0, 0]} maxBarSize={22} />
        )}
        {showMecanica && <Bar dataKey="mecanica" fill="oklch(0.22 0.003 0)" radius={[4, 4, 0, 0]} maxBarSize={22} />}
      </BarChart>
    </ResponsiveContainer>
  )
}
