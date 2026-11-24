import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function ChangePasswordModal({ onClose }) {
  const { updatePassword } = useAuth()
  const toast = useToast()
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (senha !== confirmar) {
      setError('As senhas não coincidem.')
      return
    }
    setError('')
    setLoading(true)
    const { error: updateError } = await updatePassword(senha)
    setLoading(false)
    if (updateError) {
      setError(updateError.message)
      return
    }
    toast?.success('Senha alterada com sucesso!')
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-sm rounded-2xl bg-card shadow-xl">
        <div className="flex items-start justify-between border-b border-border p-6">
          <h2 className="text-lg font-bold text-foreground">Alterar senha</h2>
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
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Nova senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Confirmar nova senha</label>
            <input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
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
            disabled={loading}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  )
}
