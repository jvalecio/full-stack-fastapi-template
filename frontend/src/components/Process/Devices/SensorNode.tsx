import { Image, Text } from '@chakra-ui/react'
import { NodeProps, Position } from '@xyflow/react'
import DeviceBase, { DeviceBaseProps } from './DeviceBase'
import DragRotateLabel from './DragRotateLabel'

export default function SensorNode (
  props: NodeProps & { base: DeviceBaseProps }
) {
  return (
    <>
      <DeviceBase
        {...props}
        base={{
          width: '50px',
          height: '50px',
          drag_label: false,
          graphic: (
            <Image
              src='./assets/images/devices/pump.svg'
              position='absolute'
              top='50%'
              left='50%'
              transform='translate(-50%, -50%)'
              width='100%'
            />
          ),
          overlay: (
            <Text
              position='absolute'
              top='50%'
              left='50%'
              transform='translate(-50%, -50%)'
            >
              {props.id}
            </Text>
          ),
          handles: [
            //{ type: 'source', position: Position.Left },
            { type: 'target', position: Position.Bottom }
          ],

          onClick: () => console.log('Pump clicked:', props.id)
        }}
      />
    </>
  )
}
