import {
  Handle,
  Position,
  NodeProps,
  Node,
  useUpdateNodeInternals
} from '@xyflow/react'
import { Box, Image } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import DragRotateLabel from '@/components/Process/Devices/DragRotateLabel'

const IMG_ROOT = './assets/images/devices'
const DEFAULT_IDENT = 'Generic Valve'

export type ValveDataType = Node<
  {
    tag?: string
    tooltip?: string
    state?: 'open' | 'closed'
    mechanism?: 'ball' | 'neddle'
    actuator_prop?: 'manual' | 'pneumatic' | 'electric'
    onToggle?: (id: string, state: 'open' | 'closed') => void
  },
  'valve'
>

const DEFAULT_VALVE_DATA = {
  tag: 'VALVE',
  tooltip: 'Generic Valve',
  state: 'open' as 'open' | 'closed',
  mechanism: 'neddle' as 'ball' | 'neddle',
  actuator_prop: 'manual' as 'manual' | 'pneumatic' | 'electric'
}

export default function GenericValveNode (props: NodeProps<ValveDataType>) {
  const [nodeRotation, setNodeRotation] = useState(0)

  const [isDraggingNode, setIsDraggingNode] = useState(false)
  const updateNodeInternals = useUpdateNodeInternals()

  // 🔄 ROTACIONA O NODE AO APERTAR ESPAÇO
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return
      if (!isDraggingNode) return // só gira quando estiver arrastando o texto

      setNodeRotation(r => r - 90)
      updateNodeInternals(props.id)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDraggingNode, updateNodeInternals])

  const data = {
    ...DEFAULT_VALVE_DATA,
    ...props.data
  }

  const [state, setState] = useState<string>(data?.state || 'closed')
  const [loading, setLoading] = useState(false)

  // 🔄 API toggle
  const toggleValveHook = async () => {
    const { id } = props

    const res = await fetch(
      `http://localhost:8000/api/v1/devices/valve/${id}/toggle`,
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
    <>
      <Box
        //position='relative'
        w='120px'
        h='100px'
        //backgroundColor={'grey'}
        style={{
          transform: `rotate(${nodeRotation}deg)`
        }}
        onPointerDown={e => {
          //e.stopPropagation()
          //e.preventDefault()

          setIsDraggingNode(true)

          const up = (ev: PointerEvent) => {
            //ev.stopPropagation()
            //ev.preventDefault()
            setIsDraggingNode(false)
            window.removeEventListener('pointerup', up)
          }

          window.addEventListener('pointerup', up)
        }}
        onClick={handleClick}
        cursor='pointer'
      >
        {data.actuator_prop && (
          //<Tooltip content={data.actuator_prop || DEFAULT_IDENT}>
          <Image
            position='absolute'
            width='40%'
            top='50%'
            left='50%'
            transform='translateY(-100%) translateX(-50%)'
            src={
              data.actuator_prop === 'manual'
                ? `${IMG_ROOT}/manual_prop.svg`
                : data.actuator_prop === 'pneumatic'
                ? `${IMG_ROOT}/pneumatic_prop.svg`
                : `${IMG_ROOT}/electric_prop.svg`
            }
          />
          //</Tooltip>
        )}

        <Image
          //backgroundColor={'pink'}
          //loading='eager'
          position='absolute'
          transform='translateY(-50%)'
          top='50%'
          w='100%'
          //ml='0%'
          src={
            state === 'open'
              ? `${IMG_ROOT}/valve_2w_generic_open.svg`
              : `${IMG_ROOT}/valve_2w_generic_closed.svg`
          }
          alt={data.tooltip || DEFAULT_IDENT}
        />

        <Handle type='source' position={Position.Left} />
        <Handle type='target' position={Position.Right} />
      </Box>

      {/* TEXTO ARRASTÁVEL + ROTACIONÁVEL */}
      <DragRotateLabel label={data.tag}/>
    </>
  )
}
