import { Search, ChevronDown } from 'lucide-react'
import { RESPONSAVEIS, STATUS_OS } from '../data/mockData'

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  )
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

export default function OSFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  responsavel,
  onResponsavelChange,
  showResponsavel,
  mes,
  onMesChange,
  mesOptions,
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow">
      <div
        className={`grid grid-cols-1 gap-3 ${showResponsavel ? 'lg:grid-cols-[1fr_auto_auto_auto]' : 'lg:grid-cols-[1fr_auto_auto]'}`}
      >
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

        <Field label="Status">
          <Select
            value={status}
            onChange={onStatusChange}
            options={['Todos', ...STATUS_OS]}
            className="lg:w-40"
          />
        </Field>

        {showResponsavel && (
          <Field label="Responsável">
            <Select
              value={responsavel}
              onChange={onResponsavelChange}
              options={['Todos', ...RESPONSAVEIS]}
              className="lg:w-44"
            />
          </Field>
        )}

        <Field label="Mês">
          <Select value={mes} onChange={onMesChange} options={mesOptions} className="lg:w-36" />
        </Field>
      </div>
    </div>
  )
}
