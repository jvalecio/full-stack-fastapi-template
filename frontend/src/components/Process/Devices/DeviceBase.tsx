import {
  Handle,
  Position,
  NodeProps,
  useKeyPress,
  useReactFlow
} from '@xyflow/react'

import { Box } from '@chakra-ui/react'
import { useState, useEffect, useMemo } from 'react'
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

  const { updateNodeData } = useReactFlow()

  const [dragging, setDragging] = useState(false)

  const rotationArray = [
    Position.Left,
    Position.Top,
    Position.Right,
    Position.Bottom
  ]

  const handleBasePosition = useMemo<number[]>(
    () => base.handles?.map(h => rotationArray.indexOf(h.position)) ?? [],
    [base.handles, rotationArray]
  )

  const spacePressed = useKeyPress(' ')

  function getPosition (): number[] {
    const rotationSteps = ((props.data.rotation as number) ?? 0) / 90
    return handleBasePosition.map(v => (v + rotationSteps) % 4)
  }

  // 🔄 rotaciona quando Space + node selecionado
  useEffect(() => {
    if (!spacePressed) return
    if (!dragging) return

    updateNodeData(id, {
      rotation: ((props.data.rotation as number) + 90) % 360
    })
  }, [spacePressed])

  return (
    <>
      <Box
        position='relative'
        overflow='visible'
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
          position={rotationArray[getPosition()[i]]}
          id={h.id}
          //style={{ background: '#555' }}
        />
      ))}

      {/* LABEL ARRASTÁVEL */}
      {props.id && base.drag_label && <DragRotateLabel label={props.id} />}
    </>
  )
}
