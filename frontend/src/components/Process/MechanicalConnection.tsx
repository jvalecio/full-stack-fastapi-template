import { Box, Image } from "@chakra-ui/react";
import { Handle, Position } from "reactflow";


function MechanicalConnectionNode () {
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
      <Image src='./src/components/Process/mechanical_connection2.png' alt="Valve Open" />
      <Handle type='source' position={Position.Right} />
      <Handle type='target' position={Position.Left} />
    </Box>
  )
}

export default MechanicalConnectionNode;