
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  Handle,
  Position,
  NodeProps,
  
} from 'reactflow'
import { Image } from '@chakra-ui/react'
import 'reactflow/dist/style.css'
import { Box } from '@chakra-ui/react'
import FlowMeterNode from './FlowMeter'
import MechanicalConnectionNode from './MechanicalConnection'
// Componente personalizado de válvula (dois triângulos ponta a ponta)
import { useState } from 'react'

export interface ValveData {
  label?: string
  state?: 'open' | 'closed'
  onToggle?: (id: string, state: 'open' | 'closed') => void
}

function ValveNode ({ id, data }: NodeProps<ValveData>) {
  const [isOpen, setIsOpen] = useState(data?.state === 'open')

  const handleClick = () => {
    const newState: 'open' | 'closed' = isOpen ? 'closed' : 'open'
    setIsOpen(!isOpen)
    data?.onToggle?.(id, newState)
  }

  return (
    <Box
      position='relative'
      w='100px'
      h='100px'
      display='flex'
      alignItems='center'
      justifyContent='center'
      cursor='pointer'
      onClick={handleClick}
    >
      <Image
        src={
          isOpen
            ? './src/components/Process/valve_open.png'
            : './src/components/Process/valve_closed.png'
        }
        //w="80px"
        //h="80px"
        alt={data?.label || 'Valve'}
      />
      <Handle type='source' position={Position.Right} />
      <Handle type='target' position={Position.Left} />
    </Box>
  )
}

const nodeTypes = {
  valve: ValveNode,
  flowMeter: FlowMeterNode,
  meccon: MechanicalConnectionNode
}

const initialNodes = [
  { id: 'SOURCE', type: 'valve', position: { x: -150, y: 360 }, data: {} },
  { id: 'OUTA', type: 'meccon', position: { x: 700, y: 230 }, data: {} },
  { id: 'OUTB', type: 'meccon', position: { x: 700, y: 580 }, data: {} },
  { id: 'ENTRYA', type: 'meccon', position: { x: 40, y: 230 }, data: {} },
  {
    id: 'ENTRYB',
    type: 'meccon',
    position: { x: 40, y: 580 },
    data: { label: '' }
  },

  {
    id: '2v',
    type: 'valve',
    position: { x: 200, y: 90 },
    data: { label: 'V1', state: 'open' }
  },
  {
    id: '2',
    type: 'flowMeter',
    position: { x: 350, y: 100 },
    data: { label: 'Flow 1A', value: 25 }
  },

  {
    id: '3v',
    type: 'valve',
    position: { x: 200, y: 190 },
    data: { label: 'V1', state: 'open' }
  },
  {
    id: '3',
    type: 'flowMeter',
    position: { x: 350, y: 200 },
    data: { label: 'Flow 2A', value: 100 }
  },

  {
    id: '4v',
    type: 'valve',
    position: { x: 200, y: 290 },
    data: { label: 'V1', state: 'open' }
  },
  {
    id: '4',
    type: 'flowMeter',
    position: { x: 350, y: 300 },
    data: { label: 'Flow 3A', value: 100 }
  },

  {
    id: '5v',
    type: 'valve',
    position: { x: 200, y: 440 },
    data: { label: 'V1', state: 'open' }
  },
  {
    id: '5',
    type: 'flowMeter',
    position: { x: 350, y: 450 },
    data: { label: 'Flow 1B', value: 100 }
  },

  {
    id: '6v',
    type: 'valve',
    position: { x: 200, y: 540 },
    data: { label: 'V1', state: 'open' }
  },
  {
    id: '6',
    type: 'flowMeter',
    position: { x: 350, y: 550 },
    data: { label: 'Flow 2B', value: 100 }
  },

  {
    id: '7v',
    type: 'valve',
    position: { x: 200, y: 640 },
    data: { label: 'V1', state: 'open' }
  },
  {
    id: '7',
    type: 'flowMeter',
    position: { x: 350, y: 650 },
    data: { label: 'Flow 3B', value: 100 }
  }
]

const initialEdges = [
  { id: 'ev-source', source: 'SOURCE', target: 'ENTRYA', type: 'step' },
  { id: 'ev-source', source: 'SOURCE', target: 'ENTRYB', type: 'step' },

  { id: 'evpm-2a', source: 'ENTRYA', target: '2v', type: 'step' },
  { id: 'evpm-3a', source: 'ENTRYA', target: '3v', type: 'step' },
  { id: 'evpm-4a', source: 'ENTRYA', target: '4v', type: 'step' },

  { id: 'evpm-2a', source: '2v', target: 'OUTA', type: 'step' },
  { id: 'evpm-3a', source: '3v', target: 'OUTA', type: 'step' },
  { id: 'evpm-4a', source: '4v', target: 'OUTA', type: 'step' },

  { id: 'evpm-2a', source: '5v', target: 'OUTB', type: 'step' },
  { id: 'evpm-3a', source: '6v', target: 'OUTB', type: 'step' },
  { id: 'evpm-4a', source: '7v', target: 'OUTB', type: 'step' },

  { id: 'evpm-2b', source: 'ENTRYB', target: '5v', type: 'step' },
  { id: 'evpm-3b', source: 'ENTRYB', target: '6v', type: 'step' },
  { id: 'evpm-4b', source: 'ENTRYB', target: '7v', type: 'step' },

  { id: 'ev2-2', source: '2v', target: '2' },
  { id: 'ev3-3', source: '3v', target: '3' },
  { id: 'ev4-4', source: '4v', target: '4' },
  { id: 'ev5-5', source: '5v', target: '5' },
  { id: 'ev6-6', source: '6v', target: '6' },
  { id: 'ev7-7', source: '7v', target: '7' }
]

function ValvesDiagram () {
  return (
    <Box w='100%' h='64vh' bg='white'>
      <ReactFlowProvider>
        <ReactFlow
          defaultEdgeOptions={{ type: 'straight' }}
          nodes={initialNodes}
          edges={initialEdges}
          nodeTypes={nodeTypes}
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
