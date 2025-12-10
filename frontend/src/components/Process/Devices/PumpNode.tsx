import { Image } from '@chakra-ui/react'
import { NodeProps, Position } from '@xyflow/react'
import DeviceBase, { DeviceBaseProps } from './DeviceBase'

export default function PumpNode(props: NodeProps & { base: DeviceBaseProps }) {

  return (
    <DeviceBase
      {...props}
      
      base={{
        width: '100px',
        height: '150px',

        graphic: (
          <Image
            src="./assets/images/devices/pump.svg"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="100%"
          />
        ),

        handles: [
          { type: 'source', position: Position.Left },
          { type: 'target', position: Position.Right }
        ],

        onClick: () => console.log("Pump clicked:", props.id)
      }}
    />
  )
}
