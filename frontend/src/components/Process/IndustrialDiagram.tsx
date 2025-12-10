import { useCallback } from 'react'
import { Connection, BackgroundVariant } from '@xyflow/react'

import {
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  Controls,
  Background,
  addEdge,
  ConnectionMode
} from '@xyflow/react'
import { useEffect } from 'react'
import { Box } from '@chakra-ui/react'
import FlowMeterNode from './FlowMeter'

import { AnimatedSVGEdge } from './Devices/AnimatedSVGEdge'

import TankNode from './Devices/Tank'
import PumpNode from './Devices/Pump'
import GenericValveNode from '@/components/Process/Devices/GenericValve'
import MecConNode from '@/components/Process/Devices/MechanicalConnector'
import '@xyflow/react/dist/style.css'

import { Sidebar } from './Sidebar'
import { DnDProvider } from './useDnD'

const nodeTypes = {
  valve: GenericValveNode,
  flowMeter: FlowMeterNode,
  meccon: MecConNode,
  tank: TankNode,
  pump: PumpNode
}

const edgeTypes = {
  animatedSvg: AnimatedSVGEdge
}

const initialEdges = [
  { id: 'e1-2', source: 'SOURCE', target: 'ENTRYA', type: 'animatedSvg' }
]

const initialNodes = [
  {
    id: 'mc_001',
    type: 'meccon',
    position: { x: 200, y: 0 },
    data: { tag: 'mc1' }
  },
  {
    id: 'valve_001',
    type: 'valve',
    position: { x: 0, y: 0 },
    data: { tag: 'VS1', state: 'open', actuator_prop: 'manual' }
  },
  {
    id: 'valve_002',
    type: 'valve',
    position: { x: 100, y: 0 },
    data: { tag: 'VS2', state: 'open', actuator_prop: 'manual' }
  },
  {
    id: 'valve_003',
    type: 'valve',
    position: { x: 100, y: 200 },
    data: { tag: 'VS3', state: 'open', actuator_prop: 'manual' }
  }
]

function ValvesDiagram () {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  /*
  useEffect(() => {
    setNodes(initialNodes)
  }, [initialNodes, setNodes])

  useEffect(() => {
    setEdges(initialEdges)
  }, [initialEdges, setEdges])
  */

  const onConnect = useCallback((params: Connection) => {
    // Se o React Flow tentar substituir o handle (auto-correção), ignore
    setEdges(eds => addEdge(params, eds))
  }, [])

  //const onConnect = useCallback(
  //  (params: Connection | Edge) => setEdges(eds => addEdge(params, eds)),
  //  []
  //);
  return (
    <Box w='full' h='50vh' bg='white'>
      <ReactFlowProvider>
        <DnDProvider>
          <ReactFlow
            snapToGrid={true}
            snapGrid={[25, 25]}
            //connectionMode={ConnectionMode.Loose}

            maxZoom={3}
            defaultEdgeOptions={{ type: 'step' }}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Controls />
          </ReactFlow>
          <Sidebar />
        </DnDProvider>
      </ReactFlowProvider>
    </Box>
  )
}

export default () => <ValvesDiagram />
