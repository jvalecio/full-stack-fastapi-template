import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';
import { useState } from 'react';

export default function EditableEdge(props) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data } = props;

  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(data?.label ?? '');

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition
  });

  const save = () => {
    if (props.data?.onChange) {
      props.data.onChange(id, value);
    }
    setEditing(false);
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
            background: 'white',
            padding: 2,
            borderRadius: 4
          }}
          onDoubleClick={() => setEditing(true)}
        >
          {!editing && (
            <span style={{ cursor: 'pointer' }}>
              {value || 'double-click to edit'}
            </span>
          )}

          {editing && (
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={save}
              onKeyDown={(e) => e.key === 'Enter' && save()}
              style={{ width: 100 }}
            />
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
