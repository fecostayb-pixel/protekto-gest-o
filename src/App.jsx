import { useEffect, useState } from 'react'
import { ToastProvider } from './context/ToastContext'
import { DataProvider, useData } from './context/DataContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { isSupabaseConfigured, supabase } from './lib/supabaseClient'
import LoginPage from './components/LoginPage'
import ResetPasswordPage from './components/ResetPasswordPage'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './components/Dashboard'
import EmbelezamentoPage from './components/EmbelezamentoPage'
import OSPage from './components/OSPage'
import ClientesPage from './components/ClientesPage'
import UsuariosPage from './components/UsuariosPage'

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </ToastProvider>
  )
}

function AuthGate() {
  const { session, loading, signOut, recovery } = useAuth()
  const [checkingProfile, setCheckingProfile] = useState(false)
  const [blockedMessage, setBlockedMessage] = useState('')

  const userId = session?.user?.id

  useEffect(() => {
    if (!userId || recovery) return
    let cancelled = false
    setCheckingProfile(true)
    supabase
      .from('profiles')
      .select('ativo')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return
        // Fail closed: only a session backed by a profiles row (created via the
        // "Novo usuário" flow) is a legitimate account. Anyone who signed up
        // directly against Supabase's API has no profile and must be blocked.
        if (!data || data.ativo === false) {
          setBlockedMessage(
            !data
              ? 'Conta não autorizada. Peça a um administrador para criar seu acesso.'
              : 'Sua conta foi desativada. Fale com um administrador.',
          )
          signOut()
        } else {
          setBlockedMessage('')
        }
        setCheckingProfile(false)
      })
    return () => {
      cancelled = true
    }
  }, [userId, recovery, signOut])

  if (!isSupabaseConfigured) return <LoginPage />

  if (loading || checkingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Carregando...
      </div>
    )
  }

  if (!session) return <LoginPage errorMessage={blockedMessage} />

  if (recovery) return <ResetPasswordPage />

  return (
    <DataProvider>
      <AppShell />
    </DataProvider>
  )
}

const ADMIN_ONLY_PAGES = new Set(['dashboard', 'usuarios'])
const DEFAULT_USER_PAGE = 'embelezamento'

function AppShell() {
  const { user } = useAuth()
  const { usuarios, loading: dataLoading } = useData()
  const isAdmin = usuarios.find((u) => u.id === user?.id)?.perfil === 'ADM'

  const [active, setActive] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (dataLoading) return
    if (!isAdmin && ADMIN_ONLY_PAGES.has(active)) {
      setActive(DEFAULT_USER_PAGE)
    }
  }, [dataLoading, isAdmin, active])

  function handleNavigate(key) {
    setActive(key)
    setMobileOpen(false)
  }

  function renderPage() {
    const page = !isAdmin && ADMIN_ONLY_PAGES.has(active) ? DEFAULT_USER_PAGE : active
    switch (page) {
      case 'dashboard':
        return <Dashboard />
      case 'embelezamento':
        return <EmbelezamentoPage />
      case 'lanternagem':
        return <OSPage key="lanternagem" moduleKey="lanternagem" />
      case 'mecanica':
        return <OSPage key="mecanica" moduleKey="mecanica" />
      case 'clientes':
        return <ClientesPage />
      case 'usuarios':
        return <UsuariosPage />
      default:
        return <EmbelezamentoPage />
    }
  }

  if (dataLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Carregando...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        active={active}
        onNavigate={handleNavigate}
        isAdmin={isAdmin}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{renderPage()}</main>
      </div>
    </div>
  )
}
