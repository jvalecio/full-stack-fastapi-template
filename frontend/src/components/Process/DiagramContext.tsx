import { createContext, useContext } from 'react'

export type DiagramMode = 'edit' | 'run'

interface DiagramContextValue {
  mode: DiagramMode
  locked: boolean
  setLocked: (v: boolean) => void
  editingNodeId: string | null
  setEditingNodeId: (id: string | null) => void
}

export const DiagramContext = createContext<DiagramContextValue>({
  mode: 'run',
  locked: false,
  setLocked: () => {},
  editingNodeId: null,
  setEditingNodeId: () => {},
})

export const useDiagramContext = () => useContext(DiagramContext)
