import { useCallback, useState } from 'react'
import { Connection, ConnectionMode, ControlButton, useReactFlow } from '@xyflow/react'

import {
  ReactFlow,
  useEdgesState,
  useNodesState,
  Controls,
  addEdge,
} from '@xyflow/react'
import FlowControl from './FlowControl'
import { Box, Button } from '@chakra-ui/react'
import FlowMeterNode from './FlowMeter'

import { AnimatedSVGEdge } from './Devices/AnimatedSVGEdge'
import { BiSolidTimer } from "react-icons/bi";
import TankNode from './Devices/Tank'
import PumpNode from './Devices/PumpNode'
import SensorNode from './Devices/SensorNode'
import GenericValveNode from '@/components/Process/Devices/GenericValve'
import Valve3WNode from '@/components/Process/Devices/GenericValve3W'
import '@xyflow/react/dist/style.css'
import { FaRunning } from 'react-icons/fa'

const flowKey = 'example-flow';

const nodeTypes = {
  valve: GenericValveNode,
  flowMeter: FlowMeterNode,
  tank: TankNode,
  pump: PumpNode,
  sensor: SensorNode,
  valve3w:Valve3WNode,
}

const edgeTypes = {
  animatedSvg: AnimatedSVGEdge
}

const initialEdges = [
  {
    
  }
]


const initialNodes = [
  {
    id: 'dndnode_8',
    type: 'valve3w',
    position: { x: 200, y: 325 },
    data: {
      tag: 'dndnode_9',
      state: 'open',
      actuator_prop: 'manual',
      rotation: 0
    }
  },
  {
    id: 'valve1',
    type: 'valve',
    position: { x: 200, y: 225 },
    data: {
      tag: 'valve1',
      state: 'open',
      actuator_prop: 'manual',
      rotation: 0
    }
  },
  {
    id: 'valve2',
    type: 'valve',
    position: { x: 100, y: 325 },
    data: {
      tag: 'valve2',
      state: 'open',
      actuator_prop: 'manual',
      rotation: 0
    }
  }
]

function ValvesDiagram () {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport } = useReactFlow();

  const onConnect = useCallback((params: Connection) => {
    // Se o React Flow tentar substituir o handle (auto-correção), ignore
    setEdges(eds => addEdge(params, eds))
  }, [])

  //const onConnect = useCallback(
  //  (params: Connection | Edge) => setEdges(eds => addEdge(params, eds)),
  //  []
  //);

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
      console.log(JSON.stringify(flow));
    }
  }, [rfInstance]);
 
  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flowLS = localStorage.getItem(flowKey)

      const flow = (flowLS) ? JSON.parse(flowLS): null;
      
      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };
 
    restoreFlow();
  }, [setNodes, setViewport]);

  return (
    <>
    <Button variant='outline' size='sm' onClick={onSave}>
      Save
    </Button>
    <Button variant='outline' size='sm' onClick={onRestore}>
      Restore
    </Button>
    <Box w='full' h='60vh' bg='white' className="react-flow-wrapper">
          <ReactFlow
            className="react-flow"
            snapToGrid={true}
            snapGrid={[25, 25]}
            connectionMode={ConnectionMode.Loose}
            
            maxZoom={5}
            defaultEdgeOptions={{ type: 'step' }}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setRfInstance}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
            >

            <FlowControl/>
            
          </ReactFlow>
    </Box>
  </>
  )
}

export default () => <ValvesDiagram />
