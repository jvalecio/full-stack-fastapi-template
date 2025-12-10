import { Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useReactFlow } from '@xyflow/react'

const snap = (v: number, grid = 10) => Math.round(v / grid) * grid

export default function ValveTextLabel({ label }: { label: string }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [dragging, setDragging] = useState(false)

  const rf = useReactFlow()
  const gridSize = 10

  // Rotaciona com espaço
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.code === 'Space' && dragging) setRotation(r => r - 90)
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [dragging])

  return (
    <Text
      position="absolute"
      left="50%"
      cursor="grab"
      fontSize="xl"
      className="nodrag nopan"
      onPointerDown={e => {
        e.stopPropagation()
        e.preventDefault()

        setDragging(true)

        const startFlowPos = rf.screenToFlowPosition({
          x: e.clientX,
          y: e.clientY
        })

        const startX = pos.x
        const startY = pos.y

        const move = (ev: PointerEvent) => {
          const flowPos = rf.screenToFlowPosition({
            x: ev.clientX,
            y: ev.clientY
          })

          setPos({
            x: startX + (flowPos.x - startFlowPos.x),
            y: startY + (flowPos.y - startFlowPos.y)
          })
        }

        const up = () => {
          setDragging(false)

          // Snap to grid
          setPos(p => ({
            x: snap(p.x, gridSize),
            y: snap(p.y, gridSize)
          }))

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
        transformOrigin: 'center'
      }}
    >
      {label}
    </Text>
  )
}
