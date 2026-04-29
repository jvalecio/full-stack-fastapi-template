import { type DeviceConnection, type LiveValues, DEVICE_SIGNAL_SCHEMAS } from './signals'

export type { DeviceConnection, LiveValues }

export interface DeviceDef {
  type: string
  label: string
  image: string
  defaultData: Record<string, unknown>
}

export const DEVICE_CATALOG: DeviceDef[] = [
  {
    type: 'valve',
    label: 'Válvula 2V',
    image: '/assets/images/devices/valve_2w_generic_closed.svg',
    defaultData: { state: 'open', actuator_prop: 'manual', rotation: 0 },
  },
  {
    type: 'valve3w',
    label: 'Válvula 3V',
    image: '/assets/images/devices/valve_3w_s1.svg',
    defaultData: { state: 'open', actuator_prop: 'manual', rotation: 0 },
  },
  {
    type: 'pump',
    label: 'Bomba',
    image: '/assets/images/devices/pump.svg',
    defaultData: { rotation: 0 },
  },
  {
    type: 'tank',
    label: 'Tanque',
    image: '/assets/images/devices/tank.svg',
    defaultData: { rotation: 0 },
  },
  {
    type: 'sensor',
    label: 'Sensor',
    image: '/assets/images/devices/pump.svg',
    defaultData: { rotation: 0 },
  },
]

/**
 * Retorna os sinais disponíveis para um tipo de device.
 * Usado pelo painel de configuração do nó para sugerir os campos de binding.
 */
export function getSignalSchemas (deviceType: string) {
  return DEVICE_SIGNAL_SCHEMAS[deviceType] ?? {}
}
