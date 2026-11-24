import { useState } from 'react'
import {
  LayoutDashboard,
  Sparkles,
  Hammer,
  Wrench,
  Users,
  UserCog,
  Key,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import logo from '../assets/protekto-logo.jpg'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import ChangePasswordModal from './ChangePasswordModal'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: true },
  { key: 'embelezamento', label: 'Embelezamento', icon: Sparkles },
  { key: 'lanternagem', label: 'Lanternagem', icon: Hammer },
  { key: 'mecanica', label: 'Mecânica', icon: Wrench },
  { key: 'clientes', label: 'Clientes', icon: Users },
  { key: 'usuarios', label: 'Usuários', icon: UserCog, adminOnly: true },
]

export default function Sidebar({ active, onNavigate, isAdmin, collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  const { user, signOut } = useAuth()
  const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin)
  const toast = useToast()
  const [changingPassword, setChangingPassword] = useState(false)

  const email = user?.email || ''
  const initials = email.slice(0, 2).toUpperCase() || 'FC'
  const displayName = email || 'Usuário'

  async function handleSignOut() {
    await signOut()
    toast?.success('Sessão encerrada.')
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen flex-col bg-sidebar transition-all duration-200 lg:sticky lg:top-0 lg:translate-x-0
        ${collapsed ? 'lg:w-20' : 'lg:w-64'}
        ${mobileOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center justify-between gap-2 p-4">
          <div className={`flex min-w-0 items-center gap-2.5 ${collapsed ? 'lg:justify-center' : ''}`}>
            {!collapsed && (
              <>
                <img
                  src={logo}
                  alt="Logo Protekto Auto Services"
                  className="h-10 w-10 shrink-0 rounded-md object-cover shadow-md"
                />
                <div className="min-w-0 leading-none">
                  <div className="truncate text-sm font-extrabold tracking-wide text-sidebar-foreground">PROTEKTO</div>
                  <div className="truncate text-[10px] font-semibold tracking-[0.2em] text-sidebar-muted">
                    AUTO SERVICES
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-md text-sidebar-muted hover:bg-white/10 hover:text-sidebar-foreground lg:flex"
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          <button
            onClick={onCloseMobile}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sidebar-muted hover:bg-white/10 hover:text-sidebar-foreground lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="space-y-1">
            {visibleItems.map((item) => {
              const isActive = active === item.key
              return (
                <li key={item.key}>
                  <button
                    onClick={() => onNavigate(item.key)}
                    title={collapsed ? item.label : undefined}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                    ${collapsed ? 'lg:justify-center' : ''}
                    ${isActive ? 'bg-accent text-accent-foreground' : 'text-sidebar-foreground/80 hover:bg-white/10 hover:text-sidebar-foreground'}`}
                  >
                    <item.icon className="h-[18px] w-[18px] shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className={`flex items-center gap-3 ${collapsed ? 'lg:justify-center' : ''}`}>
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-sm font-bold text-sidebar-foreground">
              {initials}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-sidebar-foreground">{displayName}</div>
                <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                  <Wrench className="h-2.5 w-2.5" />
                  {isAdmin ? 'ADMIN' : 'USUÁRIO'}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-1">
            <button
              onClick={() => setChangingPassword(true)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-muted transition-colors hover:bg-white/10 hover:text-sidebar-foreground ${collapsed ? 'lg:justify-center' : ''}`}
              title={collapsed ? 'Alterar senha' : undefined}
            >
              <Key className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Alterar senha</span>}
            </button>
            <button
              onClick={handleSignOut}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-muted transition-colors hover:bg-white/10 hover:text-red-400 ${collapsed ? 'lg:justify-center' : ''}`}
              title={collapsed ? 'Sair' : undefined}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Sair</span>}
            </button>
          </div>
        </div>
      </aside>

      {changingPassword && <ChangePasswordModal onClose={() => setChangingPassword(false)} />}
    </>
  )
}
