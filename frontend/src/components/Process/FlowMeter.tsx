import { Box, Text } from "@chakra-ui/react";
import { Handle, Position, NodeProps } from "reactflow";
import { useEffect, useState } from "react";

export interface FlowMeterData {
  label?: string;
  value?: number;           // valor inicial do fluxo
  onValueChange?: (val: number) => void; // callback opcional
}

function FlowMeterNode({data }: NodeProps<FlowMeterData>) {
  const [flow, setFlow] = useState<number>(data?.value ?? 0);

  // Exemplo: atualizar valor a cada 2s (simulando leitura real)
  useEffect(() => {
    const interval = setInterval(() => {
      const newFlow = Math.floor(Math.random() * 100); // simula valor de 0 a 99
      setFlow(newFlow);
      data?.onValueChange?.(newFlow);
    }, 2000);

    return () => clearInterval(interval);
  }, [data]);

  return (
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
        {data?.label || "Flow"}
      </Text>
      <Text fontSize="2xl" fontWeight="bold" color="#3182CE">
        {flow} lpm
      </Text>

      <Handle type="source" position={Position.Right} style={{ background: "#3182CE" }} />
      <Handle type="target" position={Position.Left} style={{ background: "#3182CE" }} />
    </Box>
  );
}

export default FlowMeterNode;