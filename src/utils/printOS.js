import logo from '../assets/protekto-logo.jpg'
import { BUSINESS_INFO, MODULES } from '../data/mockData'

const MESES_EXT = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

const STATUS_COLOR = {
  'Em andamento': '#b45309',
  Concluída: '#111827',
  'Pend. Pagamento': '#b91c1c',
  Agendado: '#b45309',
}

function currency(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function todayExtenso() {
  const now = new Date()
  return `Rio de Janeiro, ${now.getDate()} de ${MESES_EXT[now.getMonth()]} de ${now.getFullYear()}.`
}

function mesRef(dataStr) {
  if (!dataStr) return '—'
  const [, m, y] = dataStr.split('/')
  return `${m}/${y}`
}

function esc(str) {
  return String(str ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])
}

export function printOS(moduleKey, service) {
  const mod = MODULES[moduleKey]
  const isOS = moduleKey === 'lanternagem' || moduleKey === 'mecanica'

  const entrada = isOS ? service.entrada : service.data
  const entrega = isOS ? service.saida || '—' : service.entrega || '—'
  const status = service.status || (moduleKey === 'embelezamento' ? 'Agendado' : null)

  const itens = []
  if (Array.isArray(service.pecasList)) {
    service.pecasList.forEach((p) => {
      if (p.nome) itens.push({ nome: p.nome, valor: p.valor ? Number(String(p.valor).replace(',', '.')) : null })
    })
  }
  if (Array.isArray(service.servicosList)) {
    service.servicosList.forEach((s) => {
      if (s.nome) itens.push({ nome: s.nome, valor: s.valor ? Number(String(s.valor).replace(',', '.')) : null })
    })
  }
  if (itens.length === 0 && typeof service.valor === 'number') {
    itens.push({ nome: isOS ? 'Serviço' : 'Mão de obra', valor: service.valor })
  }

  const datasCols = isOS
    ? [
        ['ENTRADA', entrada || '—'],
        ['ENTREGA', entrega],
        ['DIAS NA OFICINA', service.dias != null ? `${service.dias}d` : '—'],
      ]
    : [
        ['ENTRADA', entrada || '—'],
        ['HORÁRIO', service.hora || '—'],
        ['ENTREGA', entrega],
      ]

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>OS ${esc(mod.label)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; color: #111827; margin: 0; padding: 40px 48px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 16px; border-bottom: 3px solid #111827; }
  .logo { width: 56px; height: 56px; border-radius: 8px; object-fit: cover; }
  .company { text-align: right; }
  .company h1 { font-size: 14px; margin: 0 0 4px; font-weight: 700; }
  .company p { font-size: 11px; margin: 0; color: #6b7280; line-height: 1.5; }
  .date { margin-top: 20px; font-size: 13px; }
  .title-row { margin-top: 12px; display: flex; align-items: baseline; gap: 10px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb; }
  .title-row h2 { font-size: 15px; margin: 0; font-weight: 700; }
  .status { font-size: 12px; font-weight: 700; text-transform: uppercase; color: ${status ? STATUS_COLOR[status] || '#111827' : '#111827'}; }
  .row { display: grid; gap: 24px; padding: 14px 0; border-bottom: 1px solid #e5e7eb; }
  .row.cols-2 { grid-template-columns: 1fr 1fr; }
  .row.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
  .field label { display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 3px; text-transform: uppercase; }
  .field span { font-size: 13px; }
  .section-title { font-size: 11px; font-weight: 700; letter-spacing: 0.05em; color: #6b7280; text-transform: uppercase; padding: 14px 0 6px; }
  table { width: 100%; border-collapse: collapse; margin-top: 4px; }
  thead th { text-align: left; font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb; }
  thead th:last-child { text-align: right; }
  tbody td { font-size: 13px; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
  tbody td:last-child { text-align: right; }
  .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #111827; text-align: right; }
  .footer strong { font-size: 12px; }
  .footer div { font-size: 10px; color: #6b7280; margin-top: 2px; }
  @media print { body { padding: 0 24px; } }
</style>
</head>
<body>
  <div class="header">
    <img class="logo" src="${logo}" alt="Protekto" />
    <div class="company">
      <h1>${esc(BUSINESS_INFO.nome)}</h1>
      <p>${esc(BUSINESS_INFO.endereco)}<br/>${esc(BUSINESS_INFO.cidade)}<br/>CEP: ${esc(BUSINESS_INFO.cep)} | CNPJ: ${esc(BUSINESS_INFO.cnpj)}</p>
    </div>
  </div>

  <p class="date">${todayExtenso()}</p>

  <div class="title-row">
    <h2>OS #${esc(service.id)} — ${esc(mod.label.toUpperCase())}</h2>
    ${status ? `<span class="status">${esc(status.toUpperCase())}</span>` : ''}
  </div>

  <div class="row ${service.responsavel ? 'cols-3' : 'cols-2'}">
    <div class="field"><label>Mês ref.</label><span>${esc(mesRef(entrada))}</span></div>
    ${service.responsavel ? `<div class="field"><label>Responsável</label><span>${esc(service.responsavel)}</span></div>` : ''}
    <div class="field"><label>Forma de pagamento</label><span>${esc(service.pagamento || '—')}</span></div>
  </div>

  <div class="section-title">Cliente</div>
  <div class="row cols-2">
    <div class="field"><label>Nome</label><span>${esc(service.cliente)}</span></div>
    <div class="field"><label>Contato</label><span>${esc(service.telefone || '—')}</span></div>
  </div>

  <div class="section-title">Veículo</div>
  <div class="row cols-2">
    <div class="field"><label>Marca / Modelo / Ano</label><span>${esc(service.marca)} – ${esc(service.modelo)}${service.ano ? ' – ' + esc(service.ano) : ''}</span></div>
    <div></div>
  </div>

  <div class="section-title">Datas</div>
  <div class="row cols-3">
    ${datasCols.map(([label, value]) => `<div class="field"><label>${esc(label)}</label><span>${esc(value)}</span></div>`).join('')}
  </div>

  ${
    itens.length > 0
      ? `<div class="section-title">Itens / Peças</div>
  <table>
    <thead><tr><th>Descrição</th><th>Valor</th></tr></thead>
    <tbody>
      ${itens.map((i) => `<tr><td>${esc(i.nome)}</td><td>${i.valor != null ? currency(i.valor) : '—'}</td></tr>`).join('')}
    </tbody>
  </table>`
      : ''
  }

  <div class="footer">
    <strong>${esc(BUSINESS_INFO.nome)}</strong>
    <div>CNPJ: ${esc(BUSINESS_INFO.cnpj)}</div>
  </div>
</body>
</html>`

  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  iframe.setAttribute('aria-hidden', 'true')
  document.body.appendChild(iframe)

  const frameDoc = iframe.contentWindow.document
  frameDoc.open()
  frameDoc.write(html)
  frameDoc.close()

  function cleanup() {
    if (iframe.parentNode) iframe.parentNode.removeChild(iframe)
  }

  iframe.contentWindow.onafterprint = cleanup
  setTimeout(() => {
    iframe.contentWindow.focus()
    iframe.contentWindow.print()
    // Safety net in case the browser never fires afterprint (some print-to-PDF flows skip it)
    setTimeout(cleanup, 60000)
  }, 250)
}
