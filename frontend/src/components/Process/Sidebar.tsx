import { Box, Image, SimpleGrid, Text } from '@chakra-ui/react'
import { useNodes, useReactFlow, XYPosition } from '@xyflow/react'
import { useCallback, useState } from 'react'
import { DEVICE_CATALOG, type DeviceDef } from './Devices/catalog'
import { OnDropAction, useDnD, useDnDPosition } from './useDnd'

export function Sidebar () {
  const { onDragStart, isDragging } = useDnD()
  const [dragging, setDragging] = useState<DeviceDef | null>(null)

  const { setNodes } = useReactFlow()
  const nodes = useNodes()

  function getId (type: string) {
    const existingIds = new Set(nodes.map(n => n.id))
    let index = 1
    let newId = `${type}_${index}`
    while (existingIds.has(newId)) {
      index++
      newId = `${type}_${index}`
    }
    return newId
  }

  const createAddNewNode = useCallback(
    (def: DeviceDef): OnDropAction => {
      return ({ position }: { position: XYPosition }) => {
        const id = getId(def.type)
        const newNode = {
          id,
          type: def.type,
          position,
          data: { label: id, tag: id, ...def.defaultData },
        }
        setNodes(nds => nds.concat(newNode))
        setDragging(null)
      }
    },
    [setNodes, nodes]
  )

  return (
    <>
      {isDragging && <DragGhost device={dragging} />}

      <Box p={2} pointerEvents='auto' userSelect='none'>
        <Text fontWeight='bold' mb={3}>
          Arraste para o diagrama
        </Text>

        <SimpleGrid columns={2} gap={3}>
          {DEVICE_CATALOG.map(def => (
            <Box
              key={def.type}
              border='1px solid'
              borderColor='gray.200'
              borderRadius='md'
              p={2}
              cursor='grab'
              textAlign='center'
              pointerEvents='auto'
              _hover={{ borderColor: 'blue.300', bg: 'blue.50' }}
              onPointerDown={event => {
                setDragging(def)
                onDragStart(event, createAddNewNode(def))
              }}
            >
              <Image
                src={def.image}
                alt={def.label}
                w='60px'
                h='60px'
                objectFit='contain'
                mx='auto'
                mb={1}
              />
              <Text fontSize='xs' color='gray.700'>
                {def.label}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </>
  )
}

export function DragGhost ({ device }: { device: DeviceDef | null }) {
  const { position } = useDnDPosition()
  if (!position) return null

  return (
    <Box
      position='fixed'
      top={0}
      left={0}
      zIndex={9999}
      bg='white'
      border='1px solid #888'
      borderRadius='md'
      p={1}
      transform={`translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`}
      pointerEvents='none'
      textAlign='center'
    >
      {device && (
        <Image src={device.image} alt={device.label} boxSize='48px' />
      )}
    </Box>
  )
}
