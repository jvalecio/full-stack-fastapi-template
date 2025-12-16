import {
  Handle,
  Position,
  NodeProps,
  useUpdateNodeInternals,
  useKeyPress,
  useReactFlow
} from '@xyflow/react'

import { Box } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import DragRotateLabel from './DragRotateLabel'

export interface DeviceBaseProps {
  /** Elemento gráfico principal (SVG / IMG / JSX) */
  graphic: React.ReactNode

  /** Conteúdos opcionais acima/abaixo */
  overlay?: React.ReactNode
  underlay?: React.ReactNode

  drag_label?: boolean

  /** Dimensões */
  width?: string | number
  height?: string | number

  /** Se houver ação de click (toggle etc.) */
  onClick?: () => void

  /** Handles customizados */
  handles?: Array<{
    type: 'source' | 'target'
    position: Position
    id?: string
  }>
}

export default function DeviceBase (
  props: NodeProps & { base: DeviceBaseProps }
) {
  const { id, base } = props
  const { width = '120px', height = '120px' } = base

  const updateNodeInternals = useUpdateNodeInternals()
  const {updateNodeData} = useReactFlow()

  const [dragging, setDragging] = useState(false)

  const [handlePosition, setHandlePosition] = useState<Position[]>(getPosition())

  //useEffect(() => {
  //  setRotation(props.data.rotation)
  //}, [props.data])

  // ✅ hook correto
  const spacePressed = useKeyPress(' ')

  function getPosition(){
    let newPosition: Position[] = [Position.Bottom, Position.Top]

    switch (props.data.rotation) {
      case 0:
        newPosition = [Position.Left, Position.Right]
        break;
      case 90:
        newPosition = [Position.Bottom, Position.Top]
        break
      case 180:
        newPosition = [Position.Right, Position.Left]
        break
      case 270:
        newPosition = [Position.Top, Position.Bottom]
        break
      default:
        props.data.rotation = 0
        newPosition = [Position.Left, Position.Right]
        break;
    }
    return newPosition
  }

  // 🔄 rotaciona quando Space + node selecionado
  useEffect(() => {
    if (!spacePressed) return
    if (!dragging) return

    updateNodeData(id, {rotation: (((props.data.rotation as number) + 90) % 360)})

  }, [spacePressed])

  // 🔧 atualiza handles + edges
  useEffect(() => {
  
    setHandlePosition(getPosition())

    requestAnimationFrame(() => {
      updateNodeInternals(id)
    })
  }, [props.data.rotation])

  return (
    <>
      <Box
        position='relative'
        width={width}
        height={height}
        style={{ transform: `rotate(${props.data.rotation}deg)` }}
        onPointerDown={e => {
          setDragging(true)

          const up = () => {
            setDragging(false)
            window.removeEventListener('pointerup', up)
          }
          window.addEventListener('pointerup', up)
        }}
        onClick={base.onClick}
        cursor={base.onClick ? 'pointer' : 'default'}
      >
        {/* UNDERLAY */}
        {base.underlay}

        {/* GRAFICO PRINCIPAL */}
        {base.graphic}

        {/* OVERLAY */}
        {base.overlay}
      </Box>

      {/* HANDLES */}
      {base.handles?.map((h, i) => (
        <Handle
          key={i}
          type={h.type}
          position={handlePosition[i]}
          id={h.id}
          //style={{ background: '#555' }}
        />
      ))}

      {/* LABEL ARRASTÁVEL */}
      {props.id && base.drag_label && <DragRotateLabel label={props.id} />}
    </>
  )
}
