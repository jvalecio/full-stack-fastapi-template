import {
  Handle,
  Position,
  NodeProps,
  useKeyPress,
  useReactFlow,
  useUpdateNodeInternals
} from '@xyflow/react'

import { Box, IconButton } from '@chakra-ui/react'
import { useState, useEffect, useMemo, type CSSProperties } from 'react'
import { FaCog } from 'react-icons/fa'
import DragRotateLabel from './DragRotateLabel'
import { useDiagramContext } from '../DiagramContext'

function originalHandleStyle(position: Position): CSSProperties {
  const base: CSSProperties = { right: 'auto', bottom: 'auto', transform: 'translate(-50%, -50%)' }
  switch (position) {
    case Position.Left:   return { ...base, left: 0,     top: '50%' }
    case Position.Top:    return { ...base, left: '50%', top: 0 }
    case Position.Right:  return { ...base, left: '100%', top: '50%' }
    case Position.Bottom: return { ...base, left: '50%', top: '100%' }
    default:              return base
  }
}

export interface DeviceBaseProps {
  graphic: React.ReactNode
  overlay?: React.ReactNode
  underlay?: React.ReactNode
  drag_label?: boolean
  width?: string | number
  height?: string | number
  onClick?: () => void
  handles?: Array<{
    type: 'source' | 'target'
    position: Position
    id?: string
  }>
}

export default function DeviceBase(
  props: NodeProps & { base: DeviceBaseProps }
) {
  const { id, base } = props
  const { width = '120px', height = '120px' } = base

  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const [dragging, setDragging] = useState(false)
  const { locked, mode, setEditingNodeId } = useDiagramContext()
  const interactive = mode === 'run' && !locked
  const isEdit = mode === 'edit'

  const rotationArray = [
    Position.Left,
    Position.Top,
    Position.Right,
    Position.Bottom,
  ]

  const handleBasePosition = useMemo<number[]>(
    () => base.handles?.map(h => rotationArray.indexOf(h.position)) ?? [],
    [base.handles, rotationArray]
  )

  const spacePressed = useKeyPress(' ')

  function getPosition(): number[] {
    const r = (props.data.rotation as number) ?? 0
    const rotationSteps = (Number.isNaN(r) ? 0 : r) / 90
    return handleBasePosition.map(v => (v + rotationSteps) % 4)
  }

  useEffect(() => {
    if (!spacePressed) return
    if (!dragging) return
    updateNodeData(id, {
      rotation: (((props.data.rotation as number) ?? 0) + 90) % 360,
    })
  }, [spacePressed])

  useEffect(() => {
    updateNodeInternals(id)
  }, [props.data.rotation])

  return (
    <Box position='relative' overflow='visible'>
      {/* Device rotacionável */}
      <Box
        position='relative'
        overflow='visible'
        width={width}
        height={height}
        style={{ transform: `rotate(${props.data.rotation}deg)` }}
        onDragStart={e => e.preventDefault()}
        onPointerDown={() => {
          setDragging(true)
          const up = () => {
            setDragging(false)
            window.removeEventListener('pointerup', up)
          }
          window.addEventListener('pointerup', up)
        }}
        onClick={interactive ? base.onClick : undefined}
        cursor={interactive && base.onClick ? 'pointer' : 'default'}
      >
        {base.underlay}
        {base.graphic}
        {base.overlay}

        {base.handles?.map((h, i) => {
          const handleId = h.id ?? `${id}-h${i}`
          return (
            <Handle
              key={handleId}
              type='source'
              position={rotationArray[getPosition()[i]]}
              id={handleId}
              style={originalHandleStyle(h.position)}
            />
          )
        })}
      </Box>

      {/* Botão de edição de propriedades — só no modo edição */}
      {isEdit && (
        <Box
          position='absolute'
          top='-10px'
          right='-10px'
          zIndex={100}
          onPointerDown={e => e.stopPropagation()}
          onClick={e => {
            e.stopPropagation()
            setEditingNodeId(id)
          }}
        >
          <IconButton
            size='2xs'
            variant='ghost'
            rounded='full'
            aria-label='Editar propriedades'
            color='blue.500'
          >
            <FaCog />
          </IconButton>
        </Box>
      )}

      {props.id && base.drag_label && (
        <DragRotateLabel
          label={(props.data.tag as string) || props.id}
          nodeId={props.id}
          initialOffset={props.data.labelOffset as { x: number; y: number } | undefined}
        />
      )}
    </Box>
  )
}
