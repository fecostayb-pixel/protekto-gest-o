import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { brToIso, isoToBr } from '../utils/date'

export default function NovoClienteModal({
  cliente,
  onClose,
  onSave,
  title,
  submitLabel = 'Salvar',
  hideObservacoes = false,
  requirePhone = false,
}) {
  const isEdit = Boolean(cliente?.id)
  const toast = useToast()

  const [nome, setNome] = useState(cliente?.nome || '')
  const [telefone, setTelefone] = useState(cliente?.telefone || '')
  const [nascimento, setNascimento] = useState(cliente?.nascimento || '')
  const [marca, setMarca] = useState(cliente?.marca || '')
  const [modelo, setModelo] = useState(cliente?.modelo || '')
  const [ano, setAno] = useState(cliente?.ano || '')
  const [observacoes, setObservacoes] = useState(cliente?.observacoes || '')
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!nome.trim()) e.nome = 'Nome é obrigatório'
    if (requirePhone && !telefone.trim()) e.telefone = 'Telefone é obrigatório'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await onSave({
        id: cliente?.id,
        nome,
        telefone: telefone || undefined,
        nascimento: nascimento || undefined,
        marca: marca || undefined,
        modelo: modelo || undefined,
        ano: ano || undefined,
        observacoes: observacoes || undefined,
      })
    } catch {
      toast?.error('Erro ao salvar cliente. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-md rounded-2xl bg-card shadow-xl">
        <div className="flex items-start justify-between border-b border-border p-6">
          <h2 className="text-lg font-bold text-foreground">{title || (isEdit ? 'Editar cliente' : 'Novo cliente')}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Nome *</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
            />
            {errors.nome && <p className="mt-1 text-xs text-destructive">{errors.nome}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Telefone {requirePhone && '*'}
              </label>
              <input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(99) 99999-9999"
                className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
              />
              {errors.telefone && <p className="mt-1 text-xs text-destructive">{errors.telefone}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Data de nascimento</label>
              <input
                type="date"
                value={brToIso(nascimento)}
                onChange={(e) => setNascimento(isoToBr(e.target.value))}
                className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Marca (carro)</label>
              <input
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Modelo</label>
              <input
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Ano / Modelo</label>
            <input
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              placeholder="2023/2024"
              className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
            />
          </div>
          {!hideObservacoes && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Observações</label>
              <textarea
                rows={3}
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Informações adicionais sobre o cliente..."
                className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {saving ? 'Salvando...' : submitLabel}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  )
}
