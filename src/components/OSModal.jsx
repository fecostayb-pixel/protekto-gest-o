import { useEffect, useState } from 'react'
import { X, Plus } from 'lucide-react'
import { RESPONSAVEIS, STATUS_OS, FORMAS_PAGAMENTO, MODULES } from '../data/mockData'
import { brToIso, isoToBr } from '../utils/date'
import { useToast } from '../context/ToastContext'
import ClienteCombobox from './ClienteCombobox'
import MarcaCombobox from './MarcaCombobox'

function emptyLine() {
  return { id: Math.random().toString(36).slice(2), nome: '', custo: '', valor: '' }
}

function toNumber(v) {
  const n = parseFloat(String(v).replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

function currency(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function mesRefFromDate(dateStr) {
  const m = dateStr.match(/^\d{2}\/(\d{2})\/(\d{4})$/)
  return m ? `${m[1]}/${m[2]}` : ''
}

export default function OSModal({ moduleKey, service, onClose, onSave }) {
  const isEdit = Boolean(service)
  const isMecanica = moduleKey === 'mecanica'
  const mod = MODULES[moduleKey]
  const toast = useToast()

  const [entrada, setEntrada] = useState(service?.entrada || '')
  const [previsao, setPrevisao] = useState(service?.saida || '')
  const [cliente, setCliente] = useState(service?.cliente || '')
  const [contato, setContato] = useState(service?.telefone || '')
  const [marca, setMarca] = useState(service?.marca || '')
  const [modelo, setModelo] = useState(service?.modelo || '')
  const [ano, setAno] = useState(service?.ano || '')
  const [responsavel, setResponsavel] = useState(service?.responsavel || RESPONSAVEIS[0])
  const [status, setStatus] = useState(service?.status || STATUS_OS[0])
  const [pagamento, setPagamento] = useState(service?.pagamento || FORMAS_PAGAMENTO[0])
  const [pecas, setPecas] = useState(service?.pecasList || [])
  const [servicos, setServicos] = useState(service?.servicosList || [emptyLine()])
  const [custoServicos, setCustoServicos] = useState(isMecanica ? String(service?.custo ?? '') : '')
  const [custoPecas, setCustoPecas] = useState('')
  const [valorCobrado, setValorCobrado] = useState(String(service?.valor ?? ''))
  const [maoDeObra, setMaoDeObra] = useState(isMecanica ? String(service?.maoDeObra ?? '') : '')
  const [custoSimples, setCustoSimples] = useState('')
  const [cobradoSimples, setCobradoSimples] = useState('')
  const [errors, setErrors] = useState({})

  // Itens com valores preenchidos recalculam os campos de baixo automaticamente.
  // Sem itens (ex: OS antiga sem detalhamento), preserva o valor já carregado do registro.
  useEffect(() => {
    if (isMecanica) {
      const somaCustoReal = pecas.reduce((s, l) => s + toNumber(l.custo), 0)
      const somaValor = pecas.reduce((s, l) => s + toNumber(l.valor), 0)
      if (somaCustoReal) setCustoServicos(String(somaCustoReal))
      if (somaValor) setValorCobrado(String(somaValor))
      return
    }
    const somaServicosCusto = servicos.reduce((s, l) => s + toNumber(l.custo), 0)
    const somaPecasCusto = pecas.reduce((s, l) => s + toNumber(l.custo), 0)
    const somaValor = [...servicos, ...pecas].reduce((s, l) => s + toNumber(l.valor), 0)
    if (somaServicosCusto) setCustoServicos(String(somaServicosCusto))
    if (somaPecasCusto) setCustoPecas(String(somaPecasCusto))
    if (somaValor) setValorCobrado(String(somaValor))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servicos, pecas, isMecanica])

  const usaCalculoRapido = custoSimples.trim() !== '' || cobradoSimples.trim() !== ''
  const valorItemizado = toNumber(valorCobrado)
  const custoItemizado = isMecanica ? toNumber(custoServicos) : toNumber(custoServicos) + toNumber(custoPecas)

  const valorTotal = usaCalculoRapido ? toNumber(cobradoSimples) : valorItemizado
  const custoTotal = usaCalculoRapido ? toNumber(custoSimples) : custoItemizado
  const lucro = valorTotal - custoTotal

  function updateLine(setter, id, field, value) {
    setter((lines) => lines.map((l) => (l.id === id ? { ...l, [field]: value } : l)))
  }

  function removeLine(setter, id) {
    setter((lines) => lines.filter((l) => l.id !== id))
  }

  function validate() {
    const e = {}
    if (!entrada) e.entrada = 'Entrada é obrigatória'
    if (!cliente) e.cliente = 'Cliente é obrigatório'
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
        entrada,
        saida: previsao || undefined,
        dias:
          previsao && entrada
            ? Math.round((new Date(previsao.split('/').reverse().join('-')) - new Date(entrada.split('/').reverse().join('-'))) / 86400000)
            : undefined,
        responsavel: isMecanica ? undefined : responsavel,
        status,
        pagamento,
        pecasList: pecas,
        servicosList: isMecanica ? undefined : servicos,
        valor: valorTotal || undefined,
        custo: lucro || undefined,
        maoDeObra: isMecanica ? toNumber(maoDeObra) || undefined : undefined,
      })
      toast?.success(isEdit ? 'OS atualizada!' : 'OS aberta com sucesso!')
    } catch {
      toast?.error('Erro ao salvar OS. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-2xl rounded-2xl bg-card shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-border p-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {isEdit ? `Editar OS — ${mod.label}` : `Abertura de OS — ${mod.label}`}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">Preencha os dados da ordem de serviço</p>
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
            <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Datas</h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Entrada *</label>
                <input
                  type="date"
                  value={brToIso(entrada)}
                  onChange={(e) => setEntrada(isoToBr(e.target.value))}
                  className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
                />
                {errors.entrada && <p className="mt-1 text-xs text-destructive">{errors.entrada}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Previsão de entrega</label>
                <input
                  type="date"
                  value={brToIso(previsao)}
                  onChange={(e) => setPrevisao(isoToBr(e.target.value))}
                  className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Mês ref.</label>
                <input
                  disabled
                  value={mesRefFromDate(entrada)}
                  className="w-full rounded-md border border-border bg-muted px-3.5 py-2.5 text-sm text-muted-foreground outline-none"
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
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Contato</label>
                <input
                  value={contato}
                  onChange={(e) => setContato(e.target.value)}
                  placeholder="(99) 99999-9999"
                  className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
                />
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
            <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Execução</h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {!isMecanica && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Responsável *</label>
                  <select
                    value={responsavel}
                    onChange={(e) => setResponsavel(e.target.value)}
                    className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
                  >
                    {RESPONSAVEIS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
                >
                  {STATUS_OS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Forma de pagamento</label>
                <select
                  value={pagamento}
                  onChange={(e) => setPagamento(e.target.value)}
                  className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
                >
                  {FORMAS_PAGAMENTO.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {isMecanica ? (
            <LineItemsSection
              title="Itens / Peças"
              emptyLabel="Nenhum item adicionado."
              valueLabel="VALOR COBRADO"
              costLabel="CUSTO REAL"
              lines={pecas}
              onAdd={() => setPecas((l) => [...l, emptyLine()])}
              onUpdate={(id, field, value) => updateLine(setPecas, id, field, value)}
              onRemove={(id) => removeLine(setPecas, id)}
            />
          ) : (
            <>
              <LineItemsSection
                title="Peças"
                emptyLabel="Nenhuma peça adicionada."
                valueLabel="VALOR"
                lines={pecas}
                onAdd={() => setPecas((l) => [...l, emptyLine()])}
                onUpdate={(id, field, value) => updateLine(setPecas, id, field, value)}
                onRemove={(id) => removeLine(setPecas, id)}
              />

              <LineItemsSection
                title="Serviços"
                emptyLabel="Nenhum serviço adicionado."
                valueLabel="VALOR COBRADO"
                costLabel="CUSTO REAL"
                lines={servicos}
                onAdd={() => setServicos((l) => [...l, emptyLine()])}
                onUpdate={(id, field, value) => updateLine(setServicos, id, field, value)}
                onRemove={(id) => removeLine(setServicos, id)}
              />
            </>
          )}

          <section>
            <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Financeiro</h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {isMecanica ? (
                <>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Custo real</label>
                    <input
                      disabled
                      value={custoServicos}
                      placeholder="Calculado automaticamente: soma dos custos reais dos itens"
                      className="w-full rounded-md border border-border bg-muted px-3.5 py-2.5 text-sm text-muted-foreground outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Mão de obra</label>
                    <input
                      value={maoDeObra}
                      onChange={(e) => setMaoDeObra(e.target.value)}
                      placeholder="R$"
                      className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Valor cobrado</label>
                    <input
                      value={valorCobrado}
                      onChange={(e) => setValorCobrado(e.target.value)}
                      placeholder="R$"
                      className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Custo de serviços</label>
                    <input
                      value={custoServicos}
                      onChange={(e) => setCustoServicos(e.target.value)}
                      placeholder="R$"
                      className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Custo peças</label>
                    <input
                      value={custoPecas}
                      onChange={(e) => setCustoPecas(e.target.value)}
                      placeholder="R$"
                      className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Valor cobrado</label>
                    <input
                      value={valorCobrado}
                      onChange={(e) => setValorCobrado(e.target.value)}
                      placeholder="R$"
                      className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 flex items-center justify-end gap-8 rounded-md bg-secondary px-4 py-3">
              <div className="text-right">
                <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Valor total</div>
                <div className="text-base font-bold text-foreground">{currency(valorTotal)}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                  {isMecanica ? 'Lucro final' : 'Lucro'}
                </div>
                <div className="text-base font-bold text-foreground">{currency(lucro)}</div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Cálculo rápido (opcional)</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Preencha aqui só se não precisar detalhar peças ou itens — se preenchido, substitui o cálculo acima.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Custo</label>
                <input
                  value={custoSimples}
                  onChange={(e) => setCustoSimples(e.target.value)}
                  placeholder="R$"
                  className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Cobrado</label>
                <input
                  value={cobradoSimples}
                  onChange={(e) => setCobradoSimples(e.target.value)}
                  placeholder="R$"
                  className="w-full rounded-md border border-border bg-secondary px-3.5 py-2.5 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Lucro</label>
                <input
                  disabled
                  value={usaCalculoRapido ? currency(lucro) : ''}
                  placeholder="R$"
                  className="w-full rounded-md border border-border bg-muted px-3.5 py-2.5 text-sm text-muted-foreground outline-none"
                />
              </div>
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
            {saving ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Abrir OS'}
          </button>
        </div>
      </form>
    </div>
  )
}

function LineItemsSection({ title, emptyLabel, valueLabel, costLabel, lines, onAdd, onUpdate, onRemove }) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">{title}</h3>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
        >
          <Plus className="h-3.5 w-3.5" />
          Adicionar
        </button>
      </div>

      {lines.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <div className="mt-3 space-y-3">
          {costLabel && (
            <div className="hidden grid-cols-[1fr_120px_120px_28px] gap-3 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase sm:grid">
              <span>Nome</span>
              <span>{costLabel}</span>
              <span>{valueLabel}</span>
              <span />
            </div>
          )}
          {lines.map((line) => (
            <div
              key={line.id}
              className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_120px_120px_28px] sm:gap-3"
            >
              <input
                value={line.nome}
                onChange={(e) => onUpdate(line.id, 'nome', e.target.value)}
                placeholder="Nome"
                className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
              />
              {costLabel && (
                <input
                  value={line.custo}
                  onChange={(e) => onUpdate(line.id, 'custo', e.target.value)}
                  placeholder="R$"
                  className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
                />
              )}
              <input
                value={line.valor}
                onChange={(e) => onUpdate(line.id, 'valor', e.target.value)}
                placeholder="R$"
                className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-accent/40"
              />
              <button
                type="button"
                onClick={() => onRemove(line.id)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
                aria-label="Remover"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
