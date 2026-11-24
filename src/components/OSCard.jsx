import { Calendar, CarFront, Printer, Pencil, Trash2 } from 'lucide-react'
import { MODULES } from '../data/mockData'
import { printOS } from '../utils/printOS'

const STATUS_STYLES = {
  Concluída: 'border border-border text-foreground',
  'Em andamento': 'border border-transparent bg-secondary text-secondary-foreground',
  'Pend. Pagamento': 'border border-transparent bg-destructive text-destructive-foreground',
}

function currency(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function OSCard({ service, moduleKey, onEdit, onDelete }) {
  const Icon = moduleKey.icon
  const mod = MODULES[moduleKey.key]
  const hasValue = typeof service.valor === 'number'

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow transition-shadow hover:shadow-md sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-secondary">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-foreground">{service.cliente}</span>
            <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-muted-foreground">
              {mod.tag}
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-medium text-muted-foreground">
              <CarFront className="h-3.5 w-3.5" />
              {service.marca} {service.modelo}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {service.entrada}
              {service.saida && (
                <>
                  {' '}
                  → {service.saida} ({service.dias}d)
                </>
              )}
            </span>
            {service.responsavel && <span>· {service.responsavel}</span>}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end sm:gap-6">
        <div className="text-right">
          <span
            className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[service.status]}`}
          >
            {service.status}
          </span>
          {hasValue && (
            <div className="mt-1.5">
              <div className="text-sm font-bold text-foreground">{currency(service.valor)}</div>
              {typeof service.custo === 'number' && (
                <div className="text-xs font-semibold text-green-600">{currency(service.custo)}</div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 border-l border-border pl-4">
          <button
            onClick={() => printOS(moduleKey.key, service)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Imprimir"
          >
            <Printer className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(service)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Editar"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(service)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
