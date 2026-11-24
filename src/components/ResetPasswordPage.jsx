import { useState } from 'react'
import { KeyRound } from 'lucide-react'
import logo from '../assets/protekto-logo.jpg'
import { useAuth } from '../context/AuthContext'

export default function ResetPasswordPage() {
  const { updatePassword, clearRecovery, signOut } = useAuth()
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

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
    setDone(true)
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
          <h1 className="text-lg font-bold text-foreground">Senha alterada!</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sua senha foi atualizada com sucesso.</p>
          <button
            onClick={clearRecovery}
            className="mt-6 w-full rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Continuar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="Logo Protekto Auto Services" className="h-14 w-14 rounded-md object-cover shadow-md" />
          <h1 className="mt-4 text-lg font-extrabold tracking-wide text-foreground">Definir nova senha</h1>
          <p className="mt-1 text-xs text-muted-foreground">Escolha uma nova senha para sua conta.</p>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Nova senha</label>
            <input
              type="password"
              autoFocus
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

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          <KeyRound className="h-4 w-4" />
          {loading ? 'Salvando...' : 'Salvar nova senha'}
        </button>

        <button
          type="button"
          onClick={signOut}
          className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          Cancelar e voltar ao login
        </button>
      </form>
    </div>
  )
}
