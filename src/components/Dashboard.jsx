import { useMemo, useState } from 'react'
import { Users, Sparkles, Wrench, DollarSign, TrendingUp, ChevronDown } from 'lucide-react'
import StatusDonutChart from './charts/StatusDonutChart'
import RevenueByMonthChart from './charts/RevenueByMonthChart'
import { MODULES, STATUS_OS } from '../data/mockData'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'

const MESES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const MESES_ABREV = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
]
const DIAS_PT = [
  'Domingo-Feira', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira',
  'Quinta-Feira', 'Sexta-Feira', 'Sábado-Feira',
]

const STATUS_BADGE = {
  'Em andamento': 'border border-transparent bg-secondary text-secondary-foreground',
  Concluída: 'border border-border text-foreground',
  'Pend. Pagamento': 'border border-transparent bg-destructive text-destructive-foreground',
}

function todayLabel() {
  const now = new Date()
  return `${DIAS_PT[now.getDay()]}, ${now.getDate()} De ${MESES_PT[now.getMonth()]} De ${now.getFullYear()}`
}

function currency(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function parseEntrada(str) {
  const [d, m, y] = str.split('/').map(Number)
  return { d, m, y }
}

function Select({ value, onChange, options, className = '' }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-md border border-border bg-secondary py-2.5 pr-9 pl-3.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40 ${className}`}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

function OverviewCard({ icon: Icon, label, value, sublabel, accent }) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-5 shadow ${accent ? 'border-t-4 border-t-accent' : 'border-t-4 border-t-primary'}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className={`grid h-9 w-9 place-items-center rounded-md ${accent ? 'bg-accent/20 text-foreground' : 'bg-secondary text-muted-foreground'}`}>
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
      <div className="mt-3 text-3xl font-bold text-foreground">{value}</div>
      <p className="mt-1 text-xs text-muted-foreground">{sublabel}</p>
    </div>
  )
}

export default function Dashboard() {
  const { services: SERVICES, clientes: CLIENTES, usuarios } = useData()
  const { user } = useAuth()
  const primeiroNome =
    usuarios.find((u) => u.id === user?.id)?.nome?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuário'
  const now = new Date()
  const [mes, setMes] = useState(MESES_PT[now.getMonth()])
  const [ano, setAno] = useState(String(now.getFullYear()))
  const [setor, setSetor] = useState('Todos')
  const [statusFiltro, setStatusFiltro] = useState('Todos')

  const mesIndex = MESES_PT.indexOf(mes)
  const anoNum = parseInt(ano, 10)
  const escopoLabel = setor === 'Todos' ? 'Embelezamento + Lanternagem + Mecânica' : setor
  const escopoLabelE = setor === 'Todos' ? 'Embelezamento, Lanternagem e Mecânica' : setor

  const osFinanceiras = useMemo(
    () => [
      ...SERVICES.lanternagem.map((s) => ({ ...s, modulo: 'lanternagem' })),
      ...SERVICES.mecanica.map((s) => ({ ...s, modulo: 'mecanica' })),
    ],
    [SERVICES],
  )

  const osTodosSetores = useMemo(
    () => [
      ...SERVICES.embelezamento.map((s) => ({ ...s, modulo: 'embelezamento', entrada: s.data })),
      ...osFinanceiras,
    ],
    [osFinanceiras, SERVICES],
  )

  const osFinanceirasSetor = useMemo(
    () => osTodosSetores.filter((s) => setor === 'Todos' || MODULES[s.modulo].label === setor),
    [osTodosSetores, setor],
  )

  const { receitaPeriodo, lucroPeriodo, temOSNoPeriodo } = useMemo(() => {
    const doMes = osFinanceirasSetor.filter((s) => {
      const { m, y } = parseEntrada(s.entrada)
      return m - 1 === mesIndex && y === anoNum
    })
    const receita = doMes.reduce((sum, s) => sum + (s.valor || 0), 0)
    const lucro = doMes.reduce((sum, s) => sum + ((s.valor || 0) - (s.custo || 0)), 0)
    return { receitaPeriodo: receita, lucroPeriodo: lucro, temOSNoPeriodo: doMes.length > 0 }
  }, [osFinanceirasSetor, mesIndex, anoNum])

  const revenueByMonth = useMemo(() => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      let m = mesIndex - i
      let y = anoNum
      while (m < 0) {
        m += 12
        y -= 1
      }
      months.push({ m, y })
    }
    return months.map(({ m, y }) => {
      const emb =
        setor === 'Lanternagem' || setor === 'Mecânica'
          ? 0
          : SERVICES.embelezamento
              .filter((s) => {
                const p = parseEntrada(s.data)
                return p.m - 1 === m && p.y === y
              })
              .reduce((sum, s) => sum + (s.valor || 0), 0)
      const lant =
        setor === 'Mecânica' || setor === 'Embelezamento'
          ? 0
          : SERVICES.lanternagem
              .filter((s) => {
                const p = parseEntrada(s.entrada)
                return p.m - 1 === m && p.y === y
              })
              .reduce((sum, s) => sum + (s.valor || 0), 0)
      const mec =
        setor === 'Lanternagem' || setor === 'Embelezamento'
          ? 0
          : SERVICES.mecanica
              .filter((s) => {
                const p = parseEntrada(s.entrada)
                return p.m - 1 === m && p.y === y
              })
              .reduce((sum, s) => sum + (s.valor || 0), 0)
      return { label: `${MESES_ABREV[m]}/${String(y).slice(2)}`, embelezamento: emb, lanternagem: lant, mecanica: mec }
    })
  }, [mesIndex, anoNum, setor, SERVICES])

  const setorData = useMemo(
    () =>
      [
        {
          name: 'Embelezamento',
          value: setor === 'Lanternagem' || setor === 'Mecânica' ? 0 : SERVICES.embelezamento.length,
          color: 'oklch(0.92 0.195 97)',
        },
        {
          name: 'Lanternagem',
          value: setor === 'Mecânica' || setor === 'Embelezamento' ? 0 : SERVICES.lanternagem.length,
          color: 'oklch(0.72 0.003 0)',
        },
        {
          name: 'Mecânica',
          value: setor === 'Lanternagem' || setor === 'Embelezamento' ? 0 : SERVICES.mecanica.length,
          color: 'oklch(0.22 0.003 0)',
        },
      ].filter((d) => d.value > 0),
    [setor, SERVICES],
  )

  const recentes = useMemo(() => {
    const filteredList = osFinanceiras.filter((item) => {
      const matchesSetor = setor === 'Todos' || MODULES[item.modulo].label === setor
      const matchesStatus = statusFiltro === 'Todos' || item.status === statusFiltro
      return matchesSetor && matchesStatus
    })

    function toDate(str) {
      const { d, m, y } = parseEntrada(str)
      return new Date(y, m - 1, d)
    }

    return filteredList.sort((a, b) => toDate(b.entrada) - toDate(a.entrada)).slice(0, 10)
  }, [osFinanceiras, setor, statusFiltro])

  return (
    <div>
      <header>
        <h1 className="text-2xl font-bold text-foreground">Olá, {primeiroNome} 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">{todayLabel()}</p>
      </header>

      <div className="mt-6 rounded-2xl border border-border bg-card p-4 shadow">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto]">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Mês de referência</label>
            <div className="grid grid-cols-2 gap-2">
              <Select value={mes} onChange={setMes} options={MESES_PT} />
              <Select value={ano} onChange={setAno} options={['2025', '2026']} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Setor (OS recentes)</label>
            <Select
              value={setor}
              onChange={setSetor}
              options={['Todos', 'Embelezamento', 'Lanternagem', 'Mecânica']}
              className="lg:w-44"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Status (OS recentes)</label>
            <Select value={statusFiltro} onChange={setStatusFiltro} options={['Todos', ...STATUS_OS]} className="lg:w-44" />
          </div>
        </div>
      </div>

      <h2 className="mt-8 text-xs font-bold tracking-widest text-muted-foreground uppercase">
        Financeiro — {mes} {ano}
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border border-t-4 border-t-accent bg-card p-5 shadow">
          <div className="flex items-start justify-between">
            <span className="text-sm font-semibold text-foreground">Receita do período</span>
            <span className="grid h-9 w-9 place-items-center rounded-md bg-accent/20 text-foreground">
              <DollarSign className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-bold text-foreground">{currency(receitaPeriodo)}</div>
          <p className="mt-1 text-xs text-muted-foreground">{escopoLabel}</p>
        </div>
        <div className="rounded-2xl border border-border border-t-4 border-t-primary bg-card p-5 shadow">
          <div className="flex items-start justify-between">
            <span className="text-sm font-semibold text-foreground">Lucro do período</span>
            <span className="grid h-9 w-9 place-items-center rounded-md bg-secondary text-muted-foreground">
              <TrendingUp className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-bold text-foreground">{currency(lucroPeriodo)}</div>
          <p className="mt-1 text-xs text-muted-foreground">Após custos e comissões</p>
        </div>
      </div>
      {!temOSNoPeriodo && (
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Sem OS de {escopoLabel} em {mes} {ano}. Tente outro mês.
        </p>
      )}

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow">
        <h3 className="text-sm font-semibold text-foreground">Receita por mês</h3>
        <p className="text-xs text-muted-foreground">
          6 meses até {MESES_ABREV[mesIndex]}/{ano} — {escopoLabelE}
        </p>
        <div className="mt-4">
          <RevenueByMonthChart data={revenueByMonth} setor={setor} />
        </div>
      </div>

      <h2 className="mt-8 text-xs font-bold tracking-widest text-muted-foreground uppercase">Visão geral</h2>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
        <div className="lg:col-start-1 lg:row-start-1">
          <OverviewCard icon={Users} label="Clientes" value={CLIENTES.length} sublabel="Cadastros totais" />
        </div>
        <div className="lg:col-start-2 lg:row-start-1">
          <OverviewCard icon={Sparkles} label="OS Embelezamento" value={SERVICES.embelezamento.length} sublabel="Agendamentos totais" accent />
        </div>
        <div className="lg:col-start-1 lg:row-start-2">
          <OverviewCard icon={Wrench} label="OS Lanternagem" value={SERVICES.lanternagem.length} sublabel="Ordens totais" accent />
        </div>
        <div className="lg:col-start-2 lg:row-start-2">
          <OverviewCard icon={Wrench} label="OS Mecânica" value={SERVICES.mecanica.length} sublabel="Ordens totais" />
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow sm:col-span-2 lg:col-start-3 lg:row-start-1 lg:row-span-2 lg:col-span-1">
          <h3 className="text-sm font-semibold text-foreground">OS por setor</h3>
          <p className="text-xs text-muted-foreground">Distribuição total</p>
          <div className="mt-1">
            <StatusDonutChart data={setorData} />
          </div>
        </div>
      </div>

      <h2 className="mt-8 text-xs font-bold tracking-widest text-muted-foreground uppercase">OS Recentes</h2>
      <div className="mt-3 rounded-2xl border border-border bg-card shadow">
        <div className="divide-y divide-border">
          {recentes.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">Nenhuma OS encontrada para os filtros selecionados.</div>
          ) : (
            recentes.map((item) => (
              <div key={`${item.modulo}-${item.id}`} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-secondary text-muted-foreground">
                    <Wrench className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-foreground">{item.cliente}</span>
                      <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-muted-foreground">
                        {MODULES[item.modulo].tag}
                      </span>
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {item.marca} {item.modelo} · {item.entrada}
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[10px] font-semibold ${STATUS_BADGE[item.status]}`}>
                    {item.status}
                  </span>
                  {typeof item.valor === 'number' && item.valor > 0 && (
                    <span className="text-sm font-bold text-foreground">{currency(item.valor)}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
