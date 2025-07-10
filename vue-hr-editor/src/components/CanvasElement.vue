<template>
  <div
    :class="elementClasses"
    :style="elementStyles"
    @click="handleClick"
    @mousedown="handleMouseDown"
  >
    <!-- Text Element -->
    <div
      v-if="element.type === 'text'"
      class="text-editable"
      contenteditable
      @focus="isEditing = true"
      @blur="handleTextBlur"
      @input="handleTextInput"
    >
      {{ element.content }}
    </div>

    <!-- Image Element -->
    <div
      v-else-if="element.type === 'image'"
      class="image-container"
      :class="{ selected: selected }"
    >
      <img
        :src="element.content"
        :alt="element.content"
        class="image-element"
        :style="imageStyles"
      />
      <!-- Image Resize Handles -->
      <div
        v-for="direction in ['nw', 'ne', 'sw', 'se']"
        :key="direction"
        :class="`image-resize-handle ${direction}`"
        @mousedown="startImageResize($event, direction)"
      ></div>
    </div>

    <!-- Placeholder Element -->
    <input
      v-else-if="element.type === 'placeholder'"
      v-model="placeholderValue"
      class="placeholder-element"
      type="text"
      @focus="isEditing = true"
      @blur="isEditing = false"
      @input="handlePlaceholderInput"
    />

    <!-- Image Placeholder Element -->
    <div
      v-else-if="element.type === 'image-placeholder'"
      class="image-placeholder-element"
    >
      {{ element.content }}
      <div class="image-size-controls">
        <span>Size:</span>
        <input
          type="number"
          v-model.number="imagePlaceholderWidth"
          min="50"
          max="500"
          @change="updateImagePlaceholderSize"
        />
        <span>x</span>
        <input
          type="number"
          v-model.number="imagePlaceholderHeight"
          min="50"
          max="500"
          @change="updateImagePlaceholderSize"
        />
        <span>px</span>
      </div>
    </div>

    <!-- Horizontal Line -->
    <div
      v-else-if="element.type === 'horizontal-line'"
      class="horizontal-line-element"
      :style="lineStyles"
    ></div>

    <!-- Vertical Line -->
    <div
      v-else-if="element.type === 'vertical-line'"
      class="vertical-line-element"
      :style="lineStyles"
    ></div>

    <!-- Table Element -->
    <table
      v-else-if="element.type === 'table'"
      class="table-element"
    >
      <tr v-for="(row, i) in tableData.rows" :key="i">
        <td
          v-for="(cell, j) in row"
          :key="j"
          contenteditable
          :class="{ 'selected-cell': tableData.selectedCell?.row === i && tableData.selectedCell?.col === j }"
          @click="selectTableCell(i, j)"
          @input="updateTableCell(i, j, $event)"
        >
          {{ cell.content }}
          <!-- Table Cell Resize Handles -->
          <div
            v-if="j < row.length - 1"
            class="table-cell-resize-handle width-handle"
            @mousedown="startCellWidthResize($event, i, j)"
          ></div>
          <div
            v-if="i < tableData.rows.length - 1"
            class="table-cell-resize-handle height-handle"
            @mousedown="startCellHeightResize($event, i, j)"
          ></div>
          <div
            v-if="j < row.length - 1 && i < tableData.rows.length - 1"
            class="table-cell-resize-handle corner-handle"
            @mousedown="startCellCornerResize($event, i, j)"
          ></div>
        </td>
      </tr>
    </table>

    <!-- Delete Button -->
    <button
      class="delete-btn"
      @click="$emit('delete', element.id)"
      v-show="selected"
    >
      ×
    </button>

    <!-- Resize Handles -->
    <div
      v-for="direction in ['nw', 'ne', 'sw', 'se']"
      :key="direction"
      :class="`resize-handle resize-${direction}`"
      @mousedown="startResize($event, direction)"
      v-show="selected && element.type !== 'image'"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import type { CanvasElement, TableData } from '../types'

interface Props {
  element: CanvasElement
  selected: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [id: string, multiSelect?: boolean]
  delete: [id: string]
  update: [id: string, updates: Partial<CanvasElement>]
}>()

// Reactive state
const isEditing = ref(false)
const isDragging = ref(false)
const placeholderValue = ref(props.element.content)
const imagePlaceholderWidth = ref(props.element.dimensions?.width || 120)
const imagePlaceholderHeight = ref(props.element.dimensions?.height || 150)

// Table data initialization
const createInitialTableData = (): TableData => ({
  rows: [
    [
      { id: 'cell-0-0', content: 'Cell 1,1', styles: {} },
      { id: 'cell-0-1', content: 'Cell 1,2', styles: {} }
    ],
    [
      { id: 'cell-1-0', content: 'Cell 2,1', styles: {} },
      { id: 'cell-1-1', content: 'Cell 2,2', styles: {} }
    ]
  ]
})

const tableData = reactive<TableData>(createInitialTableData())

// Computed properties
const elementClasses = computed(() => [
  'canvas-element',
  {
    'selected': props.selected,
    'editing': isEditing.value,
    'dragging': isDragging.value
  }
])

const elementStyles = computed(() => ({
  left: `${props.element.position.x}px`,
  top: `${props.element.position.y}px`,
  width: props.element.dimensions?.width ? `${props.element.dimensions.width}px` : 'auto',
  height: props.element.dimensions?.height ? `${props.element.dimensions.height}px` : 'auto',
  ...props.element.styles
}))

const imageStyles = computed(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain' as const
}))

const lineStyles = computed(() => {
  if (props.element.type === 'horizontal-line') {
    return {
      width: `${props.element.dimensions?.width || 200}px`,
      height: `${props.element.dimensions?.height || 2}px`,
      backgroundColor: '#333'
    }
  } else if (props.element.type === 'vertical-line') {
    return {
      width: `${props.element.dimensions?.width || 2}px`,
      height: `${props.element.dimensions?.height || 100}px`,
      backgroundColor: '#333'
    }
  }
  return {}
})

// Methods
const handleClick = (e: MouseEvent) => {
  e.stopPropagation()
  emit('select', props.element.id, e.ctrlKey || e.metaKey)
}

const handleMouseDown = (e: MouseEvent) => {
  if (
    e.target instanceof HTMLElement &&
    (e.target.classList.contains('resize-handle') ||
     e.target.classList.contains('text-editable') ||
     e.target.classList.contains('placeholder-element') ||
     e.target.tagName === 'INPUT' ||
     e.target.tagName === 'BUTTON' ||
     e.target.contentEditable === 'true')
  ) {
    return
  }

  isDragging.value = true
  // Drag logic will be handled by parent component
}

const handleTextBlur = (e: Event) => {
  isEditing.value = false
  const target = e.target as HTMLElement
  const newContent = target.textContent || ''
  
  if (newContent.trim() === '') {
    target.textContent = 'Click to edit text...'
  }
  
  emit('update', props.element.id, { content: newContent })
}

const handleTextInput = (e: Event) => {
  const target = e.target as HTMLElement
  emit('update', props.element.id, { content: target.textContent || '' })
}

const handlePlaceholderInput = () => {
  emit('update', props.element.id, { content: placeholderValue.value })
}

const updateImagePlaceholderSize = () => {
  emit('update', props.element.id, {
    dimensions: {
      width: imagePlaceholderWidth.value,
      height: imagePlaceholderHeight.value
    }
  })
}

const selectTableCell = (row: number, col: number) => {
  tableData.selectedCell = { row, col }
}

const updateTableCell = (row: number, col: number, e: Event) => {
  const target = e.target as HTMLElement
  tableData.rows[row][col].content = target.textContent || ''
}

const startResize = (e: MouseEvent, _direction: string) => {
  e.preventDefault()
  e.stopPropagation()
  // Resize logic to be implemented
}

const startImageResize = (e: MouseEvent, _direction: string) => {
  e.preventDefault()
  e.stopPropagation()
  // Image resize logic to be implemented
}

const startCellWidthResize = (e: MouseEvent, _row: number, _col: number) => {
  e.preventDefault()
  e.stopPropagation()
  // Cell width resize logic to be implemented
}

const startCellHeightResize = (e: MouseEvent, _row: number, _col: number) => {
  e.preventDefault()
  e.stopPropagation()
  // Cell height resize logic to be implemented
}

const startCellCornerResize = (e: MouseEvent, _row: number, _col: number) => {
  e.preventDefault()
  e.stopPropagation()
  // Cell corner resize logic to be implemented
}

// Watch for prop changes
watch(() => props.element.content, (newContent) => {
  if (props.element.type === 'placeholder') {
    placeholderValue.value = newContent
  }
})
</script>

<style scoped>
.canvas-element {
  position: absolute;
  cursor: move;
  user-select: none;
}

.canvas-element.selected {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

.canvas-element.editing {
  cursor: default;
}

.text-editable {
  min-width: 50px;
  min-height: 20px;
  padding: 4px;
  cursor: text;
  outline: none;
}

.text-editable:focus {
  background-color: #f8f9fa;
  border: 1px solid #007bff;
}

.placeholder-element {
  background: linear-gradient(45deg, #fff3cd, #ffeaa7);
  color: #856404;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  border: 1px solid #ffeaa7;
  outline: none;
}

.image-container {
  position: relative;
  border: 2px solid transparent;
}

.image-container.selected {
  border-color: #007bff;
  border-style: dashed;
}

.image-placeholder-element {
  background: linear-gradient(45deg, #e3f2fd, #bbdefb);
  color: #1976d2;
  padding: 20px;
  border-radius: 8px;
  font-weight: bold;
  border: 2px dashed #2196f3;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  min-height: 150px;
}

.image-size-controls {
  margin-top: 10px;
  font-size: 10px;
}

.image-size-controls input {
  width: 40px;
  margin: 0 2px;
  padding: 2px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.horizontal-line-element,
.vertical-line-element {
  border-radius: 1px;
}

.table-element {
  border-collapse: collapse;
  background: white;
  border: 1px solid #333;
  width: 100%;
  height: 100%;
}

.table-element td {
  border: 1px solid #333;
  padding: 8px;
  min-width: 80px;
  min-height: 30px;
  vertical-align: top;
  position: relative;
  transition: background-color 0.2s ease;
}

.table-element td:hover {
  background-color: rgba(40, 167, 69, 0.05);
}

.table-element td.selected-cell {
  background-color: rgba(40, 167, 69, 0.1);
  outline: 2px solid #28a745;
  outline-offset: -2px;
}

.delete-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #dc3545;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  z-index: 10;
}

.delete-btn:hover {
  background: #c82333;
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #007bff;
  border: 1px solid white;
  border-radius: 50%;
  z-index: 10;
}

.resize-nw {
  top: -4px;
  left: -4px;
  cursor: nw-resize;
}

.resize-ne {
  top: -4px;
  right: -4px;
  cursor: ne-resize;
}

.resize-sw {
  bottom: -4px;
  left: -4px;
  cursor: sw-resize;
}

.resize-se {
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
}

.image-resize-handle {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #007bff;
  border: 2px solid white;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10;
}

.image-container:hover .image-resize-handle,
.image-container.selected .image-resize-handle {
  opacity: 1;
}

.image-resize-handle:hover {
  background: #0056b3;
  transform: scale(1.2);
}

.table-cell-resize-handle {
  position: absolute;
  background: #28a745;
  border: 1px solid white;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 15;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.table-element td:hover .table-cell-resize-handle {
  opacity: 1;
}

.table-cell-resize-handle.width-handle {
  width: 8px;
  height: 30px;
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
  cursor: ew-resize;
}

.table-cell-resize-handle.height-handle {
  width: 20px;
  height: 4px;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  cursor: ns-resize;
}

.table-cell-resize-handle.corner-handle {
  width: 8px;
  height: 8px;
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
  border-radius: 50%;
}
</style>