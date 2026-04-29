// ---------------------------------------------------------------------------
// Camada de abstração de protocolo de comunicação com dispositivos de campo
// ---------------------------------------------------------------------------
// Estrutura em 3 níveis:
//   SignalDef   → o QUÊ  (grandeza semântica, independente de protocolo)
//   *Binding    → o COMO (endereçamento específico do protocolo)
//   SignalConfig → combinação de SignalDef + Binding usada por instância de nó
// ---------------------------------------------------------------------------

export type DataType = 'bool' | 'uint16' | 'int16' | 'float32' | 'uint32' | 'string'
export type Access   = 'r' | 'w' | 'rw'

/** Definição semântica de um sinal — independente de protocolo */
export interface SignalDef {
  access: Access
  data_type: DataType
  unit?: string
  scale?: number   // valor_engenharia = raw * scale + offset
  offset?: number
  description?: string
}

// ---------------------------------------------------------------------------
// Bindings específicos por protocolo
// ---------------------------------------------------------------------------

export type ModbusRegisterType =
  | 'coil'             // 0x  — bool  read/write
  | 'discrete_input'   // 1x  — bool  read-only
  | 'input_register'   // 3x  — 16bit read-only
  | 'holding_register' // 4x  — 16bit read/write

export interface ModbusBinding {
  protocol: 'modbus'
  slave_id: number
  register_type: ModbusRegisterType
  address: number           // endereço 0-based
  poll_interval_ms?: number // sobrescreve o padrão do device
}

export interface OpcuaBinding {
  protocol: 'opcua'
  endpoint: string   // ex: 'opc.tcp://192.168.0.10:4840'
  node_id: string    // ex: 'ns=2;i=1001'
  poll_interval_ms?: number
}

export interface MqttBinding {
  protocol: 'mqtt'
  broker: string       // ex: 'mqtt://192.168.0.20:1883'
  topic_read?: string  // tópico para subscribe
  topic_write?: string // tópico para publish
  json_path?: string   // ex: '$.value' para extrair campo de payload JSON
}

/** Union discriminada — adicionar novos protocolos aqui */
export type ProtocolBinding = ModbusBinding | OpcuaBinding | MqttBinding

// ---------------------------------------------------------------------------
// Configuração de sinal por instância de nó
// ---------------------------------------------------------------------------

/** Sinal com binding concreto — armazenado em node.data.connection */
export interface SignalConfig extends SignalDef {
  binding: ProtocolBinding
}

/** Config de conexão completa de um nó no diagrama */
export interface DeviceConnection {
  poll_interval_ms: number
  signals: Record<string, SignalConfig>
}

// ---------------------------------------------------------------------------
// Valores ao vivo recebidos do backend (via WebSocket)
// ---------------------------------------------------------------------------

export type LiveValues = Record<string, number | boolean | string | null>

// ---------------------------------------------------------------------------
// Schema padrão de sinais por tipo de device (sem binding — é por instância)
// ---------------------------------------------------------------------------
// Usado pelo catálogo para sugerir os sinais disponíveis ao configurar um nó.
// O usuário preenche o binding (endereço Modbus, node OPC-UA, etc.) no painel
// de configuração do nó.
// ---------------------------------------------------------------------------

export type SignalSchema = Omit<SignalDef, never> // alias para clareza

export const DEVICE_SIGNAL_SCHEMAS: Record<string, Record<string, SignalSchema>> = {
  sensor: {
    process_value: { access: 'r', data_type: 'float32', description: 'Valor de processo' },
  },

  valve: {
    feedback: { access: 'r',  data_type: 'bool',    description: 'Estado real da válvula' },
    command:  { access: 'w',  data_type: 'bool',    description: 'Comando abrir/fechar' },
  },

  valve3w: {
    feedback: { access: 'r',  data_type: 'bool',    description: 'Estado real da válvula' },
    command:  { access: 'w',  data_type: 'bool',    description: 'Comando abrir/fechar' },
  },

  pump: {
    feedback: { access: 'r', data_type: 'bool', description: 'Feedback de marcha' },
    command:  { access: 'w', data_type: 'bool', description: 'Comando ligar/desligar' },
  },

  tank: {
    level:    { access: 'r',  data_type: 'float32', unit: '%',   description: 'Nível do tanque' },
  },
}
