import { useState } from 'react'
import { LogIn, Mail } from 'lucide-react'
import logo from '../assets/protekto-logo.jpg'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured } from '../lib/supabaseClient'

export default function LoginPage({ errorMessage }) {
  const { signIn, resetPassword } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [recoverySent, setRecoverySent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: signInError } = await signIn(email, senha)
    setLoading(false)
    if (signInError) {
      setError(signInError.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : signInError.message)
    }
  }

  async function handleForgotSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: resetError } = await resetPassword(email)
    setLoading(false)
    if (resetError) {
      setError(resetError.message)
      return
    }
    setRecoverySent(true)
  }

  function switchToForgot() {
    setMode('forgot')
    setError('')
    setRecoverySent(false)
  }

  function switchToLogin() {
    setMode('login')
    setError('')
    setRecoverySent(false)
  }

  const displayError = error || errorMessage

  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-xl">
          <h1 className="text-lg font-bold text-foreground">Configuração pendente</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            As variáveis <code className="rounded bg-secondary px-1 py-0.5">VITE_SUPABASE_URL</code> e{' '}
            <code className="rounded bg-secondary px-1 py-0.5">VITE_SUPABASE_ANON_KEY</code> ainda não foram
            preenchidas no arquivo <code className="rounded bg-secondary px-1 py-0.5">.env</code>.
          </p>
        </div>
      </div>
    )
  }

  if (mode === 'forgot') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-xl">
          <div className="flex flex-col items-center text-center">
            <img src={logo} alt="Logo Protekto Auto Services" className="h-14 w-14 rounded-md object-cover shadow-md" />
            <h1 className="mt-4 text-lg font-extrabold tracking-wide text-foreground">Recuperar senha</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Digite seu e-mail e enviaremos um link para redefinir sua senha.
            </p>
          </div>

          {recoverySent ? (
            <div className="mt-6 text-center">
              <p className="text-sm text-foreground">
                Se <strong>{email}</strong> estiver cadastrado, um link de recuperação foi enviado. Verifique sua
                caixa de entrada (e o spam).
              </p>
              <button
                onClick={switchToLogin}
                className="mt-6 w-full rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                Voltar ao login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotSubmit} noValidate>
              <div className="mt-6">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">E-mail</label>
                <input
                  type="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
                />
                {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              >
                <Mail className="h-4 w-4" />
                {loading ? 'Enviando...' : 'Enviar link de recuperação'}
              </button>
              <button
                type="button"
                onClick={switchToLogin}
                className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-foreground"
              >
                Voltar ao login
              </button>
            </form>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="Logo Protekto Auto Services" className="h-14 w-14 rounded-md object-cover shadow-md" />
          <h1 className="mt-4 text-lg font-extrabold tracking-wide text-foreground">PROTEKTO</h1>
          <p className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground">AUTO SERVICES</p>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">E-mail</label>
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-xs font-medium text-muted-foreground">Senha</label>
              <button
                type="button"
                onClick={switchToForgot}
                className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
            />
          </div>
          {displayError && <p className="text-xs text-destructive">{displayError}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          <LogIn className="h-4 w-4" />
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
