import { Menu } from 'lucide-react'
import logo from '../assets/protekto-logo.jpg'

export default function Topbar({ onOpenMobile }) {
  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card px-4 py-3 lg:hidden">
      <button
        onClick={onOpenMobile}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo Protekto Auto Services" className="h-8 w-8 rounded-md object-cover shadow-sm" />
        <span className="text-sm font-extrabold tracking-tight text-foreground">PROTEKTO</span>
      </div>
    </div>
  )
}
