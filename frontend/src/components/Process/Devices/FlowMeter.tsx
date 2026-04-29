import { Box, Image, Text } from "@chakra-ui/react"
import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { useEffect, useState } from "react";
import { Popover, Portal } from "@chakra-ui/react"

export type FlowMeterNodeType = Node<
  {
    value?: number
    onValueChange?: (val: number) => void
  },
  'flowMeter'
>

function FlowMeterNode(props: NodeProps<FlowMeterNodeType>) {
  const { data } = props
  const [flow, setFlow] = useState<number>(data?.value ?? 0)

  // Simulação de atualização periódica
  useEffect(() => {
    const interval = setInterval(() => {
      const newFlow = Math.floor(Math.random() * 100)
      setFlow(newFlow)
      data?.onValueChange?.(newFlow)
    }, 2000)

    return () => clearInterval(interval)
  }, [data])

  return (

    <Popover.Root>
          <Popover.Trigger asChild>
            <Box
      position="relative"
      w="120px"
      h="80px"
      border="2px solid #3182CE"
      borderRadius="8px"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bg="blue.50"
    >
      <Text fontSize="sm" fontWeight="bold" mb={1}>
        Flow
      </Text>
      <Text fontSize="2xl" fontWeight="bold" color="#3182CE">
        {flow} lpm
      </Text>

      <Handle type="source" position={Position.Right} style={{ background: "#3182CE" }} />
      <Handle type="target" position={Position.Left} style={{ background: "#3182CE" }} />
    </Box>
          </Popover.Trigger>
          <Portal>
            <Popover.Positioner>
              <Popover.Content>
                <Popover.Arrow />
                <Popover.Body>
                <Popover.Title fontWeight="bold">AALBORG GFC</Popover.Title>

                  <Text my="4">
                    The Aalborg GFC series provides precise measurement and control of clean 
                    gas flow using a thermal mass flow sensor. Flow ranges span 10 sccm to 1000 slpm 
                    (N₂ equivalent) with accuracy up to ±1% of full scale. 
                  </Text>
                  <Image height={100} src="./src/components/Process/aalborg.jpg" />
                  
                </Popover.Body>
              </Popover.Content>
            </Popover.Positioner>
          </Portal>
        </Popover.Root>

    
  );
}

export default FlowMeterNode;