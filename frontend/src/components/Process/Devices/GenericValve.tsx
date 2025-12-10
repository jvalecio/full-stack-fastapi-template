import { Handle, Position, NodeProps, Node } from '@xyflow/react'
import { Box, Image, Stack, Text } from '@chakra-ui/react'
import { Tooltip } from '@/components/ui/tooltip'
import { useEffect, useState } from 'react'

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
  const [textPos, setTextPos] = useState({ x: 0, y: 0 })
  const [textRotation, setTextRotation] = useState(0)
  const [nodeRotation, setNodeRotation] = useState(0)
  const [isDraggingText, setIsDraggingText] = useState(false)
  const [isDraggingNode, setIsDraggingNode] = useState(false)

  
  // 🔄 ROTACIONA O TEXTO AO APERTAR ESPAÇO
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return
      if (!isDraggingText) return // só gira quando estiver arrastando o texto

      setTextRotation(r => r - 90)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDraggingText])

  // 🔄 ROTACIONA O NODE AO APERTAR ESPAÇO
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return
      if (!isDraggingNode) return // só gira quando estiver arrastando o texto

      setNodeRotation(r => r - 90)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDraggingNode])

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
        position='relative'
        w='149px'
        h='150px'
        m={0}
        p={0}
        //backgroundColor={'blue'}
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
        <Box>
          {data.actuator_prop && (
            <Tooltip content={data.actuator_prop || DEFAULT_IDENT}>
              <Image
                position='absolute'
                mt='50%'
                ml='50%'
                transform='translateY(-100%) translateX(-50%)'
                src={
                  data.actuator_prop === 'manual'
                    ? `${IMG_ROOT}/manual_prop.svg`
                    : data.actuator_prop === 'pneumatic'
                    ? `${IMG_ROOT}/pneumatic_prop.svg`
                    : `${IMG_ROOT}/electric_prop.svg`
                }
              />
            </Tooltip>
          )}

          <Image
            loading='eager'
            position='absolute'
            mt='50%'
            ml='0%'
            transform='translateY(-50%)'
            src={
              state === 'open'
                ? `${IMG_ROOT}/valve_2w_generic_open.svg`
                : `${IMG_ROOT}/valve_2w_generic_closed.svg`
            }
            alt={data.tooltip || DEFAULT_IDENT}
          />
        </Box>
        <Handle type='source' position={Position.Left} />
        <Handle type='target' position={Position.Right} />
      </Box>

      {/* TEXTO ARRASTÁVEL + ROTACIONÁVEL */}
      <Text
        className='nodrag nopan'
        position='relative'
        cursor='grab'
        fontSize='xl'
        onPointerDown={e => {
          e.stopPropagation()
          e.preventDefault()

          setIsDraggingText(true)

          const startMouseX = e.clientX
          const startMouseY = e.clientY

          const startTextX = textPos.x
          const startTextY = textPos.y

          const move = (ev: PointerEvent) => {
            ev.stopPropagation()
            ev.preventDefault()

            const deltaX = ev.clientX - startMouseX
            const deltaY = ev.clientY - startMouseY

            setTextPos({
              x: startTextX + deltaX,
              y: startTextY + deltaY
            })
          }

          const up = (ev: PointerEvent) => {
            ev.stopPropagation()
            ev.preventDefault()
            setIsDraggingText(false)

            window.removeEventListener('pointermove', move)
            window.removeEventListener('pointerup', up)
          }

          window.addEventListener('pointermove', move)
          window.addEventListener('pointerup', up)
        }}
        style={{
          transform: `translate(${textPos.x}px, ${textPos.y}px) rotate(${textRotation}deg)`,
          transformOrigin: 'center'
        }}
      >
        {data.tag}
      </Text>
    </>
  )
}
