import { useMemo, useState } from 'react'
import { RefreshCw, Plus, Sparkles } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { useData } from '../context/DataContext'
import Filters from './Filters'
import ServiceCard from './ServiceCard'
import Pagination from './Pagination'
import AgendarServicoModal from './AgendarServicoModal'
import ConfirmDialog from './ConfirmDialog'
import { MODULES } from '../data/mockData'

const PAGE_SIZE = 8

function parseDate(str) {
  const [d, m, y] = str.split('/').map(Number)
  return new Date(y, m - 1, d)
}

function startOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - day)
  return d
}

export default function EmbelezamentoPage() {
  const toast = useToast()
  const { services: allServices, addServico, updateServico, deleteServico, refresh, loading } = useData()
  const services = allServices.embelezamento
  const mod = MODULES.embelezamento
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [deletingService, setDeletingService] = useState(null)

  const [search, setSearch] = useState('')
  const [semana, setSemana] = useState('Todas')
  const [horario, setHorario] = useState('Todos')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const today = new Date()
    const thisWeekStart = startOfWeek(today)
    const lastWeekStart = new Date(thisWeekStart)
    lastWeekStart.setDate(lastWeekStart.getDate() - 7)

    return services.filter((s) => {
      const q = search.trim().toLowerCase()
      const matchesSearch =
        !q ||
        s.cliente.toLowerCase().includes(q) ||
        s.telefone.toLowerCase().includes(q) ||
        s.marca.toLowerCase().includes(q) ||
        s.modelo.toLowerCase().includes(q)

      let matchesSemana = true
      if (semana !== 'Todas') {
        const serviceDate = parseDate(s.data)
        if (semana === 'Esta semana') matchesSemana = serviceDate >= thisWeekStart
        else if (semana === 'Semana passada')
          matchesSemana = serviceDate >= lastWeekStart && serviceDate < thisWeekStart
      }

      let matchesHorario = true
      if (horario !== 'Todos') {
        const hour = parseInt(s.hora, 10)
        matchesHorario = horario === 'Manhã (até 12h)' ? hour < 12 : hour >= 12
      }

      let matchesDate = true
      if (dateFrom || dateTo) {
        const serviceDate = parseDate(s.data)
        if (dateFrom && /^\d{2}\/\d{2}\/\d{4}$/.test(dateFrom)) matchesDate = matchesDate && serviceDate >= parseDate(dateFrom)
        if (dateTo && /^\d{2}\/\d{2}\/\d{4}$/.test(dateTo)) matchesDate = matchesDate && serviceDate <= parseDate(dateTo)
      }

      return matchesSearch && matchesSemana && matchesHorario && matchesDate
    })
  }, [services, search, semana, horario, dateFrom, dateTo])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  async function handleSave(entry) {
    if (entry.id) {
      await updateServico('embelezamento', entry.id, entry)
    } else {
      await addServico('embelezamento', entry)
      setPage(1)
    }
    setModalOpen(false)
    setEditingService(null)
  }

  async function handleConfirmDelete() {
    try {
      await deleteServico('embelezamento', deletingService.id)
      toast?.success('Agendamento excluído!')
    } catch {
      toast?.error('Erro ao excluir agendamento. Tente novamente.')
    } finally {
      setDeletingService(null)
    }
  }

  return (
    <div>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{mod.label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{mod.subtitle}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-xs font-medium text-foreground shadow transition-colors hover:bg-secondary disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
          <button
            onClick={() => {
              setEditingService(null)
              setModalOpen(true)
            }}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Agendar Serviço
          </button>
        </div>
      </header>

      <div className="mt-6">
        <Filters
          search={search}
          onSearchChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          semana={semana}
          onSemanaChange={(v) => {
            setSemana(v)
            setPage(1)
          }}
          horario={horario}
          onHorarioChange={(v) => {
            setHorario(v)
            setPage(1)
          }}
          dateFrom={dateFrom}
          onDateFromChange={(v) => {
            setDateFrom(v)
            setPage(1)
          }}
          dateTo={dateTo}
          onDateToChange={(v) => {
            setDateTo(v)
            setPage(1)
          }}
        />
      </div>

      <div className="mt-6 space-y-3">
        {pageItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card py-16 text-center text-sm text-muted-foreground">
            Nenhum serviço encontrado para os filtros selecionados.
          </div>
        ) : (
          pageItems.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              moduleKey={{ icon: Sparkles, key: 'embelezamento' }}
              onEdit={(s) => {
                setEditingService(s)
                setModalOpen(true)
              }}
              onDelete={setDeletingService}
            />
          ))
        )}
      </div>

      <div className="mt-4">
        <Pagination page={page} totalPages={totalPages} totalResults={filtered.length} onPageChange={setPage} />
      </div>

      {modalOpen && (
        <AgendarServicoModal
          service={editingService}
          onClose={() => {
            setModalOpen(false)
            setEditingService(null)
          }}
          onSave={handleSave}
        />
      )}

      {deletingService && (
        <ConfirmDialog
          title="Excluir agendamento?"
          description={
            <>
              Esta ação não pode ser desfeita. O agendamento de{' '}
              <strong className="font-semibold text-foreground">{deletingService.cliente}</strong> em{' '}
              <strong className="font-semibold text-foreground">{deletingService.data}</strong> será removido
              permanentemente.
            </>
          }
          onCancel={() => setDeletingService(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}
