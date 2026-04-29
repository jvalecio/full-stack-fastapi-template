import { ControlButton, Controls } from '@xyflow/react'
import { FaLock, FaUnlock } from 'react-icons/fa'
import { useDiagramContext } from './DiagramContext'

export default function FlowControl() {
  const { mode, locked, setLocked } = useDiagramContext()

  return (
    <Controls showInteractive={false}>
      {mode === 'run' && (
        <ControlButton
          onClick={() => setLocked(!locked)}
          title={locked ? 'Desbloquear interações' : 'Bloquear interações'}
          style={{ backgroundColor: locked ? '#ef4444' : 'white' }}
        >
          {locked ? <FaLock color='white' /> : <FaUnlock />}
        </ControlButton>
      )}
    </Controls>
  )
}
