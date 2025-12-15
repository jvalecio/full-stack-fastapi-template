import {
  Handle,
  Position,
  NodeProps,
  useUpdateNodeInternals,
  useKeyPress
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
  const { id, base, selected } = props
  const { width = '120px', height = '120px' } = base

  const updateNodeInternals = useUpdateNodeInternals()
  const [rotation, setRotation] = useState(props.data.rotation)
  const [handlePosition, setHandlePosition] = useState<Position[]>([
    Position.Left,
    Position.Right
  ])

  //useEffect(() => {
  //  setRotation(props.data.rotation)
  //}, [props.data])

    // ✅ hook correto
  const spacePressed = useKeyPress(' ')

  // 🔄 rotaciona quando Space + node selecionado
  useEffect(() => {
    if (!spacePressed) return
    if (!selected) return

    setRotation((prev) => (prev + 90) % 360)
  }, [spacePressed, selected])

  // 🔧 atualiza handles + edges
  useEffect(() => {
    let newPosition: Position[] = [Position.Left, Position.Right]

    switch (rotation) {
      case 90:
        newPosition = [Position.Bottom, Position.Top]
        break
      case 180:
        newPosition = [Position.Right, Position.Left]
        break
      case 270:
        newPosition = [Position.Top, Position.Bottom]
        break
    }

    setHandlePosition(newPosition)

    requestAnimationFrame(() => {
      updateNodeInternals(id)
    })
  }, [rotation, id])

  return (
    <>
      <Box
        position='relative'
        width={width}
        height={height}
        style={{ transform: `rotate(${rotation}deg)` }}
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
      {props.id && <DragRotateLabel label={props.id} />}
    </>
  )
}
