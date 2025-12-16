import { Image } from '@chakra-ui/react'
import { NodeProps, Position } from '@xyflow/react'
import DeviceBase, { DeviceBaseProps } from './DeviceBase'
import { useState } from 'react'

export type ValveNodeData = {
  tooltip?: string
  state?: 'open' | 'closed'
  mechanism?: 'ball' | 'neddle'
  actuator_prop?: 'manual' | 'pneumatic' | 'electric'
  rotation?: number
}

const DEFAULT_VALVE_DATA: ValveNodeData = {
  tooltip: 'Generic Valve',
  state: 'open',
  mechanism: 'neddle',
  actuator_prop: 'manual',
  rotation: 0
}

export default function Valve3WNode (
  props: NodeProps & { base: DeviceBaseProps }
) {
  const data = { ...DEFAULT_VALVE_DATA, ...props.data }
  const [state, setState] = useState<'open' | 'closed'>(data.state ?? 'closed')
  const [loading, setLoading] = useState(false)

  // 🔹 API toggle
  const toggleValveHook = async () => {
    const res = await fetch(
      `http://localhost:8000/api/v1/devices/valve/${props.id}/toggle`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }
    )

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.detail || 'Erro ao comunicar com backend')
    }

    return await res.json()
  }

  const handleClick = async () => {
    if (loading) return
    setLoading(true)

    try {
      const backendResponse = await toggleValveHook()
      const newState = backendResponse.new_state as 'open' | 'closed'
      setState(newState)
    } catch (err) {
      console.error(err)
      setState(prev => (prev === 'open' ? 'closed' : 'open'))
    }

    setLoading(false)
  }

  return (
    <DeviceBase
      {...props}
      base={{
        width: '100px',
        height: '100px',
        drag_label: true,
        graphic: (
          <Image
            src={
              state === 'closed'
                ? `./assets/images/devices/valve_3w_s1.svg`
                : `./assets/images/devices/valve_3w_s1.svg`
            }
            position='absolute'
            top='50%'
            left='50%'
            transform='translate(-50%, -50%)'
            width='100%'
          />
        ),

        handles: [
            { type: 'target', position: Position.Left, id:'a' },
            { type: 'target', position: Position.Right, id:'b' },
            { type: 'source', position: Position.Bottom, id: 'c' },
        ],

        onClick: () => {
          console.log('Valve clicked:', props.id)
          handleClick()
        }
      }}
    />
  )
}
