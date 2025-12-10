import {
  Handle,
  Position,
  NodeProps,
  Node 
} from '@xyflow/react'
import { Box, Image } from '@chakra-ui/react'
import { Tooltip } from "@/components/ui/tooltip"
const IMG_ROOT = "./assets/images/devices"

export type ValveNodeType = Node<
  {
    label?: string
    state?: 'open' | 'closed'
    onToggle?: (id: string, state: 'open' | 'closed') => void
  },
  'valve'
>

export default function TankNode(props: NodeProps<ValveNodeType>) { 
  const { id, data } = props

  const handleClick = () => {
    const newState = data.state === 'open' ? 'closed' : 'open'
    data.onToggle?.(id, newState)
  }

  return (
    
    <Box
      position='relative'
      //w='100px'
      //h='90px'
      display='flex'
      alignItems='center'
      justifyContent='center'
      cursor='pointer'
      onClick={handleClick}
    >
  
    <Tooltip content="Tank">
      <Image
        loading='eager'
        src={`${IMG_ROOT}/tank.svg`}
        //w="300px"
        //h="40px"
        alt={data?.label || 'Valve'}
        //mb={4}
        />
      </Tooltip>

      <Handle type='source' position={Position.Right} />
      <Handle type='target' position={Position.Left} />
    </Box>
  )
}
