import { useState } from 'react'
import { Plus, User, ShieldCheck, Pencil, Trash2, RotateCcw, XCircle } from 'lucide-react'
import NovoUsuarioModal from './NovoUsuarioModal'
import ConfirmDialog from './ConfirmDialog'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const PERFIL_STYLES = {
  USER: 'bg-secondary text-secondary-foreground',
  ADM: 'bg-accent text-accent-foreground',
}

export default function UsuariosPage() {
  const { usuarios, addUsuario, updateUsuario, setUsuarioAtivo, deleteUsuario } = useData()
  const { user } = useAuth()
  const toast = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState(null)
  const [deactivatingUsuario, setDeactivatingUsuario] = useState(null)
  const [deletingUsuario, setDeletingUsuario] = useState(null)

  async function handleSave(entry) {
    if (editingUsuario) {
      await updateUsuario(editingUsuario.id, entry)
      toast?.success('Usuário atualizado!')
    } else {
      await addUsuario(entry)
      toast?.success('Usuário criado!')
    }
    setModalOpen(false)
    setEditingUsuario(null)
  }

  async function handleConfirmDeactivate() {
    try {
      await setUsuarioAtivo(deactivatingUsuario.id, false)
      toast?.success('Usuário desativado!')
    } catch {
      toast?.error('Erro ao desativar usuário. Tente novamente.')
    } finally {
      setDeactivatingUsuario(null)
    }
  }

  async function handleReactivate(u) {
    try {
      await setUsuarioAtivo(u.id, true)
      toast?.success('Usuário reativado!')
    } catch {
      toast?.error('Erro ao reativar usuário. Tente novamente.')
    }
  }

  async function handleConfirmDelete() {
    try {
      await deleteUsuario(deletingUsuario.id)
      toast?.success('Usuário excluído permanentemente!')
    } catch (err) {
      toast?.error(err.message || 'Erro ao excluir usuário. Tente novamente.')
    } finally {
      setDeletingUsuario(null)
    }
  }

  return (
    <div>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Usuários</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gestão de perfis ADM/USER da plataforma.</p>
        </div>

        <button
          onClick={() => {
            setEditingUsuario(null)
            setModalOpen(true)
          }}
          className="flex shrink-0 items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Novo usuário
        </button>
      </header>

      <div className="mt-6 space-y-3">
        {usuarios.map((u) => {
          const isAdm = u.perfil === 'ADM'
          const isSelf = u.id === user?.id
          return (
            <div
              key={u.id}
              className={`flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow transition-shadow hover:shadow-md ${!u.ativo ? 'opacity-60' : ''}`}
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-md ${isAdm ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                  {isAdm ? <ShieldCheck className="h-5 w-5" /> : <User className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-foreground">{u.nome}</div>
                  {u.email && <div className="truncate text-xs text-muted-foreground">{u.email}</div>}
                  <div className="mt-1 flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide ${PERFIL_STYLES[u.perfil]}`}
                    >
                      {u.perfil}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-wide ${u.ativo ? 'border-border text-foreground' : 'border-destructive/30 text-destructive'}`}
                    >
                      {u.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </div>

              {!isSelf && (
                <div className="flex shrink-0 items-center gap-1">
                  {u.ativo ? (
                    <>
                      <button
                        onClick={() => {
                          setEditingUsuario(u)
                          setModalOpen(true)
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                        aria-label="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeactivatingUsuario(u)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Desativar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleReactivate(u)}
                        className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reativar
                      </button>
                      <button
                        onClick={() => setDeletingUsuario(u)}
                        className="flex items-center gap-1.5 rounded-md border border-destructive/30 px-2.5 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Excluir permanentemente
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {modalOpen && (
        <NovoUsuarioModal
          usuario={editingUsuario}
          onClose={() => {
            setModalOpen(false)
            setEditingUsuario(null)
          }}
          onSave={handleSave}
        />
      )}

      {deactivatingUsuario && (
        <ConfirmDialog
          title="Desativar usuário?"
          confirmLabel="Desativar"
          description={
            <>
              <strong className="font-semibold text-foreground">{deactivatingUsuario.nome}</strong> perde o acesso ao
              sistema. Você pode reativar essa conta depois, a qualquer momento.
            </>
          }
          onCancel={() => setDeactivatingUsuario(null)}
          onConfirm={handleConfirmDeactivate}
        />
      )}

      {deletingUsuario && (
        <ConfirmDialog
          title="Excluir usuário permanentemente?"
          confirmLabel="Excluir para sempre"
          description={
            <>
              Isso remove <strong className="font-semibold text-foreground">{deletingUsuario.nome}</strong> (
              {deletingUsuario.email}) e o acesso de login dele para sempre. <strong>Essa ação não pode ser desfeita.</strong>
            </>
          }
          onCancel={() => setDeletingUsuario(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}
