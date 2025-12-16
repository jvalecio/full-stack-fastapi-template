import { ControlButton, Controls } from '@xyflow/react'
import { useState } from 'react'
import { FaRunning } from 'react-icons/fa'

export default function FlowControl () {
  const [selected, setSelected] = useState(false)
  function handleRealTimeButton () {
    setSelected(prev => !prev)
  }

  return (
    <Controls>
      <ControlButton
        onClick={handleRealTimeButton}
        style={{ backgroundColor: selected ? '#34C87C' : 'white' }}
      >
        <FaRunning />
      </ControlButton>
    </Controls>
  )
}
