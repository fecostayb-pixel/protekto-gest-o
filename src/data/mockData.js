export const MODULES = {
  embelezamento: {
    key: 'embelezamento',
    label: 'Embelezamento',
    tag: 'EMB.',
    subtitle: 'Polimento, higienização, vitrificação e estética.',
  },
  lanternagem: {
    key: 'lanternagem',
    label: 'Lanternagem',
    tag: 'LANT.',
    subtitle: 'Reparos de funilaria, pintura e estrutura.',
  },
  mecanica: {
    key: 'mecanica',
    label: 'Mecânica',
    tag: 'MEC.',
    subtitle: 'Manutenção mecânica, revisões e diagnósticos.',
  },
}

export const BUSINESS_INFO = {
  nome: 'PROTEKTO AUTO SERVICES',
  endereco: 'Avenida Olegário Maciel, 531 – 1º Subsolo',
  cidade: 'Barra da Tijuca – Rio de Janeiro – RJ',
  cep: '22621-200',
  cnpj: '33.177.805/0001-64',
}

export const RESPONSAVEIS = [
  'Maurílio (Mecânico)',
  'Valério (Capodeira)',
  'Wilson (Funilaria)',
  'Hudson (Funilaria)',
  'Thiago (Insufilm)',
]
export const STATUS_OS = ['Em andamento', 'Concluída', 'Pend. Pagamento']
export const FORMAS_PAGAMENTO = ['À vista', 'Cartão de crédito', 'Cartão de débito', 'PIX', 'Boleto', 'Parcelado']
export const HORARIOS = ['08H00', '09H00', '10H00', '11H00', '13H00', '14H00', '15H00', '16H00']
export const MARCAS_VEICULOS = [
  'Fiat', 'Ford', 'Volkswagen', 'Chevrolet', 'Honda', 'Toyota', 'Hyundai', 'Jeep',
  'BMW', 'Mercedes-Benz', 'Audi', 'Kia', 'Nissan', 'Renault', 'Peugeot', 'Citroën',
  'Mitsubishi', 'Subaru', 'Volvo', 'Porsche', 'Land Rover', 'Mini', 'Ram', 'Chery',
  'Caoa Chery', 'BYD', 'GWM', 'Suzuki',
]

let clienteIdCounter = 1
function cli(entry) {
  return { id: clienteIdCounter++, ...entry }
}

export const CLIENTES = [
  cli({ nome: 'Fred', telefone: '(21) 96710-9931' }),
  cli({ nome: 'Cheila', telefone: '(21) 99114-8384' }),
  cli({ nome: 'Denise', telefone: '(21) 99192-9746' }),
  cli({ nome: 'Mariana', telefone: '(21) 99746-1518', marca: 'Jac', modelo: 'Chines' }),
  cli({ nome: 'Gabriel', telefone: '(21) 98227-2622', marca: 'Fiat', modelo: 'Uno' }),
  cli({ nome: 'Yasmin', telefone: '(21) 98199-6884' }),
  cli({ nome: 'Juliana', telefone: '(21) 99930-4440', marca: 'Fiat', modelo: 'Argo' }),
  cli({ nome: 'Camila', telefone: '(21) 99874-8444', marca: 'Volkswagen', modelo: 'Tiguan' }),
  cli({ nome: 'Maria', telefone: '(21) 98830-3500', marca: 'Fiat', modelo: 'Palio' }),
  cli({ nome: 'Penelope', telefone: '(21) 98027-3555', marca: 'Fiat', modelo: 'Fiat' }),
  cli({ nome: 'Rafael', telefone: '(21) 99936-2059', marca: 'BMW', modelo: 'X5' }),
  cli({ nome: 'Fabrício', telefone: '(21) 98617-4747', marca: 'Volvo', modelo: 'XC40' }),
  cli({ nome: 'Felipe', telefone: '(21) 98765-0022', marca: 'Jeep', modelo: 'Compass' }),
  cli({ nome: 'Ivan/Regina', telefone: '(21) 99887-1122', marca: 'Hyundai', modelo: 'Creta' }),
  cli({ nome: 'Guttemberg', telefone: '(21) 98212-3344', marca: 'Jeep', modelo: 'Commander' }),
  cli({ nome: 'Sergio', telefone: '(21) 97744-5566', marca: 'Nissan', modelo: 'March' }),
  cli({ nome: 'Fernando', telefone: '(21) 96633-7788', marca: 'Chevrolet', modelo: 'Tracker' }),
  cli({ nome: 'Marcelo', telefone: '(21) 98765-0011', marca: 'Chevrolet', modelo: 'Onix' }),
  cli({ nome: 'Arduini', telefone: '(21) 99223-4455', marca: 'Toyota', modelo: 'SW4' }),
  cli({ nome: 'Anderson', telefone: '(21) 98112-9900', marca: 'Volkswagen', modelo: 'Nivus' }),
  cli({ nome: 'Flavia', telefone: '(21) 99001-2233', marca: 'Renault', modelo: 'Kwid' }),
  cli({ nome: 'Rodrigo Jabur', telefone: '(21) 97711-2233', marca: 'Jeep', modelo: 'Compass' }),
  cli({ nome: 'Leonardo', telefone: '(21) 96622-8890', marca: 'Chevrolet', modelo: 'Agile' }),
  cli({ nome: 'Pedro', telefone: '(21) 99887-6655', marca: 'Fiat', modelo: 'Mobi' }),
]

export const MARCAS = ['Todas', ...Array.from(new Set(CLIENTES.filter((c) => c.marca).map((c) => c.marca))).sort()]

let userIdCounter = 1
export const USUARIOS = [
  { id: userIdCounter++, nome: 'renato.cazzoletti', email: 'renato.cazzoletti@protekto.com', perfil: 'USER', ativo: true },
  { id: userIdCounter++, nome: 'aline.menezes', email: 'aline.menezes@protekto.com', perfil: 'USER', ativo: true },
  { id: userIdCounter++, nome: 'diogo.aniceto', email: 'diogo.aniceto@protekto.com', perfil: 'USER', ativo: true },
  { id: userIdCounter++, nome: 'Felipe Costa', email: 'felipe.costa@protekto.com', perfil: 'ADM', ativo: true, isSelf: true },
  { id: userIdCounter++, nome: 'Teste User', email: 'teste.user@protekto.com', perfil: 'USER', ativo: true },
  { id: userIdCounter++, nome: 'Marcos Batuli', email: 'marcos.batuli@protekto.com', perfil: 'ADM', ativo: true },
  { id: userIdCounter++, nome: 'Bruno Kobi', email: 'bruno.kobi@protekto.com', perfil: 'ADM', ativo: true },
]

let svcIdCounter = 1
function svc(entry) {
  return { id: svcIdCounter++, ...entry }
}

export const SERVICES = {
  embelezamento: [
    svc({ cliente: 'Cheila', telefone: '(21) 99114-8384', marca: 'Fiat', modelo: 'Palio', data: '21/08/2026', hora: '14H00', valor: 69 }),
    svc({ cliente: 'Denise', telefone: '(21) 99192-9746', marca: 'Fiat', modelo: 'palio', data: '21/08/2026', hora: '13H00', valor: 69 }),
    svc({ cliente: 'FABIANO', telefone: '(21) 98111-2136', marca: 'Toyota', modelo: 'SW4', data: '21/08/2026', hora: '15H00', valor: 69 }),
    svc({ cliente: 'Fred', telefone: '(21) 96710-9931', marca: 'Fiat', modelo: 'Palio', data: '21/08/2026', hora: '16H00', entrega: '21/08/2026', valor: 69 }),
    svc({ cliente: 'Mariana', telefone: '(21) 99746-1518', marca: 'Jac', modelo: 'chines', data: '21/08/2026', hora: '08H00', entrega: '21/08/2026', valor: 480 }),
    svc({ cliente: 'FABIANO', telefone: '(21) 98111-2136', marca: 'Toyota', modelo: 'SW4', data: '20/08/2026', hora: '11H00', entrega: '20/08/2026', valor: 69 }),
    svc({ cliente: 'Camila', telefone: '(21) 99874-8444', marca: 'Volkswagen', modelo: 'Tiguan', data: '20/08/2026', hora: '08H00', entrega: '20/08/2026', valor: 69 }),
    svc({ cliente: 'Juliana', telefone: '(21) 99930-4440', marca: 'Fiat', modelo: 'Argo', data: '20/08/2026', hora: '10H00', entrega: '20/08/2026', valor: 69 }),
    svc({ cliente: 'Gabriel', telefone: '(21) 98227-2622', marca: 'Fiat', modelo: 'Uno', data: '20/08/2026', hora: '14H00', entrega: '20/08/2026', valor: 69 }),
    svc({ cliente: 'Rafael', telefone: '(21) 99936-2059', marca: 'BMW', modelo: 'X5', data: '20/08/2026', hora: '15H00', entrega: '20/08/2026', valor: 150 }),
    svc({ cliente: 'Yasmin', telefone: '(21) 98199-6884', marca: 'Honda', modelo: 'HRV', data: '19/08/2026', hora: '09H00', entrega: '19/08/2026', valor: 69 }),
    svc({ cliente: 'Maria', telefone: '(21) 98830-3500', marca: 'Fiat', modelo: 'Palio', data: '19/08/2026', hora: '11H00', entrega: '19/08/2026', valor: 69 }),
    svc({ cliente: 'Penelope', telefone: '(21) 98027-3555', marca: 'Fiat', modelo: 'Fiat', data: '18/08/2026', hora: '08H00', entrega: '18/08/2026', valor: 69 }),
    svc({ cliente: 'Rodrigo Jabur', telefone: '(21) 97711-2233', marca: 'Jeep', modelo: 'Compass', data: '18/08/2026', hora: '13H00', entrega: '18/08/2026', valor: 69 }),
    svc({ cliente: 'Anderson', telefone: '(21) 98112-9900', marca: 'Volkswagen', modelo: 'Nivus', data: '17/08/2026', hora: '10H00', entrega: '17/08/2026', valor: 69 }),
  ],
  lanternagem: [
    svc({ cliente: 'Fabrício', marca: 'Volvo', modelo: 'XC40', entrada: '07/07/2026', saida: '07/07/2026', dias: 0, responsavel: 'Thiago (Insufilm)', status: 'Concluída' }),
    svc({ cliente: 'FELIPE', marca: 'Jeep', modelo: 'Compass', entrada: '26/01/2026', saida: '30/01/2026', dias: 4, responsavel: 'Wilson', status: 'Concluída', valor: 3780, custo: 2180 }),
    svc({ cliente: 'IVAN/REGINA', marca: 'Hyundai', modelo: 'Creta 1.6 2018', entrada: '12/01/2026', responsavel: 'Wilson', status: 'Concluída', valor: 5680, custo: 3780 }),
    svc({ cliente: 'GUTTEMBERG', marca: 'Jeep', modelo: 'Commander 2023', entrada: '12/01/2026', responsavel: 'Wilson', status: 'Concluída', valor: 5260, custo: 3310 }),
    svc({ cliente: 'SERGIO', marca: 'Nissan', modelo: 'March 2016', entrada: '13/01/2026', responsavel: 'Wilson', status: 'Concluída', valor: 2930, custo: 1540 }),
    svc({ cliente: 'FERNANDO', marca: 'Chevrolet', modelo: 'Tracker', entrada: '13/01/2026', responsavel: 'Wilson', status: 'Concluída', valor: 4748, custo: 3098 }),
    svc({ cliente: 'MARCELO', marca: 'Chevrolet', modelo: 'Onix 2023/2023', entrada: '08/12/2025', saida: '09/01/2026', dias: 32, responsavel: 'Wilson', status: 'Concluída', valor: 14400, custo: 5740 }),
    svc({ cliente: 'ARDUINI', marca: 'Toyota', modelo: 'SW4 2023/2023', entrada: '09/02/2026', responsavel: 'Wilson', status: 'Concluída', valor: 3600, custo: 2100 }),
    svc({ cliente: 'FELIPE', marca: 'Citroen', modelo: 'C3', entrada: '09/02/2026', responsavel: 'Wilson', status: 'Concluída', valor: 3780, custo: 2180 }),
    svc({ cliente: 'Rafael', marca: 'BMW', modelo: 'X5', entrada: '15/02/2026', responsavel: 'Wilson', status: 'Em andamento', valor: 8900, custo: 5200 }),
    svc({ cliente: 'Camila', marca: 'Volkswagen', modelo: 'Tiguan', entrada: '18/02/2026', responsavel: 'Thiago (Insufilm)', status: 'Pend. Pagamento', valor: 2400, custo: 1300 }),
    svc({ cliente: 'Yasmin', marca: 'Honda', modelo: 'HRV', entrada: '20/02/2026', responsavel: 'Wilson', status: 'Em andamento', valor: 1950, custo: 980 }),
    svc({ cliente: 'Maria', marca: 'Fiat', modelo: 'Palio', entrada: '21/02/2026', responsavel: 'Wilson', status: 'Concluída', valor: 1180, custo: 520 }),
  ],
  mecanica: [
    svc({ cliente: 'Felipe', marca: 'Chevrolet', modelo: 'Tracker 2023', entrada: '03/08/2026', status: 'Em andamento', valor: 0 }),
    svc({ cliente: 'Fabrício', marca: 'Volvo', modelo: 'XC40', entrada: '08/07/2026', saida: '07/07/2026', dias: -1, status: 'Concluída', valor: 2500 }),
    svc({ cliente: 'Anderson', marca: 'Volkwagen', modelo: 'Nivus', entrada: '30/06/2026', status: 'Concluída', valor: 695.9 }),
    svc({ cliente: 'FLAVIA (FILHA DO SR.º NILO)', marca: 'Renault', modelo: 'Kwid 2020/2020', entrada: '05/01/2026', saida: '07/01/2026', dias: 2, status: 'Concluída', valor: 2231.76, custo: 2358.27 }),
    svc({ cliente: 'RODRIGO JABUR (BARRA SQUARE)', marca: 'Jeep', modelo: 'Compass 2019/2019', entrada: '05/01/2026', saida: '08/01/2026', dias: 3, status: 'Concluída', valor: 3016.72, custo: 2044.5 }),
    svc({ cliente: 'LEONARDO', marca: 'Chevrolet', modelo: 'Agile 2013', entrada: '06/01/2026', status: 'Concluída', valor: 550, custo: 300 }),
    svc({ cliente: 'PEDRO', marca: 'Fiat', modelo: 'Mobi 2013', entrada: '22/12/2025', saida: '09/01/2026', dias: 18, status: 'Concluída', valor: 5161.55, custo: 3631.65 }),
    svc({ cliente: 'FERNANDO', marca: 'Toyota', modelo: 'Corolla 2016/17', entrada: '13/01/2026', saida: '14/01/2026', dias: 1, status: 'Concluída', valor: 3401.65, custo: 1547.25 }),
    svc({ cliente: 'GUILHERME', marca: 'Hyunday', modelo: 'Tucson 2012', entrada: '14/01/2026', saida: '16/01/2026', dias: 2, status: 'Concluída', valor: 1440, custo: 640 }),
    svc({ cliente: 'FERNANDA', marca: 'Hyunday', modelo: 'HB 20', entrada: '19/01/2026', saida: '21/01/2026', dias: 2, status: 'Concluída', valor: 1080.1, custo: 1280.2 }),
    svc({ cliente: 'Marcelo', marca: 'Jeep', modelo: 'Compass', entrada: '22/08/2026', status: 'Em andamento', valor: 890, custo: 340 }),
    svc({ cliente: 'Rodrigo Ferreira', marca: 'Volkswagen', modelo: 'Tiguan', entrada: '21/08/2026', status: 'Em andamento', valor: 320, custo: 180 }),
    svc({ cliente: 'Patrícia Lima', marca: 'Toyota', modelo: 'Corolla Cross', entrada: '20/08/2026', saida: '20/08/2026', dias: 0, status: 'Concluída', valor: 2450, custo: 980 }),
    svc({ cliente: 'André Souza', marca: 'Hyundai', modelo: 'Creta', entrada: '19/08/2026', status: 'Pend. Pagamento', valor: 680, custo: 290 }),
    svc({ cliente: 'Camila Duarte', marca: 'Toyota', modelo: 'Corolla', entrada: '17/08/2026', status: 'Concluída', valor: 5200, custo: 1750 }),
  ],
}
