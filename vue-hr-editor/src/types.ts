export interface ElementPosition {
  x: number
  y: number
}

export interface ElementDimensions {
  width: number
  height: number
}

export interface CanvasElement {
  id: string
  type: 'text' | 'image' | 'placeholder' | 'image-placeholder' | 'horizontal-line' | 'vertical-line' | 'table'
  content: string
  position: ElementPosition
  dimensions?: ElementDimensions
  selected: boolean
  styles?: Record<string, string>
}

export interface ImageModalData {
  isOpen: boolean
  sourceType: 'upload' | 'url'
  url: string
  width: number
  height: number
}

export interface TableCell {
  id: string
  content: string
  styles: Record<string, string>
}

export interface TableData {
  rows: TableCell[][]
  selectedCell?: { row: number, col: number }
}

export interface Group {
  id: string
  elements: string[]
  position: ElementPosition
  dimensions: ElementDimensions
}

export interface PageSize {
  name: string
  width: string
  height: string
  className: string
}

export interface DragState {
  isDragging: boolean
  draggedItem: any
  dragOffset: ElementPosition
}