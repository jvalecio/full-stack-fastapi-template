import { useCallback, useEffect, useState } from 'react'
import {
  Connection, ConnectionMode, ReactFlowInstance, useReactFlow,
  ReactFlow, useEdgesState, useNodesState, addEdge, type Node, type Edge,
  Panel,
} from '@xyflow/react'
import { Box, Badge, Button, HStack } from '@chakra-ui/react'

import FlowControl from './FlowControl'
import { DiagramContext, type DiagramMode } from './DiagramContext'
import { NodeEditModal } from './NodeEditModal'
import FlowMeterNode from './Devices/FlowMeter'
import { AnimatedSVGEdge } from './Devices/AnimatedSVGEdge'
import { EditableEdge } from './Devices/EditableEdge'
import TankNode from './Devices/Tank'
import PumpNode from './Devices/PumpNode'
import SensorNode from './Devices/SensorNode'
import GenericValveNode from '@/components/Process/Devices/GenericValve'
import Valve3WNode from '@/components/Process/Devices/GenericValve3W'
import '@xyflow/react/dist/style.css'
import { GRID } from './Devices/constants'

const flowKey = 'example-flow'

const nodeTypes = {
  valve: GenericValveNode,
  flowMeter: FlowMeterNode,
  tank: TankNode,
  pump: PumpNode,
  sensor: SensorNode,
  valve3w: Valve3WNode,
}

const edgeTypes = {
  animatedSvg: AnimatedSVGEdge,
  editable: EditableEdge,
}

const initialEdges: Edge[] = []

const initialNodes: Node[] = [
  {
    id: 'dndnode_8',
    type: 'valve3w',
    position: { x: 200, y: 325 },
    data: { tag: 'dndnode_9', state: 'open', actuator_prop: 'manual', rotation: 0 },
  },
  {
    id: 'valve1',
    type: 'valve',
    position: { x: 200, y: 225 },
    data: { tag: 'valve1', state: 'open', actuator_prop: 'manual', rotation: 0 },
  },
  {
    id: 'valve2',
    type: 'valve',
    position: { x: 100, y: 325 },
    data: { tag: 'valve2', state: 'open', actuator_prop: 'manual', rotation: 0 },
  },
]

function loadSaved() {
  try {
    const raw = localStorage.getItem(flowKey)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

const modeLabel: Record<string, { label: string; colorPalette: string }> = {
  edit:   { label: '✏ Edição',   colorPalette: 'orange' },
  run:    { label: '▶ Runtime',  colorPalette: 'green'  },
  locked: { label: '⏸ Bloqueado', colorPalette: 'red'   },
}

export default function ValvesDiagram({ mode = 'run' }: { mode?: DiagramMode }) {
  const isEdit = mode === 'edit'
  const [locked, setLocked] = useState(false)
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)

  const saved = loadSaved()
  const [nodes, setNodes, onNodesChange] = useNodesState(saved?.nodes ?? initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(saved?.edges ?? initialEdges)
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null)
  const { setViewport } = useReactFlow()

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setRfInstance(instance)
    if (saved?.viewport) {
      const { x = 0, y = 0, zoom = 1 } = saved.viewport
      instance.setViewport({ x, y, zoom })
    }
  }, [])

  const onConnect = useCallback(
    (params: Connection) => setEdges(eds => addEdge(params, eds)),
    []
  )

  useEffect(() => {
    if (!isEdit || !rfInstance) return
    localStorage.setItem(flowKey, JSON.stringify(rfInstance.toObject()))
  }, [nodes, edges, isEdit, rfInstance])

  const onSave = useCallback(() => {
    if (rfInstance) {
      localStorage.setItem(flowKey, JSON.stringify(rfInstance.toObject()))
    }
  }, [rfInstance])

  const onRestore = useCallback(() => {
    const raw = localStorage.getItem(flowKey)
    if (!raw) return
    const flow = JSON.parse(raw)
    const { x = 0, y = 0, zoom = 1 } = flow.viewport ?? {}
    setNodes(flow.nodes ?? [])
    setEdges(flow.edges ?? [])
    setViewport({ x, y, zoom })
  }, [setNodes, setEdges, setViewport])

  const indicator = !isEdit && locked ? modeLabel.locked : modeLabel[mode]

  return (
    <DiagramContext.Provider value={{ mode, locked, setLocked, editingNodeId, setEditingNodeId }}>
      <Box w='full' h='75vh' bg='white' className="react-flow-wrapper">
        <ReactFlow
          className="react-flow"
          snapToGrid={isEdit}
          snapGrid={[GRID, GRID]}
          connectionMode={ConnectionMode.Loose}
          maxZoom={5}
          defaultEdgeOptions={{ type: 'editable' }}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={isEdit ? onConnect : undefined}
          onInit={onInit}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodesDraggable={isEdit}
          nodesConnectable={isEdit}
          edgesReconnectable={isEdit}
          fitView
          zoomOnDoubleClick={false}
          proOptions={{ hideAttribution: true }}
        >
          <FlowControl />
          <NodeEditModal />

          <Panel position='top-center'>
            <Badge colorPalette={indicator.colorPalette} size='sm' variant='solid' px={3} py={1}>
              {indicator.label}
            </Badge>
          </Panel>

          {isEdit && (
            <Panel position='top-right'>
              <HStack gap={1}>
                <Button variant='outline' size='sm' bg='white' onClick={onSave}>
                  Save
                </Button>
                <Button variant='outline' size='sm' bg='white' onClick={onRestore}>
                  Restore
                </Button>
              </HStack>
            </Panel>
          )}
        </ReactFlow>
      </Box>
    </DiagramContext.Provider>
  )
}
