import { useMemo, useState } from 'react'
import { RefreshCw, Plus, Hammer, Wrench } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { useData } from '../context/DataContext'
import OSFilters from './OSFilters'
import OSCard from './OSCard'
import Pagination from './Pagination'
import OSModal from './OSModal'
import ConfirmDialog from './ConfirmDialog'
import { MODULES } from '../data/mockData'

const PAGE_SIZE = 8
const MODULE_ICONS = { lanternagem: Hammer, mecanica: Wrench }

const MESES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function mesKeyFromDate(dateStr) {
  const [, m, y] = dateStr.split('/')
  return `${m}/${y}`
}

function mesLabel(key) {
  const [m, y] = key.split('/')
  return `${MESES_PT[parseInt(m, 10) - 1]}/${y}`
}

export default function OSPage({ moduleKey }) {
  const toast = useToast()
  const { services: allServices, addServico, updateServico, deleteServico, refresh, loading } = useData()
  const services = allServices[moduleKey]
  const mod = MODULES[moduleKey]
  const icon = MODULE_ICONS[moduleKey]
  const showResponsavel = moduleKey === 'lanternagem'

  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [deletingService, setDeletingService] = useState(null)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('Todos')
  const [responsavel, setResponsavel] = useState('Todos')
  const [mes, setMes] = useState('Todos')
  const [page, setPage] = useState(1)

  const mesOptions = useMemo(() => {
    const keys = Array.from(new Set(services.map((s) => mesKeyFromDate(s.entrada))))
    keys.sort((a, b) => b.localeCompare(a))
    return ['Todos', ...keys.map(mesLabel)]
  }, [services])

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const q = search.trim().toLowerCase()
      const matchesSearch =
        !q ||
        s.cliente.toLowerCase().includes(q) ||
        s.marca.toLowerCase().includes(q) ||
        s.modelo.toLowerCase().includes(q)

      const matchesStatus = status === 'Todos' || s.status === status
      const matchesResponsavel = !showResponsavel || responsavel === 'Todos' || s.responsavel === responsavel
      const matchesMes = mes === 'Todos' || mesLabel(mesKeyFromDate(s.entrada)) === mes

      return matchesSearch && matchesStatus && matchesResponsavel && matchesMes
    })
  }, [services, search, status, responsavel, mes, showResponsavel])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  async function handleSave(entry) {
    if (entry.id) {
      await updateServico(moduleKey, entry.id, entry)
    } else {
      await addServico(moduleKey, entry)
      setPage(1)
    }
    setModalOpen(false)
    setEditingService(null)
  }

  async function handleConfirmDelete() {
    try {
      await deleteServico(moduleKey, deletingService.id)
      toast?.success('OS excluída!')
    } catch {
      toast?.error('Erro ao excluir OS. Tente novamente.')
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
            Abrir OS
          </button>
        </div>
      </header>

      <div className="mt-6">
        <OSFilters
          search={search}
          onSearchChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          status={status}
          onStatusChange={(v) => {
            setStatus(v)
            setPage(1)
          }}
          responsavel={responsavel}
          onResponsavelChange={(v) => {
            setResponsavel(v)
            setPage(1)
          }}
          showResponsavel={showResponsavel}
          mes={mes}
          onMesChange={(v) => {
            setMes(v)
            setPage(1)
          }}
          mesOptions={mesOptions}
        />
      </div>

      <div className="mt-6 space-y-3">
        {pageItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card py-16 text-center text-sm text-muted-foreground">
            Nenhuma OS encontrada para os filtros selecionados.
          </div>
        ) : (
          pageItems.map((service) => (
            <OSCard
              key={service.id}
              service={service}
              moduleKey={{ icon, key: moduleKey }}
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
        <OSModal
          moduleKey={moduleKey}
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
          title="Excluir OS?"
          description={
            <>
              Esta ação não pode ser desfeita. A OS de{' '}
              <strong className="font-semibold text-foreground">{deletingService.cliente}</strong> (
              {deletingService.marca} {deletingService.modelo}) será removida permanentemente.
            </>
          }
          onCancel={() => setDeletingService(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}
