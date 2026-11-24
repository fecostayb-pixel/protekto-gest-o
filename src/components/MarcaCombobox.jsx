import { useMemo, useState } from 'react'
import { ChevronsUpDown } from 'lucide-react'
import { MARCAS_VEICULOS } from '../data/mockData'

export default function MarcaCombobox({ value, onChange, placeholder = 'Marca' }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return MARCAS_VEICULOS
    return MARCAS_VEICULOS.filter((m) => m.toLowerCase().includes(q))
  }, [query])

  function handlePick(marca) {
    onChange(marca)
    setOpen(false)
    setQuery('')
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-border bg-secondary px-3.5 py-2.5 text-left text-sm outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
      >
        <span className={value ? 'truncate text-foreground' : 'text-muted-foreground'}>{value || placeholder}</span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 w-full rounded-md border border-border bg-card shadow-lg">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar marca..."
              className="w-full border-b border-border px-3.5 py-2.5 text-sm text-foreground outline-none"
            />
            <div className="max-h-56 overflow-y-auto p-1">
              {results.length === 0 ? (
                <p className="px-3 py-4 text-center text-sm text-muted-foreground">Nenhuma marca encontrada.</p>
              ) : (
                results.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handlePick(m)}
                    className="block w-full truncate rounded-md px-3 py-2 text-left text-sm font-medium text-foreground hover:bg-secondary"
                  >
                    {m}
                  </button>
                ))
              )}
            </div>
            {query.trim() && (
              <button
                type="button"
                onClick={() => handlePick(query.trim())}
                className="w-full border-t border-border px-3.5 py-2.5 text-left text-sm font-medium text-foreground hover:bg-secondary"
              >
                Usar &quot;{query.trim()}&quot;
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
