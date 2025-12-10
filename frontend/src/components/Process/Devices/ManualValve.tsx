import { Tooltip } from "@/components/ui/tooltip"
import { Box, Image } from '@chakra-ui/react'
import {
  Handle,
  Node,
  NodeProps,
  Position
} from '@xyflow/react'
const IMG_ROOT = "./public/assets/images/devices"

export type ValveNodeType = Node<
  {
    label?: string
    state?: 'open' | 'closed'
    onToggle?: (id: string, state: 'open' | 'closed') => void
  },
  'valve'
>

function ValveNode(props: NodeProps<ValveNodeType>) {
  const { id, data } = props

  const handleClick = () => {
    const newState = data.state === 'open' ? 'closed' : 'open'
    data.onToggle?.(id, newState)
  }

  return (
    
    <Box
      position='relative'
      w='100px'
      h='90px'
      display='flex'
      alignItems='center'
      justifyContent='center'
      cursor='pointer'
      onClick={handleClick}
    >
  
    <Tooltip content="Generic Valve" openDelay={100}>
      <Image
        loading='eager'
        src={data.state ? `${IMG_ROOT}/valve_2w_generic_manual_open.svg` : `${IMG_ROOT}/valve_2w_generic_manual_closed.svg`}
        w="100px"
        //h="40px"
        alt={data?.label || 'Valve'}
        mb={4}
        />
      </Tooltip>
      <Handle type='source'  position={Position.Right} />
      <Handle type='target'  position={Position.Left} />
    </Box>
  )
}

export default ValveNode