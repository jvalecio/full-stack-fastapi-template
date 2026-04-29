import { Text } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { useReactFlow } from '@xyflow/react'
import { useDiagramContext } from '../DiagramContext'
import { GRID } from './constants'

const LABEL_GRID = GRID / 2
const snap = (v: number) => Math.round(v / LABEL_GRID) * LABEL_GRID

interface Props {
  label: string
  nodeId: string
  initialOffset?: { x: number; y: number }
}

export default function DragRotateLabel({ label, nodeId, initialOffset }: Props) {
  const [pos, setPos] = useState<{ x: number; y: number }>(initialOffset ?? { x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  const rf = useReactFlow()
  const { mode } = useDiagramContext()
  const isEdit = mode === 'edit'

  // Sync when node data is externally restored (e.g. localStorage restore)
  useEffect(() => {
    if (!dragging) setPos(initialOffset ?? { x: 0, y: 0 })
  }, [initialOffset?.x, initialOffset?.y])

  // Rotate label with Space while dragging
  const rotationRef = useRef(0)
  const [rotation, setRotation] = useState(0)
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.code === 'Space' && dragging) {
        rotationRef.current = (rotationRef.current - 90) % 360
        setRotation(rotationRef.current)
      }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [dragging])

  return (
    <Text
      position="absolute"
      left="50%"
      cursor={isEdit ? 'grab' : 'default'}
      fontSize="xl"
      className="nodrag nopan"
      onPointerDown={e => {
        if (!isEdit) return
        e.stopPropagation()
        e.preventDefault()

        setDragging(true)

        const startClientX = e.clientX
        const startClientY = e.clientY
        const startX = pos.x
        const startY = pos.y

        // currentPos is shared between move and up closures so up() sees the final value
        let currentPos = { x: startX, y: startY }

        const move = (ev: PointerEvent) => {
          const { zoom } = rf.getViewport()
          currentPos = {
            x: snap(startX + (ev.clientX - startClientX) / zoom),
            y: snap(startY + (ev.clientY - startClientY) / zoom),
          }
          setPos(currentPos)
        }

        const up = () => {
          setDragging(false)
          rf.updateNodeData(nodeId, { labelOffset: currentPos })
          window.removeEventListener('pointermove', move)
          window.removeEventListener('pointerup', up)
        }

        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up)
      }}
      style={{
        transform: `
          translateX(-50%)
          translate(${pos.x}px, ${pos.y}px)
          rotate(${rotation}deg)
        `,
        transformOrigin: 'center',
      }}
    >
      {label}
    </Text>
  )
}
