import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,

  Connection,
  Edge
} from '@xyflow/react'
import { useCallback, useEffect } from 'react'
import { Box } from '@chakra-ui/react'
import FlowMeterNode from './FlowMeter'

import { AnimatedSVGEdge } from './Devices/AnimatedSVGEdge';

import TankNode from './Devices/Tank'
import PumpNode from './Devices/Pump'
import GenericValveNode from '@/components/Process/Devices/GenericValve'
import MecConNode from '@/components/Process/Devices/MechanicalConnector'
import '@xyflow/react/dist/style.css';
const nodeTypes = {
  valve: GenericValveNode,
  flowMeter: FlowMeterNode,
  meccon: MecConNode,
  tank: TankNode,
  pump: PumpNode,
}

const edgeTypes = {
  animatedSvg: AnimatedSVGEdge,
};

const initialNodes = [
  { id: 'preSOURCE', type: 'tank', position: { x: -300, y: 250 }, data: {} },
  { id: 'SOURCE', type: 'pump', position: { x: -150, y: 360 }, data: {} },
  { id: 'OUTA', type: 'meccon', position: { x: 700, y: 198 }, data: {} },
  { id: 'OUTB', type: 'meccon', position: { x: 700, y: 548 }, data: {} },
  { id: 'ENTRYA', type: 'meccon', position: { x: 40, y: 198 }, data: {} },
  {
    id: 'ENTRYB',
    type: 'meccon',
    position: { x: 40, y: 548 },
    data: { label: '' }
  },

  {
    id: '2v',
    type: 'valve',
    position: { x: 200, y: 95 },
    data: { tag: 'VS1', state: 'open', actuator_prop: 'manual' }
  },
  {
    id: '2',
    type: 'flowMeter',
    position: { x: 350, y: 68 },
    data: { label: 'Flow 1A', value: 25 }
  },
  {
    id: '3v',
    type: 'valve',
    position: { x: 200, y: 195 },
    data: { tag: 'VS2', state: 'open', actuator_prop: 'pneumatic' }
  },
  {
    id: '3',
    type: 'flowMeter',
    position: { x: 350, y: 168 },
    data: { label: 'Flow 2A', value: 100 }
  },
  {
    id: '4v',
    type: 'valve',
    position: { x: 200, y: 295 },
    data: { tag: 'VS3', state: 'open' }
  },
  {
    id: '4',
    type: 'flowMeter',
    position: { x: 350, y: 268 },
    data: { label: 'Flow 3A', value: 100 }
  },

  {
    id: '5v',
    type: 'valve',
    position: { x: 200, y: 445 },
    data: { tag: 'VS4', state: 'open' }
  },
  {
    id: '5',
    type: 'flowMeter',
    position: { x: 350, y: 418 },
    data: { label: 'Flow 1B', value: 100 }
  },

  {
    id: '6v',
    type: 'valve',
    position: { x: 200, y: 545 },
    data: { tag: 'VS5', state: 'open' }
  },
  {
    id: '6',
    type: 'flowMeter',
    position: { x: 350, y: 518 },
    data: { label: 'Flow 2B', value: 100 }
  },

  {
    id: '7v',
    type: 'valve',
    position: { x: 200, y: 645 },
    data: { tag: 'VS6', state: 'open' }
  },
  {
    id: '7',
    type: 'flowMeter',
    position: { x: 350, y: 618 },
    data: { label: 'Flow 3B', value: 100 }
  }
]

const initialEdges = [
  { id: 'ev-pres', source: 'preSOURCE', target: 'SOURCE', type: 'step' },
  { id: 'ev-sourcea', source: 'SOURCE', target: 'ENTRYA', type: 'step' },
  { id: 'ev-sourceb', source: 'SOURCE', target: 'ENTRYB', type: 'step' },

  { id: 'evpm-2ae', source: 'ENTRYA', target: '2v', type: 'step' },
  { id: 'evpm-3ae', source: 'ENTRYA', target: '3v', type: 'step' },
  { id: 'evpm-4ae', source: 'ENTRYA', target: '4v', type: 'step' },

  { id: 'evpm-2a', source: '2', target: 'OUTA', type: 'animatedSvg' },
  { id: 'evpm-3a', source: '3', target: 'OUTA', type: 'step' },
  { id: 'evpm-4a', source: '4', target: 'OUTA', type: 'animatedSvg' },

  { id: 'evpm-2b', source: '5', target: 'OUTB', type: 'animatedSvg' },
  { id: 'evpm-3b', source: '6', target: 'OUTB', type: 'step' },
  { id: 'evpm-4b', source: '7', target: 'OUTB', type: 'animatedSvg' },

  { id: 'evpm-2be', source: 'ENTRYB', target: '5v', type: 'step' },
  { id: 'evpm-3be', source: 'ENTRYB', target: '6v', type: 'step' },
  { id: 'evpm-4be', source: 'ENTRYB', target: '7v', type: 'step' },

  { id: 'ev2-2', source: '2v', target: '2' , type: 'step'},
  { id: 'ev3-3', source: '3v', target: '3' , type: 'step'},
  { id: 'ev4-4', source: '4v', target: '4' , type: 'step'},
  { id: 'ev5-5', source: '5v', target: '5' , type: 'step'},
  { id: 'ev6-6', source: '6v', target: '6' , type: 'step'},
  { id: 'ev7-7', source: '7v', target: '7' , type: "step"}
]

function ValvesDiagram () {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    setNodes(initialNodes)
  }, [initialNodes, setNodes])

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges(eds => addEdge(params, eds)),
    []
  );
  return (
    <Box w='100%' h='74vh' bg='white'>
      <ReactFlowProvider>
        <ReactFlow
        maxZoom={5}
          //defaultEdgeOptions={{ type: 'straight' }}
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
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </Box>
  )
}

export default ValvesDiagram
