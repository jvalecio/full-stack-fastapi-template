import {
  Handle,
  Position,
  NodeProps,
  useUpdateNodeInternals
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

  /** Label externa */
  tag?: string
}

export default function DeviceBase(props: NodeProps & { base: DeviceBaseProps }) {
  const { id, base } = props
  const { width = '120px', height = '120px' } = base

  const updateNodeInternals = useUpdateNodeInternals()
  const [rotation, setRotation] = useState(0)
  const [draggingLabel, setDraggingLabel] = useState(false)

  // rotacionar enquanto arrasta label + pressionar Espaço
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return
      if (!draggingLabel) return

      setRotation(r => r - 90)
      updateNodeInternals(id)
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [draggingLabel])

  return (
    <>
      <Box
        position="relative"
        width={width}
        height={height}
        style={{ transform: `rotate(${rotation}deg)` }}
        onClick={base.onClick}
        cursor={base.onClick ? "pointer" : "default"}

        onPointerDown={() => setDraggingLabel(true)}
        onPointerUp={() => setDraggingLabel(false)}
      >
        {/* UNDERLAY */}
        {base.underlay}

        {/* GRAFICO PRINCIPAL */}
        {base.graphic}

        {/* OVERLAY */}
        {base.overlay}

        {/* HANDLES */}
        {base.handles?.map((h, i) => (
          <Handle
            key={i}
            type={h.type}
            position={h.position}
            id={h.id}
            //style={{ background: '#555' }}
          />
        ))}
      </Box>

      {/* LABEL ARRASTÁVEL */}
      {props.id && (
        <DragRotateLabel
          label={props.id}
        />
      )}
    </>
  )
}
