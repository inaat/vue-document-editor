<template>
  <div 
    ref="canvasRef"
    :class="[
      'canvas',
      pageSize,
      { 'landscape': orientation === 'Landscape' },
      { 'show-page-border': showPageBorder }
    ]"
    @drop="handleDrop"
    @dragover="handleDragOver"
    @click="handleCanvasClick"
  >
    <div 
      v-if="showGrid"
      class="grid-overlay"
    />
    
    <div 
      v-if="showRuler"
      class="ruler-overlay"
    >
      <div class="ruler-horizontal" />
      <div class="ruler-vertical" />
    </div>
    
    <div
      v-for="element in elements"
      :key="element.id"
      :ref="el => elementRefs[element.id] = el"
      :class="[
        'canvas-element',
        element.type,
        { 'selected': selectedElements.includes(element.id) }
      ]"
      :style="elementStyle(element)"
      @click.stop="selectElement(element, $event)"
      @mousedown="handleElementMouseDown($event, element)"
    >
      <div
        v-if="element.type === 'text'"
        :contenteditable="true"
        class="text-editable"
        :style="{ direction: element.direction || 'ltr' }"
        @blur="updateElementText(element, $event)"
        v-html="element.content"
      />
      <div
        v-else-if="element.type === 'formatted-text'"
        :contenteditable="true"
        class="text-editable formatted-text"
        @blur="updateElementText(element, $event)"
        v-html="element.content"
      />
      <div
        v-else-if="element.type === 'placeholder'"
        :contenteditable="true"
        class="placeholder-content editable-placeholder"
        :style="{ direction: element.direction || 'ltr' }"
        @blur="updateElementText(element, $event)"
        @focus="handlePlaceholderFocus(element, $event)"
        @dblclick="enableRichEdit(element, $event)"
        @keydown="handleKeydown($event)"
        :title="'Double-click to edit. Current: ' + element.content"
      >
        {{ element.content }}
      </div>
      <img
        v-else-if="element.type === 'image'"
        :src="element.src"
        :alt="element.alt || 'Image'"
        class="image-content"
      />
      <div
        v-else-if="element.type === 'line'"
        :class="['line-content', element.lineType]"
      />
      <div v-else-if="element.type === 'table'" class="table-container">
        <!-- Row Controls (Left side) -->
        <div 
          v-if="selectedElements.includes(element.id)"
          class="table-row-controls"
        >
          <button
            v-for="(row, rowIndex) in element.rows"
            :key="`row-${rowIndex}`"
            class="table-control-btn row-control"
            :style="{ 
              top: (rowIndex * (element.height / element.rows.length)) + 'px',
              height: (element.height / element.rows.length) + 'px'
            }"
            @click.stop="addTableRowAt(element, rowIndex)"
            title="Add row below"
          >
            +
          </button>
          <button
            class="table-control-btn row-control delete-row"
            v-if="element.rows.length > 1"
            :style="{ 
              top: element.height + 'px'
            }"
            @click.stop="deleteLastTableRow(element)"
            title="Delete last row"
          >
            −
          </button>
        </div>

        <table
          class="table-content"
          :style="{ 
            direction: element.direction || 'ltr',
            border: element.tableBorder?.style !== 'none' ? 
              `${element.tableBorder?.width || 1}px ${element.tableBorder?.style || 'solid'} ${element.tableBorder?.color || '#000000'}` : 
              'none'
          }"
        >
          <tr v-for="(row, rowIndex) in element.rows" :key="rowIndex">
            <td
              v-for="(cell, colIndex) in row"
              :key="colIndex"
              v-show="!isCellHidden(element, rowIndex, colIndex)"
              :contenteditable="true"
              :colspan="getCellColspan(element, rowIndex, colIndex)"
              :rowspan="getCellRowspan(element, rowIndex, colIndex)"
              :style="{
                textAlign: getCellAlignment(element, rowIndex, colIndex),
                direction: element.direction || 'ltr',
                border: element.cellBorders?.style !== 'none' ? 
                  `${element.cellBorders?.width || 1}px ${element.cellBorders?.style || 'solid'} ${element.cellBorders?.color || '#cccccc'}` : 
                  'none',
                backgroundColor: getCellBackgroundColor(element, rowIndex, colIndex)
              }"
              @blur="updateTableCell(element, rowIndex, colIndex, $event)"
              @click="selectTableCell(element, rowIndex, colIndex, $event)"
              @contextmenu="showTableContextMenu($event, element, rowIndex, colIndex)"
              :class="{ 'selected-cell': isSelectedCell(element, rowIndex, colIndex) }"
            >
              {{ cell }}
            </td>
          </tr>
        </table>

        <!-- Column Controls (Top) -->
        <div 
          v-if="selectedElements.includes(element.id)"
          class="table-column-controls"
        >
          <button
            v-for="(cell, colIndex) in element.rows[0]"
            :key="`col-${colIndex}`"
            class="table-control-btn column-control"
            :style="{ 
              left: (colIndex * (element.width / element.rows[0].length)) + 'px',
              width: (element.width / element.rows[0].length) + 'px'
            }"
            @click.stop="addTableColumnAt(element, colIndex)"
            title="Add column right"
          >
            +
          </button>
          <button
            class="table-control-btn column-control delete-column"
            v-if="element.rows[0].length > 1"
            :style="{ 
              left: element.width + 'px'
            }"
            @click.stop="deleteLastTableColumn(element)"
            title="Delete last column"
          >
            −
          </button>
        </div>

        <!-- Border Controls (Bottom Right) -->
        <div 
          v-if="selectedElements.includes(element.id)"
          class="table-border-controls"
          @click.stop
          @mousedown.stop
        >
          <div class="border-control-group">
            <label class="border-label">Table Border:</label>
            <select
              class="border-style-select"
              :value="element.tableBorder?.style || 'none'"
              @change.stop="updateTableBorderStyle(element, $event.target.value)"
              @click.stop
              @mousedown.stop
              title="Border style"
            >
              <option value="none">None</option>
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
            <input
              v-if="element.tableBorder?.style !== 'none'"
              type="range"
              min="1"
              max="5"
              :value="element.tableBorder?.width || 1"
              @input.stop="updateTableBorderWidth(element, $event.target.value)"
              @click.stop
              @mousedown.stop
              class="border-width-slider"
              title="Border width"
            />
            <input
              v-if="element.tableBorder?.style !== 'none'"
              type="color"
              :value="element.tableBorder?.color || '#000000'"
              @input.stop="updateTableBorderColor(element, $event.target.value)"
              @click.stop
              @mousedown.stop
              class="border-color-picker"
              title="Border color"
            />
          </div>
          
          <div class="border-control-group">
            <label class="border-label">Cell Borders:</label>
            <select
              class="border-style-select"
              :value="element.cellBorders?.style || 'solid'"
              @change.stop="updateCellBorderStyle(element, $event.target.value)"
              @click.stop
              @mousedown.stop
              title="Border style"
            >
              <option value="none">None</option>
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
            <input
              v-if="element.cellBorders?.style !== 'none'"
              type="range"
              min="1"
              max="3"
              :value="element.cellBorders?.width || 1"
              @input.stop="updateCellBorderWidth(element, $event.target.value)"
              @click.stop
              @mousedown.stop
              class="border-width-slider"
              title="Border width"
            />
            <input
              v-if="element.cellBorders?.style !== 'none'"
              type="color"
              :value="element.cellBorders?.color || '#cccccc'"
              @input.stop="updateCellBorderColor(element, $event.target.value)"
              @click.stop
              @mousedown.stop
              class="border-color-picker"
              title="Border color"
            />
          </div>

          <!-- Cell Merge Controls -->
          <div class="border-control-group">
            <label class="border-label">Cell Merge:</label>
            <button
              class="merge-btn"
              @click.stop="mergeCellsRight(element)"
              @mousedown.stop
              :disabled="!canMergeRight(element)"
              title="Merge with right cell"
            >
              →
            </button>
            <button
              class="merge-btn"
              @click.stop="mergeCellsDown(element)"
              @mousedown.stop
              :disabled="!canMergeDown(element)"
              title="Merge with cell below"
            >
              ↓
            </button>
            <button
              class="merge-btn unmerge"
              @click.stop="unmergeCell(element)"
              @mousedown.stop
              :disabled="!canUnmerge(element)"
              title="Unmerge cell"
            >
              ⊞
            </button>
          </div>

          <!-- Cell Color Controls -->
          <div class="border-control-group" v-if="selectedTableCell">
            <label class="border-label">Cell Color:</label>
            <input
              type="color"
              :value="getCellBackgroundColor(element, selectedTableCell.rowIndex, selectedTableCell.colIndex)"
              @input.stop="updateCellBackgroundColor(element, selectedTableCell.rowIndex, selectedTableCell.colIndex, $event.target.value)"
              @click.stop
              @mousedown.stop
              class="border-color-picker"
              title="Cell background color"
            />
            <button
              class="clear-color-btn"
              @click.stop="clearCellBackgroundColor(element, selectedTableCell.rowIndex, selectedTableCell.colIndex)"
              @mousedown.stop
              title="Remove background color"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
      
      <!-- Delete button -->
      <button
        v-if="selectedElements.includes(element.id)"
        class="delete-btn"
        @click.stop="deleteElement(element)"
        title="Delete element"
      >
        ×
      </button>
      
      <div
        v-if="selectedElements.includes(element.id)"
        class="resize-handles"
      >
        <div
          v-for="handle in resizeHandles"
          :key="handle"
          :class="['resize-handle', handle]"
          @mousedown.stop="startResize($event, element, handle)"
        />
      </div>
    </div>
    
    <!-- Table Context Menu -->
    <div
      v-if="showContextMenu"
      class="table-context-menu"
      :style="{ 
        position: 'absolute',
        left: contextMenuPosition.x + 'px',
        top: contextMenuPosition.y + 'px',
        zIndex: 1000
      }"
      @click.stop
    >
      <div class="context-menu-item" @click="addTableRow">
        <span>Add Row Below</span>
      </div>
      <div class="context-menu-item" @click="addTableColumn">
        <span>Add Column Right</span>
      </div>
      <div class="context-menu-item" @click="deleteTableRow">
        <span>Delete Row</span>
      </div>
      <div class="context-menu-item" @click="deleteTableColumn">
        <span>Delete Column</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onUnmounted } from 'vue'
import mammoth from 'mammoth'

export default {
  name: 'CanvasElement',
  props: {
    pageSize: {
      type: String,
      default: 'a4'
    },
    orientation: {
      type: String,
      default: 'Portrait'
    },
    showGrid: {
      type: Boolean,
      default: false
    },
    showRuler: {
      type: Boolean,
      default: false
    },
    showPageBorder: {
      type: Boolean,
      default: false
    }
  },
  emits: ['element-selected', 'elements-selected'],
  setup(props, { emit }) {
    const canvasRef = ref(null)
    const elementRefs = ref({})
    const elements = ref([])
    const selectedElements = ref([])
    const elementCounter = ref(0)
    const isDragging = ref(false)
    const isResizing = ref(false)
    const dragOffset = ref({ x: 0, y: 0 })
    const draggedElement = ref(null)
    const resizeElement = ref(null)
    const resizeHandle = ref('')
    const resizeHandles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']
    const selectedTableCell = ref(null) // { elementId, rowIndex, colIndex }
    const showContextMenu = ref(false)
    const contextMenuPosition = ref({ x: 0, y: 0 })
    const dragInitialPositions = ref([])

    const elementStyle = (element) => {
      return {
        left: element.x + 'px',
        top: element.y + 'px',
        width: element.width + 'px',
        height: element.height + 'px',
        fontSize: element.fontSize + 'px',
        color: element.color,
        backgroundColor: element.backgroundColor,
        textAlign: element.textAlign,
        fontWeight: element.fontWeight,
        fontStyle: element.fontStyle,
        textDecoration: element.textDecoration,
        fontFamily: element.fontFamily,
        zIndex: element.zIndex
      }
    }

    const addTextElement = (text = 'Click to edit text...') => {
      const rect = canvasRef.value.getBoundingClientRect()
      const x = Math.random() * (rect.width - 200) + 50
      const y = Math.random() * (rect.height - 100) + 50
      
      createElement('text', text, x, y)
    }

    const addImageElement = (imageData) => {
      const rect = canvasRef.value.getBoundingClientRect()
      const x = Math.random() * (rect.width - imageData.width) + 50
      const y = Math.random() * (rect.height - imageData.height) + 50
      
      createElement('image', '', x, y, {
        src: imageData.src,
        alt: imageData.alt,
        width: imageData.width,
        height: imageData.height
      })
    }

    const addHorizontalLine = () => {
      const rect = canvasRef.value.getBoundingClientRect()
      const x = Math.random() * (rect.width - 200) + 50
      const y = Math.random() * (rect.height - 50) + 50
      
      createElement('line', '', x, y, {
        lineType: 'horizontal',
        width: 200,
        height: 2
      })
    }

    const addVerticalLine = () => {
      const rect = canvasRef.value.getBoundingClientRect()
      const x = Math.random() * (rect.width - 50) + 50
      const y = Math.random() * (rect.height - 200) + 50
      
      createElement('line', '', x, y, {
        lineType: 'vertical',
        width: 2,
        height: 200
      })
    }

    const addTable = () => {
      const rect = canvasRef.value.getBoundingClientRect()
      const x = Math.random() * (rect.width - 300) + 50
      const y = Math.random() * (rect.height - 150) + 50
      
      createElement('table', '', x, y, {
        rows: [
          ['Header 1', 'Header 2', 'Header 3'],
          ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
          ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3']
        ],
        width: 300,
        height: 150,
        direction: 'ltr',
        cellAlignments: {
          '0-0': 'center', '0-1': 'center', '0-2': 'center', // Headers centered
          '1-0': 'left', '1-1': 'left', '1-2': 'left',     // Data left aligned
          '2-0': 'left', '2-1': 'left', '2-2': 'left'
        },
        // Border properties
        tableBorder: {
          width: 1,
          style: 'solid',
          color: '#000000'
        },
        cellBorders: {
          width: 1,
          style: 'solid',
          color: '#cccccc'
        },
        // Merge properties
        mergedCells: {}, // { 'row-col': { colspan: 2, rowspan: 1 } }
        hiddenCells: new Set(), // Set of 'row-col' strings for cells hidden by merges
        // Cell colors
        cellColors: {} // { 'row-col': '#ffffff' }
      })
    }

    const createElement = (type, content, x, y, options = {}) => {
      elementCounter.value++
      const width = options.width || 200
      const height = options.height || 30
      
      // Get canvas dimensions
      const canvasWidth = canvasRef.value ? canvasRef.value.offsetWidth : 800
      const canvasHeight = canvasRef.value ? canvasRef.value.offsetHeight : 600
      
      // Restrict position to canvas bounds
      const constrainedX = Math.max(0, Math.min(x, canvasWidth - width))
      const constrainedY = Math.max(0, Math.min(y, canvasHeight - height))
      
      const element = {
        id: `element-${elementCounter.value}`,
        type,
        content,
        x: constrainedX,
        y: constrainedY,
        width,
        height,
        fontSize: options.fontSize || 16,
        color: options.color || '#000000',
        backgroundColor: options.backgroundColor || 'transparent',
        textAlign: options.textAlign || 'left',
        fontWeight: options.fontWeight || 'normal',
        fontStyle: options.fontStyle || 'normal',
        textDecoration: options.textDecoration || 'none',
        fontFamily: options.fontFamily || 'Arial, sans-serif',
        zIndex: options.zIndex || 1,
        ...options
      }
      
      elements.value.push(element)
      return element
    }

    const selectElement = (element, event) => {
      if (event?.ctrlKey || event?.metaKey) {
        // Multi-select mode
        if (selectedElements.value.includes(element.id)) {
          // Remove from selection
          selectedElements.value = selectedElements.value.filter(id => id !== element.id)
        } else {
          // Add to selection
          selectedElements.value = [...selectedElements.value, element.id]
        }
      } else {
        // Single select mode - always replace selection
        selectedElements.value = [element.id]
      }
      
      // Emit selection events
      emit('element-selected', selectedElements.value.length === 1 ? element : null)
      emit('elements-selected', selectedElements.value.map(id => elements.value.find(el => el.id === id)))
    }

    const handleCanvasClick = (event) => {
      showContextMenu.value = false
      if (event.target === canvasRef.value) {
        selectedElements.value = []
        emit('element-selected', null)
        emit('elements-selected', [])
      }
    }

    const handleElementMouseDown = (event, element) => {
      // Don't interfere with contenteditable elements - allow natural editing
      if (event.target.contentEditable === 'true' || 
          event.target.tagName === 'INPUT' || 
          event.target.tagName === 'TEXTAREA') {
        return
      }
      
      // Don't start drag on multi-select actions
      if (event.ctrlKey || event.metaKey) {
        return
      }
      
      // Only initiate drag for non-editable areas
      startDrag(event, element)
    }

    const startDrag = (event, element) => {
      // Don't start drag if we're already dragging
      if (isDragging.value) {
        return
      }
      
      // If element is not selected, select it first
      if (!selectedElements.value.includes(element.id)) {
        selectedElements.value = [element.id]
      }
      
      isDragging.value = true
      draggedElement.value = element
      
      const rect = canvasRef.value.getBoundingClientRect()
      dragOffset.value = {
        x: event.clientX - rect.left - element.x,
        y: event.clientY - rect.top - element.y
      }
      
      // Store initial positions for all selected elements
      dragInitialPositions.value = selectedElements.value.map(id => {
        const el = elements.value.find(e => e.id === id)
        return el ? { id: el.id, x: el.x, y: el.y } : null
      }).filter(Boolean)
      
      document.addEventListener('mousemove', handleDragMove)
      document.addEventListener('mouseup', handleDragEnd)
    }

    const handleDragMove = (event) => {
      if (!isDragging.value || !draggedElement.value) return
      
      const rect = canvasRef.value.getBoundingClientRect()
      const newX = event.clientX - rect.left - dragOffset.value.x
      const newY = event.clientY - rect.top - dragOffset.value.y
      
      // Calculate the delta movement
      const deltaX = newX - draggedElement.value.x
      const deltaY = newY - draggedElement.value.y
      
      // Move all selected elements by the same delta
      const canvasWidth = canvasRef.value.offsetWidth
      const canvasHeight = canvasRef.value.offsetHeight
      
      selectedElements.value.forEach(id => {
        const element = elements.value.find(el => el.id === id)
        if (element) {
          const newX = element.x + deltaX
          const newY = element.y + deltaY
          
          // Restrict to canvas bounds
          element.x = Math.max(0, Math.min(newX, canvasWidth - element.width))
          element.y = Math.max(0, Math.min(newY, canvasHeight - element.height))
        }
      })
    }

    const handleDragEnd = () => {
      isDragging.value = false
      draggedElement.value = null
      document.removeEventListener('mousemove', handleDragMove)
      document.removeEventListener('mouseup', handleDragEnd)
    }

    const startResize = (event, element, handle) => {
      isResizing.value = true
      resizeElement.value = element
      resizeHandle.value = handle
      document.addEventListener('mousemove', handleResizeMove)
      document.addEventListener('mouseup', handleResizeEnd)
    }

    const handleResizeMove = (event) => {
      if (!isResizing.value || !resizeElement.value) return
      
      const rect = canvasRef.value.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      
      const element = resizeElement.value
      const handle = resizeHandle.value
      
      if (handle.includes('e')) {
        element.width = Math.max(50, x - element.x)
      }
      if (handle.includes('w')) {
        const newWidth = element.width + (element.x - x)
        if (newWidth > 50) {
          element.width = newWidth
          element.x = x
        }
      }
      if (handle.includes('s')) {
        element.height = Math.max(20, y - element.y)
      }
      if (handle.includes('n')) {
        const newHeight = element.height + (element.y - y)
        if (newHeight > 20) {
          element.height = newHeight
          element.y = y
        }
      }
    }

    const handleResizeEnd = () => {
      isResizing.value = false
      resizeElement.value = null
      resizeHandle.value = ''
      document.removeEventListener('mousemove', handleResizeMove)
      document.removeEventListener('mouseup', handleResizeEnd)
    }

    const handleDrop = (event) => {
      event.preventDefault()
      const data = JSON.parse(event.dataTransfer.getData('application/json'))
      const rect = canvasRef.value.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      
      if (data.type === 'placeholder') {
        createElement('placeholder', data.content, x, y, { 
          width: 150, 
          height: 25,
          fontSize: 14,
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          color: '#6c757d'
        })
      } else if (data.type === 'text') {
        createElement('text', data.content, x, y)
      } else if (data.type === 'formatted-text') {
        const formatOptions = getFormatOptions(data.format)
        createElement('formatted-text', data.content, x, y, {
          ...formatOptions,
          format: data.format
        })
      } else if (data.type === 'image-placeholder') {
        createElement('placeholder', data.content, x, y, { 
          width: 150, 
          height: 150,
          fontSize: 14,
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          color: '#6c757d'
        })
      }
    }

    const handleDragOver = (event) => {
      event.preventDefault()
    }

    const updateElementText = (element, event) => {
      element.content = event.target.innerHTML
    }

    const updateTableCell = (element, rowIndex, colIndex, event) => {
      element.rows[rowIndex][colIndex] = event.target.textContent
    }

    const selectTableCell = (element, rowIndex, colIndex, event) => {
      event.stopPropagation()
      selectedTableCell.value = {
        elementId: element.id,
        rowIndex,
        colIndex
      }
    }

    const showTableContextMenu = (event, element, rowIndex, colIndex) => {
      event.preventDefault()
      event.stopPropagation()
      
      selectedTableCell.value = {
        elementId: element.id,
        rowIndex,
        colIndex
      }
      
      const rect = canvasRef.value.getBoundingClientRect()
      contextMenuPosition.value = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      }
      
      showContextMenu.value = true
    }

    const isSelectedCell = (element, rowIndex, colIndex) => {
      return selectedTableCell.value &&
             selectedTableCell.value.elementId === element.id &&
             selectedTableCell.value.rowIndex === rowIndex &&
             selectedTableCell.value.colIndex === colIndex
    }

    const getCellAlignment = (element, rowIndex, colIndex) => {
      const key = `${rowIndex}-${colIndex}`
      return element.cellAlignments?.[key] || 'left'
    }

    const setCellAlignment = (alignment) => {
      if (!selectedTableCell.value) return
      
      const element = elements.value.find(el => el.id === selectedTableCell.value.elementId)
      if (!element || element.type !== 'table') return
      
      if (!element.cellAlignments) {
        element.cellAlignments = {}
      }
      
      const key = `${selectedTableCell.value.rowIndex}-${selectedTableCell.value.colIndex}`
      element.cellAlignments[key] = alignment
    }

    const setTableDirection = (direction) => {
      selectedElements.value.forEach(id => {
        const element = elements.value.find(el => el.id === id)
        if (element && element.type === 'table') {
          element.direction = direction
        }
      })
    }

    const addTableRow = () => {
      if (!selectedTableCell.value) return
      
      const element = elements.value.find(el => el.id === selectedTableCell.value.elementId)
      if (!element || element.type !== 'table') return
      
      const rowIndex = selectedTableCell.value.rowIndex
      const columnCount = element.rows[0].length
      const newRow = new Array(columnCount).fill('New Cell')
      
      element.rows.splice(rowIndex + 1, 0, newRow)
      
      // Update cell alignments for new row
      if (element.cellAlignments) {
        const newAlignments = {}
        Object.keys(element.cellAlignments).forEach(key => {
          const [row, col] = key.split('-').map(Number)
          if (row > rowIndex) {
            newAlignments[`${row + 1}-${col}`] = element.cellAlignments[key]
          } else {
            newAlignments[key] = element.cellAlignments[key]
          }
        })
        element.cellAlignments = newAlignments
      }
      
      // Increase table height
      element.height = element.rows.length * 30
      
      showContextMenu.value = false
    }

    const addTableColumn = () => {
      if (!selectedTableCell.value) return
      
      const element = elements.value.find(el => el.id === selectedTableCell.value.elementId)
      if (!element || element.type !== 'table') return
      
      const colIndex = selectedTableCell.value.colIndex
      
      // Add new column to each row
      element.rows.forEach(row => {
        row.splice(colIndex + 1, 0, 'New Cell')
      })
      
      // Update cell alignments for new column
      if (element.cellAlignments) {
        const newAlignments = {}
        Object.keys(element.cellAlignments).forEach(key => {
          const [row, col] = key.split('-').map(Number)
          if (col > colIndex) {
            newAlignments[`${row}-${col + 1}`] = element.cellAlignments[key]
          } else {
            newAlignments[key] = element.cellAlignments[key]
          }
        })
        element.cellAlignments = newAlignments
      }
      
      // Increase table width
      element.width = element.rows[0].length * 100
      
      showContextMenu.value = false
    }

    const deleteTableRow = () => {
      if (!selectedTableCell.value) return
      
      const element = elements.value.find(el => el.id === selectedTableCell.value.elementId)
      if (!element || element.type !== 'table' || element.rows.length <= 1) return
      
      const rowIndex = selectedTableCell.value.rowIndex
      element.rows.splice(rowIndex, 1)
      
      // Update cell alignments after row deletion
      if (element.cellAlignments) {
        const newAlignments = {}
        Object.keys(element.cellAlignments).forEach(key => {
          const [row, col] = key.split('-').map(Number)
          if (row < rowIndex) {
            newAlignments[key] = element.cellAlignments[key]
          } else if (row > rowIndex) {
            newAlignments[`${row - 1}-${col}`] = element.cellAlignments[key]
          }
        })
        element.cellAlignments = newAlignments
      }
      
      // Decrease table height
      element.height = element.rows.length * 30
      
      // Clear selected cell if it was deleted
      if (selectedTableCell.value.rowIndex >= element.rows.length) {
        selectedTableCell.value = null
      }
      
      showContextMenu.value = false
    }

    const deleteTableColumn = () => {
      if (!selectedTableCell.value) return
      
      const element = elements.value.find(el => el.id === selectedTableCell.value.elementId)
      if (!element || element.type !== 'table' || element.rows[0].length <= 1) return
      
      const colIndex = selectedTableCell.value.colIndex
      
      // Remove column from each row
      element.rows.forEach(row => {
        row.splice(colIndex, 1)
      })
      
      // Update cell alignments after column deletion
      if (element.cellAlignments) {
        const newAlignments = {}
        Object.keys(element.cellAlignments).forEach(key => {
          const [row, col] = key.split('-').map(Number)
          if (col < colIndex) {
            newAlignments[key] = element.cellAlignments[key]
          } else if (col > colIndex) {
            newAlignments[`${row}-${col - 1}`] = element.cellAlignments[key]
          }
        })
        element.cellAlignments = newAlignments
      }
      
      // Decrease table width
      element.width = element.rows[0].length * 100
      
      // Clear selected cell if it was deleted
      if (selectedTableCell.value.colIndex >= element.rows[0].length) {
        selectedTableCell.value = null
      }
      
      showContextMenu.value = false
    }


    const getFormatOptions = (format) => {
      const formats = {
        h1: { fontSize: 32, fontWeight: 'bold', height: 40 },
        h2: { fontSize: 28, fontWeight: 'bold', height: 35 },
        h3: { fontSize: 24, fontWeight: 'bold', height: 30 },
        h4: { fontSize: 20, fontWeight: 'bold', height: 28 },
        h5: { fontSize: 16, fontWeight: 'bold', height: 25 },
        p: { fontSize: 16, fontWeight: 'normal', height: 25 },
        bold: { fontSize: 16, fontWeight: 'bold', height: 25 },
        italic: { fontSize: 16, fontStyle: 'italic', height: 25 },
        underline: { fontSize: 16, textDecoration: 'underline', height: 25 }
      }
      return formats[format] || { fontSize: 16, fontWeight: 'normal', height: 25 }
    }

    const handlePlaceholderFocus = (element, event) => {
      const target = event.target
      if (target.textContent.startsWith('{') && target.textContent.endsWith('}')) {
        target.style.color = '#007bff'
        target.style.backgroundColor = '#e7f3ff'
      }
    }

    const enableRichEdit = (element, event) => {
      const target = event.target
      target.style.minHeight = '30px'
      target.style.border = '2px solid #007bff'
      target.style.padding = '4px'
      target.style.borderRadius = '4px'
      target.focus()
      
      // Select all text for easy editing
      const range = document.createRange()
      range.selectNodeContents(target)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
    }

    const handleKeydown = (event) => {
      // Allow common formatting shortcuts
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'b':
            event.preventDefault()
            document.execCommand('bold')
            break
          case 'i':
            event.preventDefault()
            document.execCommand('italic')
            break
          case 'u':
            event.preventDefault()
            document.execCommand('underline')
            break
        }
      }
    }

    const applyHeading = (format) => {
      const selectedElement = elements.value.find(el => selectedElements.value.includes(el.id))
      if (!selectedElement || !['text', 'placeholder', 'formatted-text'].includes(selectedElement.type)) return
      
      const formats = {
        h1: { fontSize: 32, fontWeight: 'bold' },
        h2: { fontSize: 28, fontWeight: 'bold' },
        h3: { fontSize: 24, fontWeight: 'bold' },
        h4: { fontSize: 20, fontWeight: 'bold' },
        h5: { fontSize: 16, fontWeight: 'bold' },
        p: { fontSize: 16, fontWeight: 'normal' },
        pre: { fontSize: 12, fontFamily: 'Courier New, monospace' }
      }
      
      if (formats[format]) {
        Object.assign(selectedElement, formats[format])
      }
    }

    const applyTextColor = (color) => {
      selectedElements.value.forEach(id => {
        const element = elements.value.find(el => el.id === id)
        if (element) {
          element.color = color
        }
      })
    }

    const applyBackgroundColor = (color) => {
      selectedElements.value.forEach(id => {
        const element = elements.value.find(el => el.id === id)
        if (element) {
          element.backgroundColor = color
        }
      })
    }

    const formatSelected = (format) => {
      selectedElements.value.forEach(id => {
        const element = elements.value.find(el => el.id === id)
        if (element && ['text', 'placeholder', 'formatted-text'].includes(element.type)) {
          if (format === 'bold') {
            element.fontWeight = element.fontWeight === 'bold' ? 'normal' : 'bold'
          } else if (format === 'italic') {
            element.fontStyle = element.fontStyle === 'italic' ? 'normal' : 'italic'
          } else if (format === 'underline') {
            element.textDecoration = element.textDecoration === 'underline' ? 'none' : 'underline'
          }
        }
      })
    }

    const increaseFontSize = () => {
      selectedElements.value.forEach(id => {
        const element = elements.value.find(el => el.id === id)
        if (element && ['text', 'placeholder', 'formatted-text'].includes(element.type)) {
          element.fontSize = Math.min(72, element.fontSize + 2)
        }
      })
    }

    const decreaseFontSize = () => {
      selectedElements.value.forEach(id => {
        const element = elements.value.find(el => el.id === id)
        if (element && ['text', 'placeholder', 'formatted-text'].includes(element.type)) {
          element.fontSize = Math.max(8, element.fontSize - 2)
        }
      })
    }

    const alignText = (alignment) => {
      selectedElements.value.forEach(id => {
        const element = elements.value.find(el => el.id === id)
        if (element && ['text', 'placeholder', 'formatted-text'].includes(element.type)) {
          element.textAlign = alignment
        }
      })
    }

    const deleteElement = (element) => {
      elements.value = elements.value.filter(el => el.id !== element.id)
      selectedElements.value = selectedElements.value.filter(id => id !== element.id)
      emit('element-selected', null)
      emit('elements-selected', selectedElements.value.map(id => elements.value.find(el => el.id === id)))
    }

    const clearCanvas = () => {
      elements.value = []
      selectedElements.value = []
    }

    const generateHTML = () => {
      // Define page dimensions (in pixels at 96 DPI)
      const pageSizes = {
        'a4': { width: 794, height: 1123 },
        'a3': { width: 1123, height: 1587 },
        'a5': { width: 559, height: 794 },
        'letter': { width: 816, height: 1056 },
        'legal': { width: 816, height: 1344 },
        'tabloid': { width: 1056, height: 1632 },
        'business-card': { width: 336, height: 192 },
        'id-card': { width: 324, height: 204 },
        'badge': { width: 384, height: 288 },
        'postcard': { width: 576, height: 384 },
        'greeting-card': { width: 480, height: 672 },
        'certificate': { width: 1056, height: 816 }
      }
      
      // Get current page dimensions
      const currentPageSize = pageSizes[props.pageSize] || pageSizes['a4']
      let width = currentPageSize.width
      let height = currentPageSize.height
      
      // Swap dimensions for landscape
      if (props.orientation === 'Landscape') {
        [width, height] = [height, width]
      }
      
      let html = `<div class="hr-document" style="width: ${width}px; height: ${height}px; position: relative; background: white; margin: 0; padding: 0; box-sizing: border-box;">\n`
      
      console.log('🔥 Generated HTML dimensions:', { width, height, pageSize: props.pageSize, orientation: props.orientation })
      console.log('🔥 Elements positions:', elements.value.map(el => ({ id: el.id, x: el.x, y: el.y, width: el.width, height: el.height })))
      
      elements.value.forEach(element => {
        html += `  <div class="element element-${element.type}" style="position: absolute; left: ${element.x}px; top: ${element.y}px; width: ${element.width}px; height: ${element.height}px; font-size: ${element.fontSize}px; color: ${element.color}; background-color: ${element.backgroundColor}; text-align: ${element.textAlign}; font-weight: ${element.fontWeight}; font-style: ${element.fontStyle}; text-decoration: ${element.textDecoration}; font-family: ${element.fontFamily}; z-index: ${element.zIndex};">\n`
        
        if (element.type === 'text') {
          html += `    ${element.content}\n`
        } else if (element.type === 'placeholder') {
          html += `    ${element.content}\n`
        } else if (element.type === 'image') {
          html += `    <img src="${element.src}" alt="${element.alt || ''}" style="width: 100%; height: 100%; object-fit: cover;">\n`
        } else if (element.type === 'line') {
          html += `    <div class="line ${element.lineType}" style="width: 100%; height: 100%; background-color: ${element.color};"></div>\n`
        } else if (element.type === 'table') {
          html += `    <table style="width: 100%; height: 100%; border-collapse: collapse;">\n`
          element.rows.forEach(row => {
            html += `      <tr>\n`
            row.forEach(cell => {
              html += `        <td style="border: 1px solid #ccc; padding: 4px;">${cell}</td>\n`
            })
            html += `      </tr>\n`
          })
          html += `    </table>\n`
        }
        
        html += `  </div>\n`
      })
      
      html += '</div>'
      return html
    }

    const changePageSize = () => {
      // Implementation for changing page size
      console.log('Changing page size')
    }

    const addTestElements = () => {
      console.log('🔥 Adding corner test elements')
      
      // Get canvas dimensions
      const canvasWidth = canvasRef.value ? canvasRef.value.offsetWidth : 794
      const canvasHeight = canvasRef.value ? canvasRef.value.offsetHeight : 1123
      
      console.log('🔥 Canvas dimensions:', { canvasWidth, canvasHeight })
      
      // Clear existing elements first
      elements.value = []
      
      // Add corner elements
      createElement('text', 'TOP-LEFT', 0, 0, {
        width: 100,
        height: 30,
        fontSize: 14,
        color: '#ff0000',
        backgroundColor: '#ffeeee'
      })
      
      createElement('text', 'TOP-RIGHT', canvasWidth - 100, 0, {
        width: 100,
        height: 30,
        fontSize: 14,
        color: '#00ff00',
        backgroundColor: '#eeffee'
      })
      
      createElement('text', 'BOTTOM-LEFT', 0, canvasHeight - 30, {
        width: 100,
        height: 30,
        fontSize: 14,
        color: '#0000ff',
        backgroundColor: '#eeeeff'
      })
      
      createElement('text', 'BOTTOM-RIGHT', canvasWidth - 100, canvasHeight - 30, {
        width: 100,
        height: 30,
        fontSize: 14,
        color: '#ff00ff',
        backgroundColor: '#ffeeff'
      })
      
      console.log('🔥 Corner elements added:', elements.value.map(el => ({ 
        content: el.content, 
        x: el.x, 
        y: el.y,
        calculatedPosition: `${el.x}/${canvasWidth}, ${el.y}/${canvasHeight}`
      })))
    }


    const handleDragStart = () => {
      // Handle drag start from placeholders panel
      console.log('Drag start')
    }

    const loadFromHtml = (htmlContent) => {
      try {
        // Clear existing elements
        elements.value = []
        selectedElements.value = []
        elementCounter.value = 0

        // Create a temporary DOM element to parse HTML
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlContent, 'text/html')
        
        // Try to find elements in different container structures
        let container = doc.querySelector('.hr-document') || 
                       doc.querySelector('.document-container') || 
                       doc.body
        
        if (!container) return

        // Find all div elements with position absolute (our canvas elements)
        const elementDivs = container.querySelectorAll('div[style*="position: absolute"]')
        
        elementDivs.forEach((elementDiv) => {
          const style = elementDiv.style
          const textContent = elementDiv.textContent.trim()
          
          // Extract position and size from style
          const x = parseInt(style.left) || 0
          const y = parseInt(style.top) || 0
          
          // Calculate width and height from text or use defaults
          const width = Math.max(textContent.length * 8, 100)
          const height = 30

          // Extract styling from inline styles
          const fontSize = parseInt(style.fontSize) || 14
          const color = style.color || '#000000'
          const backgroundColor = style.backgroundColor || 'transparent'
          const textAlign = style.textAlign || 'left'
          const fontWeight = style.fontWeight || 'normal'
          const fontStyle = style.fontStyle || 'normal'
          const textDecoration = style.textDecoration || 'none'
          const fontFamily = style.fontFamily || 'Arial, sans-serif'
          const zIndex = parseInt(style.zIndex) || 1

          // Determine element type based on content
          let type = 'text'
          if (textContent.startsWith('{') && textContent.endsWith('}')) {
            type = 'placeholder'
          }

          // Extract content
          let content = textContent

          // Create element
          elementCounter.value++
          const element = {
            id: `element-${elementCounter.value}`,
            type,
            content,
            x,
            y,
            width,
            height,
            fontSize,
            color,
            backgroundColor,
            textAlign,
            fontWeight,
            fontStyle,
            textDecoration,
            fontFamily,
            zIndex
          }

          elements.value.push(element)
        })

        console.log('Loaded elements from HTML:', elements.value)
      } catch (error) {
        console.error('Error loading HTML:', error)
      }
    }

    const handleDocxUpload = async (file) => {
      try {
        // Read the DOCX file
        const arrayBuffer = await file.arrayBuffer()
        
        // Parse DOCX with mammoth.js
        const result = await mammoth.convertToHtml({ arrayBuffer })
        const htmlContent = result.value
        
        // Clear existing elements
        elements.value = []
        selectedElements.value = []
        elementCounter.value = 0
        
        // Parse the HTML content
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlContent, 'text/html')
        
        let currentY = 50
        const canvasWidth = 700
        
        // Process all text content
        const textElements = doc.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div')
        
        textElements.forEach((element) => {
          const textContent = element.textContent.trim()
          if (!textContent) return
          
          // Determine element type and styling
          const tagName = element.tagName.toLowerCase()
          let fontSize = 14
          let fontWeight = 'normal'
          let textAlign = 'left'
          
          // Apply styling based on HTML tag
          switch (tagName) {
            case 'h1':
              fontSize = 24
              fontWeight = 'bold'
              break
            case 'h2':
              fontSize = 20
              fontWeight = 'bold'
              break
            case 'h3':
              fontSize = 18
              fontWeight = 'bold'
              break
            case 'h4':
              fontSize = 16
              fontWeight = 'bold'
              break
            case 'h5':
              fontSize = 14
              fontWeight = 'bold'
              break
            case 'h6':
              fontSize = 12
              fontWeight = 'bold'
              break
            default:
              fontSize = 14
              fontWeight = 'normal'
          }
          
          // Calculate dimensions
          const textWidth = Math.min(Math.max(textContent.length * (fontSize * 0.6), 100), canvasWidth - 100)
          const textHeight = Math.max(fontSize * 1.5, 25)
          
          // Create text element
          elementCounter.value++
          const textElement = {
            id: `element-${elementCounter.value}`,
            type: 'text',
            content: textContent,
            x: 50,
            y: currentY,
            width: textWidth,
            height: textHeight,
            fontSize,
            color: '#000000',
            backgroundColor: 'transparent',
            textAlign,
            fontWeight,
            fontStyle: 'normal',
            textDecoration: 'none',
            fontFamily: 'Arial, sans-serif',
            zIndex: 1
          }
          
          elements.value.push(textElement)
          currentY += textHeight + 10
        })
        
        console.log('Loaded DOCX content:', elements.value)
        
      } catch (error) {
        console.error('Error processing DOCX file:', error)
        alert('Error processing DOCX file. Please try again.')
      }
    }

    const uploadDocx = () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.docx'
      input.onchange = (event) => {
        const file = event.target.files[0]
        if (file) {
          handleDocxUpload(file)
        }
      }
      input.click()
    }

    // Table control functions
    const addTableRowAt = (element, rowIndex) => {
      const columnCount = element.rows[0].length
      const newRow = new Array(columnCount).fill('New Cell')
      
      element.rows.splice(rowIndex + 1, 0, newRow)
      
      // Update cell alignments for new row
      if (element.cellAlignments) {
        const newAlignments = {}
        Object.keys(element.cellAlignments).forEach(key => {
          const [row, col] = key.split('-').map(Number)
          if (row > rowIndex) {
            newAlignments[`${row + 1}-${col}`] = element.cellAlignments[key]
          } else {
            newAlignments[key] = element.cellAlignments[key]
          }
        })
        element.cellAlignments = newAlignments
      }
      
      // Increase table height
      element.height = element.rows.length * 30
    }

    const addTableColumnAt = (element, colIndex) => {
      // Add new column to each row
      element.rows.forEach(row => {
        row.splice(colIndex + 1, 0, 'New Cell')
      })
      
      // Update cell alignments for new column
      if (element.cellAlignments) {
        const newAlignments = {}
        Object.keys(element.cellAlignments).forEach(key => {
          const [row, col] = key.split('-').map(Number)
          if (col > colIndex) {
            newAlignments[`${row}-${col + 1}`] = element.cellAlignments[key]
          } else {
            newAlignments[key] = element.cellAlignments[key]
          }
        })
        element.cellAlignments = newAlignments
      }
      
      // Increase table width
      element.width = element.rows[0].length * 100
    }

    const deleteLastTableRow = (element) => {
      if (element.rows.length <= 1) return
      
      const lastRowIndex = element.rows.length - 1
      element.rows.splice(lastRowIndex, 1)
      
      // Update cell alignments after row deletion
      if (element.cellAlignments) {
        const newAlignments = {}
        Object.keys(element.cellAlignments).forEach(key => {
          const [row, col] = key.split('-').map(Number)
          if (row < lastRowIndex) {
            newAlignments[key] = element.cellAlignments[key]
          }
        })
        element.cellAlignments = newAlignments
      }
      
      // Decrease table height
      element.height = element.rows.length * 30
      
      // Clear selected cell if it was in deleted row
      if (selectedTableCell.value && 
          selectedTableCell.value.elementId === element.id && 
          selectedTableCell.value.rowIndex >= element.rows.length) {
        selectedTableCell.value = null
      }
    }

    const deleteLastTableColumn = (element) => {
      if (element.rows[0].length <= 1) return
      
      const lastColIndex = element.rows[0].length - 1
      
      // Remove last column from each row
      element.rows.forEach(row => {
        row.splice(lastColIndex, 1)
      })
      
      // Update cell alignments after column deletion
      if (element.cellAlignments) {
        const newAlignments = {}
        Object.keys(element.cellAlignments).forEach(key => {
          const [row, col] = key.split('-').map(Number)
          if (col < lastColIndex) {
            newAlignments[key] = element.cellAlignments[key]
          }
        })
        element.cellAlignments = newAlignments
      }
      
      // Decrease table width
      element.width = element.rows[0].length * 100
      
      // Clear selected cell if it was in deleted column
      if (selectedTableCell.value && 
          selectedTableCell.value.elementId === element.id && 
          selectedTableCell.value.colIndex >= element.rows[0].length) {
        selectedTableCell.value = null
      }
    }

    // Border control functions
    const updateTableBorderStyle = (element, style) => {
      if (!element.tableBorder) {
        element.tableBorder = { width: 1, style: 'solid', color: '#000000' }
      }
      element.tableBorder.style = style
    }

    const updateCellBorderStyle = (element, style) => {
      if (!element.cellBorders) {
        element.cellBorders = { width: 1, style: 'solid', color: '#cccccc' }
      }
      element.cellBorders.style = style
    }

    const updateTableBorderWidth = (element, width) => {
      if (!element.tableBorder) {
        element.tableBorder = { width: 1, style: 'solid', color: '#000000' }
      }
      element.tableBorder.width = parseInt(width)
    }

    const updateTableBorderColor = (element, color) => {
      if (!element.tableBorder) {
        element.tableBorder = { width: 1, style: 'solid', color: '#000000' }
      }
      element.tableBorder.color = color
    }

    const updateCellBorderWidth = (element, width) => {
      if (!element.cellBorders) {
        element.cellBorders = { width: 1, style: 'solid', color: '#cccccc' }
      }
      element.cellBorders.width = parseInt(width)
    }

    const updateCellBorderColor = (element, color) => {
      if (!element.cellBorders) {
        element.cellBorders = { width: 1, style: 'solid', color: '#cccccc' }
      }
      element.cellBorders.color = color
    }

    // Cell merge functions
    const getCellColspan = (element, rowIndex, colIndex) => {
      const key = `${rowIndex}-${colIndex}`
      return element.mergedCells?.[key]?.colspan || 1
    }

    const getCellRowspan = (element, rowIndex, colIndex) => {
      const key = `${rowIndex}-${colIndex}`
      return element.mergedCells?.[key]?.rowspan || 1
    }

    const isCellHidden = (element, rowIndex, colIndex) => {
      const key = `${rowIndex}-${colIndex}`
      return element.hiddenCells?.has(key) || false
    }

    const canMergeRight = (element) => {
      if (!selectedTableCell.value) return false
      const { rowIndex, colIndex } = selectedTableCell.value
      return colIndex < element.rows[0].length - 1
    }

    const canMergeDown = (element) => {
      if (!selectedTableCell.value) return false
      const { rowIndex, colIndex } = selectedTableCell.value
      return rowIndex < element.rows.length - 1
    }

    const canUnmerge = (element) => {
      if (!selectedTableCell.value) return false
      const { rowIndex, colIndex } = selectedTableCell.value
      const key = `${rowIndex}-${colIndex}`
      return element.mergedCells?.[key] || false
    }

    const mergeCellsRight = (element) => {
      if (!selectedTableCell.value || !canMergeRight(element)) return
      
      const { rowIndex, colIndex } = selectedTableCell.value
      const key = `${rowIndex}-${colIndex}`
      
      if (!element.mergedCells) element.mergedCells = {}
      if (!element.hiddenCells) element.hiddenCells = new Set()
      
      // Get current colspan or default to 1
      const currentColspan = element.mergedCells[key]?.colspan || 1
      const currentRowspan = element.mergedCells[key]?.rowspan || 1
      
      // Increase colspan
      element.mergedCells[key] = {
        colspan: currentColspan + 1,
        rowspan: currentRowspan
      }
      
      // Hide the cells that are now merged
      for (let r = rowIndex; r < rowIndex + currentRowspan; r++) {
        const hideKey = `${r}-${colIndex + currentColspan}`
        element.hiddenCells.add(hideKey)
      }
    }

    const mergeCellsDown = (element) => {
      if (!selectedTableCell.value || !canMergeDown(element)) return
      
      const { rowIndex, colIndex } = selectedTableCell.value
      const key = `${rowIndex}-${colIndex}`
      
      if (!element.mergedCells) element.mergedCells = {}
      if (!element.hiddenCells) element.hiddenCells = new Set()
      
      // Get current rowspan or default to 1
      const currentColspan = element.mergedCells[key]?.colspan || 1
      const currentRowspan = element.mergedCells[key]?.rowspan || 1
      
      // Increase rowspan
      element.mergedCells[key] = {
        colspan: currentColspan,
        rowspan: currentRowspan + 1
      }
      
      // Hide the cells that are now merged
      for (let c = colIndex; c < colIndex + currentColspan; c++) {
        const hideKey = `${rowIndex + currentRowspan}-${c}`
        element.hiddenCells.add(hideKey)
      }
    }

    const unmergeCell = (element) => {
      if (!selectedTableCell.value || !canUnmerge(element)) return
      
      const { rowIndex, colIndex } = selectedTableCell.value
      const key = `${rowIndex}-${colIndex}`
      
      if (!element.mergedCells || !element.mergedCells[key]) return
      
      const { colspan, rowspan } = element.mergedCells[key]
      
      // Show all previously hidden cells
      for (let r = rowIndex; r < rowIndex + rowspan; r++) {
        for (let c = colIndex; c < colIndex + colspan; c++) {
          if (r !== rowIndex || c !== colIndex) {
            const hideKey = `${r}-${c}`
            element.hiddenCells?.delete(hideKey)
          }
        }
      }
      
      // Remove merge info
      delete element.mergedCells[key]
    }

    // Cell background color functions
    const getCellBackgroundColor = (element, rowIndex, colIndex) => {
      const key = `${rowIndex}-${colIndex}`
      return element.cellColors?.[key] || 'transparent'
    }

    const updateCellBackgroundColor = (element, rowIndex, colIndex, color) => {
      if (!element.cellColors) {
        element.cellColors = {}
      }
      const key = `${rowIndex}-${colIndex}`
      element.cellColors[key] = color
    }

    const clearCellBackgroundColor = (element, rowIndex, colIndex) => {
      if (!element.cellColors) return
      const key = `${rowIndex}-${colIndex}`
      delete element.cellColors[key]
    }

    onUnmounted(() => {
      document.removeEventListener('mousemove', handleDragMove)
      document.removeEventListener('mouseup', handleDragEnd)
      document.removeEventListener('mousemove', handleResizeMove)
      document.removeEventListener('mouseup', handleResizeEnd)
    })

    return {
      canvasRef,
      elementRefs,
      elements,
      selectedElements,
      selectedTableCell,
      showContextMenu,
      contextMenuPosition,
      resizeHandles,
      elementStyle,
      addTextElement,
      addImageElement,
      addHorizontalLine,
      addVerticalLine,
      addTable,
      selectElement,
      deleteElement,
      handleCanvasClick,
      handleElementMouseDown,
      startDrag,
      startResize,
      handleDrop,
      handleDragOver,
      updateElementText,
      updateTableCell,
      selectTableCell,
      showTableContextMenu,
      isSelectedCell,
      getCellAlignment,
      setCellAlignment,
      setTableDirection,
      addTableRow,
      addTableColumn,
      deleteTableRow,
      deleteTableColumn,
      addTableRowAt,
      addTableColumnAt,
      deleteLastTableRow,
      deleteLastTableColumn,
      updateTableBorderStyle,
      updateCellBorderStyle,
      updateTableBorderWidth,
      updateTableBorderColor,
      updateCellBorderWidth,
      updateCellBorderColor,
      getCellColspan,
      getCellRowspan,
      isCellHidden,
      canMergeRight,
      canMergeDown,
      canUnmerge,
      mergeCellsRight,
      mergeCellsDown,
      unmergeCell,
      getCellBackgroundColor,
      updateCellBackgroundColor,
      clearCellBackgroundColor,
      getFormatOptions,
      handlePlaceholderFocus,
      enableRichEdit,
      handleKeydown,
      applyHeading,
      applyTextColor,
      applyBackgroundColor,
      formatSelected,
      increaseFontSize,
      decreaseFontSize,
      alignText,
      clearCanvas,
      generateHTML,
      changePageSize,
      addTestElements,
      handleDragStart,
      loadFromHtml,
      handleDocxUpload,
      uploadDocx
    }
  }
}
</script>

<style scoped>
.canvas {
  position: relative;
  background: white;
  border: 1px solid #ddd;
  overflow: visible;
  margin: 20px auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.canvas.a4 {
  width: 794px;
  height: 1123px;
}

.canvas.a3 {
  width: 1123px;
  height: 1587px;
}

.canvas.a5 {
  width: 559px;
  height: 794px;
}

.canvas.letter {
  width: 816px;
  height: 1056px;
}

.canvas.legal {
  width: 816px;
  height: 1344px;
}

.canvas.business-card {
  width: 336px;
  height: 192px;
}

/* Landscape orientations - swap width/height */
.canvas.a4.landscape {
  width: 1123px;
  height: 794px;
}

.canvas.a3.landscape {
  width: 1587px;
  height: 1123px;
}

.canvas.a5.landscape {
  width: 794px;
  height: 559px;
}

.canvas.letter.landscape {
  width: 1056px;
  height: 816px;
}

.canvas.legal.landscape {
  width: 1344px;
  height: 816px;
}

.canvas.business-card.landscape {
  width: 192px;
  height: 336px;
}

.canvas.show-page-border {
  border: 2px solid #000;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(to right, #e0e0e0 1px, transparent 1px),
    linear-gradient(to bottom, #e0e0e0 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
  z-index: 0;
}

.ruler-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.ruler-horizontal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 20px;
  background: #f0f0f0;
  border-bottom: 1px solid #ccc;
}

.ruler-vertical {
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 100%;
  background: #f0f0f0;
  border-right: 1px solid #ccc;
}

.canvas-element {
  position: absolute;
  cursor: move;
  border: 1px solid transparent;
  min-width: 20px;
  min-height: 20px;
}

.canvas-element.selected {
  border: 2px solid #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.canvas-element.text {
  background: transparent;
}

.canvas-element.placeholder {
  background: #f8f9fa;
  border: 1px dashed #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
}

.canvas-element.formatted-text {
  background: transparent;
}

.canvas-element.image {
  border: 1px solid #ddd;
}

.canvas-element.line {
  background: #000;
}

.canvas-element.table {
  border: 1px solid #ddd;
}

.table-container {
  position: relative;
  width: 100%;
  height: 100%;
}


.text-editable {
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  background: transparent;
  resize: none;
  overflow: hidden;
}

.placeholder-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
  color: inherit;
  text-align: inherit;
  font-style: inherit;
  text-decoration: inherit;
  user-select: none;
}

.editable-placeholder {
  cursor: text;
  user-select: text;
  transition: all 0.2s ease;
}

.editable-placeholder:hover {
  background: #e9ecef;
  border-color: #007bff;
}

.editable-placeholder:focus {
  outline: none;
  background: #e7f3ff;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  min-height: 25px;
  padding: 2px 4px;
  border-radius: 4px;
}

.editable-placeholder:not(:focus):not(:hover) {
  color: #6c757d;
}

.formatted-text {
  line-height: 1.2;
}

.image-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.line-content {
  width: 100%;
  height: 100%;
  background: #000;
}

.line-content.horizontal {
  height: 2px;
}

.line-content.vertical {
  width: 2px;
}

.table-content {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
}

.table-content td {
  border: 1px solid #ccc;
  padding: 4px;
  vertical-align: top;
  cursor: text;
  transition: background-color 0.2s ease;
}

.table-content td:hover {
  background-color: #f8f9fa;
}

.table-content td.selected-cell {
  background-color: #e3f2fd;
  outline: 2px solid #2196f3;
  outline-offset: -2px;
}

.resize-handles {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #007bff;
  border: 1px solid #fff;
  pointer-events: all;
}

.resize-handle.nw {
  top: 0;
  left: 0;
  cursor: nw-resize;
}

.resize-handle.n {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  cursor: n-resize;
}

.resize-handle.ne {
  top: 0;
  right: 0;
  cursor: ne-resize;
}

.resize-handle.e {
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  cursor: e-resize;
}

.resize-handle.se {
  bottom: 0;
  right: 0;
  cursor: se-resize;
}

.resize-handle.s {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  cursor: s-resize;
}

.resize-handle.sw {
  bottom: 0;
  left: 0;
  cursor: sw-resize;
}

.resize-handle.w {
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  cursor: w-resize;
}

.delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.delete-btn:hover {
  background: #c82333;
  transform: scale(1.1);
}

.table-context-menu {
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 150px;
  z-index: 1000;
}

.context-menu-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s ease;
}

.context-menu-item:last-child {
  border-bottom: none;
}

.context-menu-item:hover {
  background-color: #f5f5f5;
}

.context-menu-item:active {
  background-color: #e9ecef;
}

/* Table Control Buttons */
.table-control-btn {
  position: absolute;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.table-control-btn:hover {
  background: #0056b3;
  transform: scale(1.1);
}

.table-control-btn:active {
  transform: scale(0.95);
}

/* Row Controls */
.table-row-controls {
  position: absolute;
  left: -25px;
  top: 0;
  width: 20px;
  height: 100%;
  z-index: 5;
}

.row-control {
  width: 20px;
  min-height: 20px;
}

.row-control.delete-row {
  background: #dc3545;
  height: 20px;
}

.row-control.delete-row:hover {
  background: #c82333;
}

/* Column Controls */
.table-column-controls {
  position: absolute;
  top: -25px;
  left: 0;
  width: 100%;
  height: 20px;
  z-index: 5;
}

.column-control {
  height: 20px;
  min-width: 20px;
}

.column-control.delete-column {
  background: #dc3545;
  width: 20px;
}

.column-control.delete-column:hover {
  background: #c82333;
}

/* Border Controls */
.table-border-controls {
  position: absolute;
  bottom: -120px;
  right: -10px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 200px;
  pointer-events: all;
}

.border-control-group {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.border-control-group:last-child {
  margin-bottom: 0;
}

.border-label {
  font-size: 12px;
  font-weight: bold;
  color: #333;
  min-width: 80px;
}

.border-width-slider {
  width: 50px;
  height: 20px;
}

.border-color-picker {
  width: 30px;
  height: 24px;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
  padding: 0;
}

.border-style-select {
  padding: 2px 4px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 12px;
  min-width: 70px;
}

/* Merge Controls */
.merge-btn {
  background: #28a745;
  color: white;
  border: none;
  border-radius: 3px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  margin-right: 4px;
}

.merge-btn:hover:not(:disabled) {
  background: #218838;
  transform: scale(1.1);
}

.merge-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.5;
}

.merge-btn.unmerge {
  background: #ffc107;
  color: #000;
}

.merge-btn.unmerge:hover:not(:disabled) {
  background: #e0a800;
}

.clear-color-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 3px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  margin-left: 4px;
}

.clear-color-btn:hover {
  background: #c82333;
  transform: scale(1.1);
}

</style>
