import { useState } from 'react'
import { X } from 'lucide-react'
import { HORARIOS } from '../data/mockData'
import { brToIso, isoToBr } from '../utils/date'
import { useToast } from '../context/ToastContext'
import ClienteCombobox from './ClienteCombobox'
import MarcaCombobox from './MarcaCombobox'

function parseBR(dateStr) {
  const [d, m, y] = dateStr.split('/').map(Number)
  return new Date(y, m - 1, d)
}

function formatDM(date) {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
}

function semanaLabel(dateStr) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return ''
  const date = parseBR(dateStr)
  const dow = date.getDay()
  const monday = new Date(date)
  monday.setDate(date.getDate() - (dow === 0 ? 6 : dow - 1))
  const friday = new Date(monday)
  friday.setDate(monday.getDate() + 4)
  return `SEMANA DE ${formatDM(monday)} A ${formatDM(friday)}`
}

export default function AgendarServicoModal({ service, onClose, onSave }) {
  const isEdit = Boolean(service)
  const toast = useToast()

  const [data, setData] = useState(service?.data || '')
  const [horario, setHorario] = useState(service?.hora || '')
  const [entrega, setEntrega] = useState(service?.entrega || '')
  const [cliente, setCliente] = useState(service?.cliente || '')
  const [contato, setContato] = useState(service?.telefone || '')
  const [marca, setMarca] = useState(service?.marca || '')
  const [modelo, setModelo] = useState(service?.modelo || '')
  const [ano, setAno] = useState(service?.ano || '')
  const [maoDeObra, setMaoDeObra] = useState(String(service?.valor ?? '69'))
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!data) e.data = 'Data é obrigatória'
    if (!horario) e.horario = 'Horário é obrigatório'
    if (!cliente) e.cliente = 'Cliente é obrigatório'
    if (!contato) e.contato = 'Contato é obrigatório'
    if (!marca) e.marca = 'Marca é obrigatória'
    if (!modelo) e.modelo = 'Modelo é obrigatório'
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
        id: service?.id,
        cliente,
        telefone: contato,
        marca,
        modelo,
        ano,
        data,
        hora: horario,
        entrega: entrega || undefined,
        valor: maoDeObra ? Number(maoDeObra.replace(',', '.')) : undefined,
      })
      toast?.success(isEdit ? 'Agendamento atualizado!' : 'Agendamento confirmado!')
    } catch {
      toast?.error('Erro ao salvar agendamento. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-2xl rounded-2xl bg-card shadow-xl">
        <div className="flex items-start justify-between border-b border-border p-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {isEdit ? 'Editar Agendamento' : 'Agendar Embelezamento'}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">Preencha os dados do cliente e do veículo</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-6 overflow-y-auto p-6">
          <section>
            <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Data e horário</h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Data *</label>
                <input
                  type="date"
                  value={brToIso(data)}
                  onChange={(e) => setData(isoToBr(e.target.value))}
                  className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
                />
                {errors.data && <p className="mt-1 text-xs text-destructive">{errors.data}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Semana</label>
                <input
                  disabled
                  value={semanaLabel(data)}
                  className="w-full rounded-md border border-border bg-muted px-3.5 py-2.5 text-sm text-muted-foreground outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Horário *</label>
                <select
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
                >
                  <option value="">Selecione</option>
                  {HORARIOS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                {errors.horario && <p className="mt-1 text-xs text-destructive">{errors.horario}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Data de Entrega</label>
                <input
                  type="date"
                  value={brToIso(entrega)}
                  onChange={(e) => setEntrega(isoToBr(e.target.value))}
                  className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Cliente</h3>
            <div className="mt-3 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Cliente *</label>
                <ClienteCombobox
                  nome={cliente}
                  telefone={contato}
                  onSelect={(c) => {
                    setCliente(c.nome)
                    if (c.telefone) setContato(c.telefone)
                  }}
                />
                {errors.cliente && <p className="mt-1 text-xs text-destructive">{errors.cliente}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Contato *</label>
                <input
                  value={contato}
                  onChange={(e) => setContato(e.target.value)}
                  placeholder="(99) 99999-9999"
                  className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
                />
                {errors.contato && <p className="mt-1 text-xs text-destructive">{errors.contato}</p>}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Veículo</h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Marca *</label>
                <MarcaCombobox value={marca} onChange={setMarca} />
                {errors.marca && <p className="mt-1 text-xs text-destructive">{errors.marca}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Modelo *</label>
                <input
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  placeholder="Ex: Corolla"
                  className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
                />
                {errors.modelo && <p className="mt-1 text-xs text-destructive">{errors.modelo}</p>}
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
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Mão de obra</h3>
            <div className="mt-3">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Mão de Obra (R$)</label>
              <input
                value={maoDeObra}
                onChange={(e) => setMaoDeObra(e.target.value)}
                className="w-full max-w-xs rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
              />
            </div>
          </section>
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
            {saving ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Confirmar Agendamento'}
          </button>
        </div>
      </form>
    </div>
  )
}
