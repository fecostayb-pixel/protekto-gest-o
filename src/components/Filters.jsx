import { Search, ChevronDown } from 'lucide-react'
import { brToIso, isoToBr } from '../utils/date'

const SEMANA_OPTIONS = ['Todas', 'Esta semana', 'Semana passada']
const HORARIO_OPTIONS = ['Todos', 'Manhã (até 12h)', 'Tarde (após 12h)']

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}

export default function Filters({
  search,
  onSearchChange,
  semana,
  onSemanaChange,
  horario,
  onHorarioChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto]">
        <Field label="Buscar">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cliente, contato, marca, modelo..."
              className="w-full rounded-md border border-border bg-secondary py-2.5 pr-4 pl-10 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:bg-card focus:ring-2 focus:ring-accent/40"
            />
          </div>
        </Field>

        <Field label="Semana">
          <div className="relative">
            <select
              value={semana}
              onChange={(e) => onSemanaChange(e.target.value)}
              className="w-full appearance-none rounded-md border border-border bg-secondary py-2.5 pr-9 pl-3.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40 lg:w-36"
            >
              {SEMANA_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </Field>

        <Field label="Horário">
          <div className="relative">
            <select
              value={horario}
              onChange={(e) => onHorarioChange(e.target.value)}
              className="w-full appearance-none rounded-md border border-border bg-secondary py-2.5 pr-9 pl-3.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40 lg:w-40"
            >
              {HORARIO_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </Field>

        <Field label="Data de">
          <input
            type="date"
            value={brToIso(dateFrom)}
            onChange={(e) => onDateFromChange(isoToBr(e.target.value))}
            className="w-full rounded-md border border-border bg-secondary py-2.5 px-3.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40 lg:w-36"
          />
        </Field>

        <Field label="Data até">
          <input
            type="date"
            value={brToIso(dateTo)}
            onChange={(e) => onDateToChange(isoToBr(e.target.value))}
            className="w-full rounded-md border border-border bg-secondary py-2.5 px-3.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40 lg:w-36"
          />
        </Field>
      </div>
    </div>
  )
}
