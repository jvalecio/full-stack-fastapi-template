export const GRID = 25
export const UNIT = 50

export function snap(v: number): number {
  return Math.round(v / GRID) * GRID
}

export function snapPt(pt: { x: number; y: number }): { x: number; y: number } {
  return { x: snap(pt.x), y: snap(pt.y) }
}
