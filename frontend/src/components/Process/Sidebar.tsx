import { Box, VStack, Text } from "@chakra-ui/react";
import { useReactFlow, XYPosition } from "@xyflow/react";
import { useCallback, useState } from "react";
import { OnDropAction, useDnD, useDnDPosition } from "./useDnd";

let id = 0;
const getId = () => `dndnode_${id++}`;

export function Sidebar() {
  const { onDragStart, isDragging } = useDnD();
  const [type, setType] = useState<string | null>(null);

  const { setNodes } = useReactFlow();

  const createAddNewNode = useCallback(
    (nodeType: string): OnDropAction => {
      return ({ position }: { position: XYPosition }) => {
        const newNode = {
          id: getId(),
          type: nodeType,
          position,
          data: {
            label: `${nodeType} node`,
            actuator_prop: "manual",
            state: "open",
            tag: getId(),
          },
        };

        setNodes((nds) => nds.concat(newNode));
        setType(null);
      };
    },
    [setNodes],
  );

  return (
    <>
      {isDragging && <DragGhost type={type} />}

      <VStack
        //spacing={4}
        align="stretch"
        p={2}
        pointerEvents="auto"
        userSelect="none"
      >
        <Text fontWeight="bold">Drag items to create nodes</Text>

        {/* ITEM 1 */}
        <Box
          bg="gray.200"
          p={2}
          borderRadius="md"
          cursor="grab"
          pointerEvents="auto"
          onPointerDown={(event) => {
            setType("valve");
            onDragStart(event, createAddNewNode("valve"));
          }}
        >
          Valve Node
        </Box>

        {/* ITEM 2 */}
        <Box
          bg="gray.200"
          p={2}
          borderRadius="md"
          cursor="grab"
          pointerEvents="auto"
          onPointerDown={(event) => {
            setType("default");
            onDragStart(event, createAddNewNode("default"));
          }}
        >
          Default Node
        </Box>

        {/* ITEM 3 */}
        <Box
          bg="gray.200"
          p={2}
          borderRadius="md"
          cursor="grab"
          pointerEvents="auto"
          onPointerDown={(event) => {
            setType("output");
            onDragStart(event, createAddNewNode("output"));
          }}
        >
          Output Node
        </Box>
      </VStack>
    </>
  );
}

export function DragGhost({ type }: { type: string | null }) {
  const { position } = useDnDPosition();
  if (!position) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      zIndex={9999}
      bg="blue.100"
      px={3}
      py={1}
      borderRadius="md"
      border="1px solid #888"
      transform={`translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`}
      pointerEvents="none"
    >
      {type && `${type} node`}
    </Box>
  );
}
