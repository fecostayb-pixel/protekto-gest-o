import { useMemo, useState } from 'react'
import { RefreshCw, Plus, Search, ChevronDown, User, CarFront, Pencil, Trash2 } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { useData } from '../context/DataContext'
import Pagination from './Pagination'
import NovoClienteModal from './NovoClienteModal'
import ConfirmDialog from './ConfirmDialog'
import { MARCAS } from '../data/mockData'

const PAGE_SIZE = 10

export default function ClientesPage() {
  const toast = useToast()
  const { clientes, addCliente, updateCliente, deleteCliente, refresh, loading } = useData()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState(null)
  const [deletingCliente, setDeletingCliente] = useState(null)
  const [search, setSearch] = useState('')
  const [marca, setMarca] = useState('Todas')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return clientes.filter((c) => {
      const matchesSearch =
        !q ||
        c.nome.toLowerCase().includes(q) ||
        c.telefone?.toLowerCase().includes(q) ||
        c.marca?.toLowerCase().includes(q) ||
        c.modelo?.toLowerCase().includes(q)
      const matchesMarca = marca === 'Todas' || c.marca === marca
      return matchesSearch && matchesMarca
    })
  }, [clientes, search, marca])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  async function handleSave(entry) {
    if (entry.id) {
      const { id, ...rest } = entry
      await updateCliente(id, rest)
      toast?.success('Cliente atualizado!')
    } else {
      await addCliente(entry)
      setPage(1)
      toast?.success('Cliente cadastrado!')
    }
    setModalOpen(false)
    setEditingCliente(null)
  }

  async function handleConfirmDelete() {
    try {
      await deleteCliente(deletingCliente.id)
      toast?.success('Cliente excluído!')
    } catch {
      toast?.error('Erro ao excluir cliente. Tente novamente.')
      return
    }
    setDeletingCliente(null)
  }

  return (
    <div>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="mt-1 text-sm text-muted-foreground">Cadastro de clientes e veículos da oficina.</p>
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
              setEditingCliente(null)
              setModalOpen(true)
            }}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Novo cliente
          </button>
        </div>
      </header>

      <div className="mt-6 rounded-2xl border border-border bg-card p-4 shadow">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto]">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Buscar</label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder="Nome, telefone, marca, modelo..."
                className="w-full rounded-md border border-border bg-secondary py-2.5 pr-4 pl-10 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:bg-card focus:ring-2 focus:ring-accent/40"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Marca</label>
            <div className="relative">
              <select
                value={marca}
                onChange={(e) => {
                  setMarca(e.target.value)
                  setPage(1)
                }}
                className="w-full appearance-none rounded-md border border-border bg-secondary py-2.5 pr-9 pl-3.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40 lg:w-44"
              >
                {MARCAS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {pageItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card py-16 text-center text-sm text-muted-foreground">
            Nenhum cliente encontrado.
          </div>
        ) : (
          pageItems.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow transition-shadow hover:shadow-md"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-secondary">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-foreground">{c.nome}</div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                    <span>{c.telefone}</span>
                    {c.marca && (
                      <span className="flex items-center gap-1">
                        · <CarFront className="h-3.5 w-3.5" /> {c.marca} {c.modelo}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => {
                    setEditingCliente(c)
                    setModalOpen(true)
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                  aria-label="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeletingCliente(c)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4">
        <Pagination page={page} totalPages={totalPages} totalResults={filtered.length} onPageChange={setPage} />
      </div>

      {modalOpen && (
        <NovoClienteModal
          cliente={editingCliente}
          onClose={() => {
            setModalOpen(false)
            setEditingCliente(null)
          }}
          onSave={handleSave}
        />
      )}

      {deletingCliente && (
        <ConfirmDialog
          title="Excluir cliente?"
          description={
            <>
              Tem certeza que deseja excluir <strong className="font-semibold text-foreground">{deletingCliente.nome}</strong>?
              Esta ação não pode ser desfeita.
            </>
          }
          onCancel={() => setDeletingCliente(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}
