import { type EdgeProps, useReactFlow } from '@xyflow/react'
import { snapPt } from './constants'

type Pt = { x: number; y: number }
type StepSeg = { from: Pt; to: Pt; ptsIdx: number }

const AXIS_THRESH = 0.5

function buildStepSegments(pts: Pt[]): StepSeg[] {
  const result: StepSeg[] = []
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]
    const b = pts[i + 1]
    if (Math.abs(a.x - b.x) < AXIS_THRESH || Math.abs(a.y - b.y) < AXIS_THRESH) {
      result.push({ from: a, to: b, ptsIdx: i })
    } else {
      const midX = (a.x + b.x) / 2
      const corner1: Pt = { x: midX, y: a.y }
      const corner2: Pt = { x: midX, y: b.y }
      result.push({ from: a, to: corner1, ptsIdx: i })
      result.push({ from: corner1, to: corner2, ptsIdx: i })
      result.push({ from: corner2, to: b, ptsIdx: i })
    }
  }
  return result
}

export function EditableEdge({
  id,
  sourceX, sourceY,
  targetX, targetY,
  data,
  selected,
  markerEnd,
}: EdgeProps) {
  const { setEdges, screenToFlowPosition } = useReactFlow()
  const waypoints = (Array.isArray(data?.waypoints) ? data.waypoints : []) as Pt[]

  const source: Pt = { x: sourceX, y: sourceY }
  const target: Pt = { x: targetX, y: targetY }
  const pts: Pt[] = [source, ...waypoints, target]

  const stepSegs = buildStepSegments(pts)
  const stepPts = stepSegs.length > 0
    ? [stepSegs[0].from, ...stepSegs.map(s => s.to)]
    : pts
  const d = stepPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ')

  function setWaypoints(wps: Pt[]) {
    setEdges(es => es.map(e => e.id === id ? { ...e, data: { ...e.data, waypoints: wps } } : e))
  }

  function onSegDblClick(ptsIdx: number, e: React.MouseEvent<SVGLineElement>) {
    e.stopPropagation()
    const pos = snapPt(screenToFlowPosition({ x: e.clientX, y: e.clientY }))
    const wps = [...waypoints]
    wps.splice(ptsIdx, 0, pos)
    setWaypoints(wps)
  }

  function onSegPointerDown(segIdx: number, isHorizontal: boolean) {
    return (e: React.PointerEvent<SVGLineElement>) => {
      e.stopPropagation()
      const el = e.currentTarget
      el.setPointerCapture(e.pointerId)

      const startPos = screenToFlowPosition({ x: e.clientX, y: e.clientY })
      const initWps = [...waypoints]
      const initPts: Pt[] = [source, ...initWps, target]

      const segA = initPts[segIdx]
      const segB = initPts[segIdx + 1]
      const isH = isHorizontal
      const aFixed = segIdx === 0
      const bFixed = segIdx + 1 === initPts.length - 1

      const onMove = (me: PointerEvent) => {
        const cur = screenToFlowPosition({ x: me.clientX, y: me.clientY })
        const rawDx = cur.x - startPos.x
        const rawDy = cur.y - startPos.y
        const dx = isH ? 0 : rawDx
        const dy = isH ? rawDy : 0

        let newWps: Pt[]

        if (aFixed && bFixed) {
          const elbow: Pt[] = isH
            ? [snapPt({ x: segA.x, y: segA.y + dy }), snapPt({ x: segB.x, y: segA.y + dy })]
            : [snapPt({ x: segA.x + dx, y: segA.y }), snapPt({ x: segA.x + dx, y: segB.y })]
          newWps = [...initWps.slice(0, segIdx), ...elbow, ...initWps.slice(segIdx)]
        } else {
          newWps = [...initWps]
          if (!aFixed) newWps[segIdx - 1] = snapPt({ x: initWps[segIdx - 1].x + dx, y: initWps[segIdx - 1].y + dy })
          if (!bFixed) newWps[segIdx] = snapPt({ x: initWps[segIdx].x + dx, y: initWps[segIdx].y + dy })
        }

        setEdges(es => es.map(edge =>
          edge.id !== id ? edge : { ...edge, data: { ...edge.data, waypoints: newWps } }
        ))
      }

      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerup', () => el.removeEventListener('pointermove', onMove), { once: true })
    }
  }

  function onWpPointerDown(i: number) {
    return (e: React.PointerEvent<SVGCircleElement>) => {
      e.stopPropagation()
      const el = e.currentTarget
      el.setPointerCapture(e.pointerId)

      const onMove = (me: PointerEvent) => {
        const pos = snapPt(screenToFlowPosition({ x: me.clientX, y: me.clientY }))
        setEdges(es => es.map(edge => {
          if (edge.id !== id) return edge
          const wps = [...((Array.isArray(edge.data?.waypoints) ? edge.data.waypoints : []) as Pt[])]
          wps[i] = pos
          return { ...edge, data: { ...edge.data, waypoints: wps } }
        }))
      }

      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerup', () => el.removeEventListener('pointermove', onMove), { once: true })
    }
  }

  function onWpDblClick(i: number) {
    return (e: React.MouseEvent) => {
      e.stopPropagation()
      setWaypoints(waypoints.filter((_, j) => j !== i))
    }
  }

  const stroke = selected ? '#555' : '#b1b1b7'

  return (
    <>
      {/* Linha visível com step routing */}
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        className="react-flow__edge-path"
        markerEnd={markerEnd}
      />
      {/* Hit areas por sub-segmento do step routing */}
      {stepSegs.map((seg, i) => {
        const isH = Math.abs(seg.to.y - seg.from.y) < AXIS_THRESH
        return (
          <line
            key={i}
            x1={seg.from.x} y1={seg.from.y}
            x2={seg.to.x} y2={seg.to.y}
            stroke="transparent"
            strokeWidth={15}
            style={{ cursor: isH ? 'ns-resize' : 'ew-resize' }}
            onPointerDown={onSegPointerDown(seg.ptsIdx, isH)}
            onDoubleClick={e => onSegDblClick(seg.ptsIdx, e)}
          />
        )
      })}
      {/* Pontos de dobra — visíveis apenas ao selecionar */}
      {selected && waypoints.map((wp, i) => (
        <circle
          key={i}
          cx={wp.x}
          cy={wp.y}
          r={3}
          fill="white"
          stroke={stroke}
          strokeWidth={1.5}
          style={{ cursor: 'move' }}
          onPointerDown={onWpPointerDown(i)}
          onDoubleClick={onWpDblClick(i)}
        />
      ))}
    </>
  )
}
