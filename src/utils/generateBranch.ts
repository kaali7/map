import type { MindElixirInstance } from '..'
import { DirectionClass } from '../types/index'

export interface MainLineParams {
  pT: number
  pL: number
  pW: number
  pH: number
  cT: number
  cL: number
  cW: number
  cH: number
  direction: DirectionClass
  containerHeight: number
}

export interface SubLineParams {
  pT: number
  pL: number
  pW: number
  pH: number
  cT: number
  cL: number
  cW: number
  cH: number
  direction: DirectionClass
  isFirst: boolean | undefined
}

// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#path_commands

export function main({ pT, pL, pW, pH, cT, cL, cW, cH, direction, containerHeight }: MainLineParams) {
  let x1 = pL + pW / 2
  const y1 = pT + pH / 2
  let x2
  if (direction === DirectionClass.LHS) {
    x2 = cL + cW
  } else {
    x2 = cL
  }
  const y2 = cT + cH / 2
  const pct = Math.abs(y2 - y1) / containerHeight
  const offset = (1 - pct) * 0.25 * (pW / 2)
  if (direction === DirectionClass.LHS) {
    x1 = x1 - pW / 10 - offset
  } else {
    x1 = x1 + pW / 10 + offset
  }
  const xControl = x1 + (x2 - x1) / 2
  return `M ${x1} ${y1} C ${xControl} ${y1} ${xControl} ${y2} ${x2} ${y2}`
}

export function sub(this: MindElixirInstance, { pT, pL, pW, pH, cT, cL, cW, cH, direction }: SubLineParams) {
  const y1 = pT + pH / 2
  const y2 = cT + cH / 2

  if (direction === DirectionClass.LHS) {
    const x1 = pL
    const x2 = cL + cW
    const xControl = (x1 + x2) / 2
    return `M ${x1} ${y1} C ${xControl} ${y1} ${xControl} ${y2} ${x2} ${y2}`
  } else {
    const x1 = pL + pW
    const x2 = cL
    const xControl = (x1 + x2) / 2
    return `M ${x1} ${y1} C ${xControl} ${y1} ${xControl} ${y2} ${x2} ${y2}`
  }
}
