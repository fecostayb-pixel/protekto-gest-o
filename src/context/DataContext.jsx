import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'

const DataContext = createContext(null)

const EMPTY_SERVICES = { embelezamento: [], lanternagem: [], mecanica: [] }

function rowToService(row) {
  const base = {
    id: row.id,
    cliente: row.cliente,
    telefone: row.telefone,
    marca: row.marca,
    modelo: row.modelo,
    ano: row.ano,
    valor: row.valor ?? undefined,
    custo: row.custo ?? undefined,
    maoDeObra: row.mao_de_obra ?? undefined,
    status: row.status ?? undefined,
    pagamento: row.pagamento ?? undefined,
  }
  if (row.modulo === 'embelezamento') {
    return { ...base, data: row.data_entrada, hora: row.hora, entrega: row.data_saida || undefined }
  }
  return {
    ...base,
    entrada: row.data_entrada,
    saida: row.data_saida || undefined,
    dias: row.dias ?? undefined,
    responsavel: row.responsavel || undefined,
    pecasList: row.pecas_list || [],
    servicosList: row.servicos_list || [],
  }
}

function serviceToRow(modulo, entry) {
  const isEmb = modulo === 'embelezamento'
  return {
    modulo,
    cliente: entry.cliente,
    telefone: entry.telefone || null,
    marca: entry.marca || null,
    modelo: entry.modelo || null,
    ano: entry.ano || null,
    data_entrada: isEmb ? entry.data : entry.entrada,
    data_saida: (isEmb ? entry.entrega : entry.saida) || null,
    hora: isEmb ? entry.hora || null : null,
    dias: isEmb ? null : (entry.dias ?? null),
    responsavel: entry.responsavel || null,
    status: entry.status || null,
    pagamento: entry.pagamento || null,
    pecas_list: entry.pecasList || null,
    servicos_list: entry.servicosList || null,
    valor: entry.valor ?? null,
    custo: entry.custo ?? null,
    mao_de_obra: entry.maoDeObra ?? null,
  }
}

export function DataProvider({ children }) {
  const { user } = useAuth() ?? {}
  const [services, setServices] = useState(EMPTY_SERVICES)
  const [clientes, setClientes] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)

  const loadAll = useCallback(async () => {
    if (!isSupabaseConfigured || !user) {
      setServices(EMPTY_SERVICES)
      setClientes([])
      setUsuarios([])
      setLoading(false)
      return
    }
    setLoading(true)
    const [{ data: clientesData }, { data: servicosData }, { data: usuariosData }] = await Promise.all([
      supabase.from('clientes').select('*').order('id', { ascending: false }),
      supabase.from('servicos').select('*').order('id', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: true }),
    ])
    setClientes(clientesData || [])
    setUsuarios(usuariosData || [])
    const grouped = { embelezamento: [], lanternagem: [], mecanica: [] }
    ;(servicosData || []).forEach((row) => {
      if (grouped[row.modulo]) grouped[row.modulo].push(rowToService(row))
    })
    setServices(grouped)
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  async function addCliente(entry) {
    const { data, error } = await supabase.from('clientes').insert(entry).select().single()
    if (error) throw error
    setClientes((prev) => [data, ...prev])
    return data
  }

  async function updateCliente(id, entry) {
    const { data, error } = await supabase.from('clientes').update(entry).eq('id', id).select().single()
    if (error) throw error
    setClientes((prev) => prev.map((c) => (c.id === id ? data : c)))
    return data
  }

  async function deleteCliente(id) {
    const { error } = await supabase.from('clientes').delete().eq('id', id)
    if (error) throw error
    setClientes((prev) => prev.filter((c) => c.id !== id))
  }

  async function addServico(modulo, entry) {
    const { data, error } = await supabase
      .from('servicos')
      .insert(serviceToRow(modulo, entry))
      .select()
      .single()
    if (error) throw error
    const mapped = rowToService(data)
    setServices((prev) => ({ ...prev, [modulo]: [mapped, ...prev[modulo]] }))
    return mapped
  }

  async function updateServico(modulo, id, entry) {
    const { data, error } = await supabase
      .from('servicos')
      .update(serviceToRow(modulo, entry))
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    const mapped = rowToService(data)
    setServices((prev) => ({ ...prev, [modulo]: prev[modulo].map((s) => (s.id === id ? mapped : s)) }))
    return mapped
  }

  async function deleteServico(modulo, id) {
    const { error } = await supabase.from('servicos').delete().eq('id', id)
    if (error) throw error
    setServices((prev) => ({ ...prev, [modulo]: prev[modulo].filter((s) => s.id !== id) }))
  }

  async function addUsuario(entry) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const { data, error } = await supabase.functions.invoke('create-user', {
      body: entry,
      headers: { Authorization: `Bearer ${session?.access_token}` },
    })
    if (error) throw error
    if (data?.error) throw new Error(data.error)
    setUsuarios((prev) => [...prev, data.profile])
    return data.profile
  }

  async function updateUsuario(id, entry) {
    const { data, error } = await supabase.from('profiles').update(entry).eq('id', id).select().single()
    if (error) throw error
    setUsuarios((prev) => prev.map((u) => (u.id === id ? data : u)))
    return data
  }

  async function setUsuarioAtivo(id, ativo) {
    return updateUsuario(id, { ativo })
  }

  async function deleteUsuario(id) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const { data, error } = await supabase.functions.invoke('delete-user', {
      body: { id },
      headers: { Authorization: `Bearer ${session?.access_token}` },
    })
    if (error) throw error
    if (data?.error) throw new Error(data.error)
    setUsuarios((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <DataContext.Provider
      value={{
        services,
        clientes,
        usuarios,
        loading,
        refresh: loadAll,
        addCliente,
        updateCliente,
        deleteCliente,
        addServico,
        updateServico,
        deleteServico,
        addUsuario,
        updateUsuario,
        setUsuarioAtivo,
        deleteUsuario,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  return useContext(DataContext)
}
