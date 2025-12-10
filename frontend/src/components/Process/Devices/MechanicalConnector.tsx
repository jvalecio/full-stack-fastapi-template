import {
  Handle,
  Position,
} from '@xyflow/react'
import { Box, Image } from '@chakra-ui/react'
import { Tooltip } from "@/components/ui/tooltip"

const IMG_ROOT = "./public/assets/images/devices"

function MecConNode () {

  return (
    <Box
      position='relative'
      w='20px'
      h='20px'
      display='flex'
      alignItems='center'
      justifyContent='center'
      cursor='pointer'
    >
      <Tooltip content="Mechanical Connector">
      <Image
        loading='eager'
        src={ `${IMG_ROOT}/mechanical_connector_generic.svg` }
        w="12px"
        h="12px"
        />
      </Tooltip>
      <Handle type='source' position={Position.Right} />
      <Handle type='target' position={Position.Left} />
    </Box>
  )
}

export default MecConNode