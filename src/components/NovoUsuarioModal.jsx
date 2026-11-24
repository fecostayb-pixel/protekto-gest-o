import { useState } from 'react'
import { X } from 'lucide-react'
import { useToast } from '../context/ToastContext'

export default function NovoUsuarioModal({ usuario, onClose, onSave }) {
  const isEdit = Boolean(usuario)
  const toast = useToast()
  const [email, setEmail] = useState(usuario?.email || '')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState(usuario?.nome || '')
  const [perfil, setPerfil] = useState(usuario?.perfil || 'USER')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (isEdit) {
        await onSave({ nome: nome || email.split('@')[0], perfil })
      } else {
        await onSave({ email, password: senha, nome: nome || email.split('@')[0], perfil })
      }
    } catch (err) {
      toast?.error(err.message || 'Erro ao salvar usuário. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-md rounded-2xl bg-card shadow-xl">
        <div className="flex items-start justify-between border-b border-border p-6">
          <h2 className="text-lg font-bold text-foreground">{isEdit ? 'Editar usuário' : 'Novo usuário'}</h2>
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
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">E-mail *</label>
            <input
              required
              disabled={isEdit}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40 disabled:opacity-60"
            />
          </div>
          {!isEdit && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Senha *</label>
              <input
                required
                type="password"
                minLength={6}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:bg-card focus:ring-2 focus:ring-accent/40"
              />
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Nome</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Perfil</label>
            <select
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
            >
              <option value="USER">User</option>
              <option value="ADM">Admin</option>
            </select>
          </div>
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
            {saving ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar usuário'}
          </button>
        </div>
      </form>
    </div>
  )
}
