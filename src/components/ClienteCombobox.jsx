import { useMemo, useState } from 'react'
import { User, ChevronsUpDown, Plus } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { useData } from '../context/DataContext'
import NovoClienteModal from './NovoClienteModal'

export default function ClienteCombobox({ nome, telefone, onSelect }) {
  const toast = useToast()
  const { clientes: CLIENTES, addCliente } = useData()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)

  const isCadastrado = useMemo(
    () => nome && CLIENTES.some((c) => c.nome.toLowerCase() === nome.toLowerCase() && c.telefone === telefone),
    [nome, telefone, CLIENTES],
  )

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return CLIENTES.filter((c) => c.nome.toLowerCase().includes(q) || c.telefone?.includes(q)).slice(0, 8)
  }, [query, CLIENTES])

  function handlePick(client) {
    onSelect({ nome: client.nome, telefone: client.telefone })
    setOpen(false)
    setQuery('')
  }

  function handleCreateNew() {
    setOpen(false)
    setCreating(true)
  }

  async function handleClienteCadastrado(entry) {
    const novoCliente = await addCliente(entry)
    onSelect({ nome: novoCliente.nome, telefone: novoCliente.telefone })
    setCreating(false)
    setQuery('')
    toast?.success('Cliente cadastrado e selecionado!')
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-border bg-secondary px-3.5 py-2.5 text-left text-sm outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
      >
        {nome ? (
          <span className="flex min-w-0 items-center gap-2.5">
            <User className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0">
              <span className="block truncate font-medium text-foreground">{nome}</span>
              {telefone && <span className="block text-xs text-muted-foreground">{telefone}</span>}
            </span>
          </span>
        ) : (
          <span className="flex items-center gap-2.5 text-muted-foreground">
            <User className="h-4 w-4" />
            Buscar ou cadastrar cliente...
          </span>
        )}
        <span className="flex shrink-0 items-center gap-2">
          {nome && (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                isCadastrado ? 'bg-green-100 text-green-700' : 'bg-accent text-accent-foreground'
              }`}
            >
              {isCadastrado ? 'Cadastrado' : 'Novo'}
            </span>
          )}
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 w-full rounded-md border border-border bg-card shadow-lg">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome ou telefone..."
              className="w-full border-b border-border px-3.5 py-2.5 text-sm text-foreground outline-none"
            />
            <div className="max-h-56 overflow-y-auto p-1">
              {query.trim() === '' ? (
                <p className="px-3 py-4 text-center text-sm text-muted-foreground">Digite para buscar...</p>
              ) : results.length === 0 ? (
                <p className="px-3 py-4 text-center text-sm text-muted-foreground">Nenhum cliente encontrado.</p>
              ) : (
                results.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handlePick(c)}
                    className="flex w-full flex-col items-start rounded-md px-3 py-2 text-left text-sm hover:bg-secondary"
                  >
                    <span className="font-medium text-foreground">{c.nome}</span>
                    <span className="text-xs text-muted-foreground">{c.telefone}</span>
                  </button>
                ))
              )}
            </div>
            <button
              type="button"
              onClick={handleCreateNew}
              className="flex w-full items-center gap-2 border-t border-border px-3.5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
            >
              <Plus className="h-4 w-4" />
              {query.trim() ? <>Cadastrar &quot;{query.trim()}&quot; como novo</> : 'Cadastrar como novo'}
            </button>
          </div>
        </>
      )}

      {creating && (
        <NovoClienteModal
          cliente={{ nome: query.trim() }}
          title="Cadastrar novo cliente"
          submitLabel="Salvar cliente"
          hideObservacoes
          requirePhone
          onClose={() => setCreating(false)}
          onSave={handleClienteCadastrado}
        />
      )}
    </div>
  )
}
