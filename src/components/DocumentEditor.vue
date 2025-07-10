<template>
  <div class="hr-document-editor">
    <div class="container">
      <h1>👥 HR Document Layout Editor</h1>
      
      <div class="control-buttons">
        <button class="btn btn-primary" @click="addTextElement">
          <span>📝</span> Add Text
        </button>
        <button class="btn btn-primary" @click="addImageElement">
          <span>🖼️</span> Add Image
        </button>
        <button class="btn btn-primary" @click="uploadDocx">
          <span>📄</span> Upload DOCX
        </button>
        <button class="btn btn-info" @click="toggleGrid">
          <span>📐</span> Toggle Grid
        </button>
        <button class="btn btn-info" @click="toggleRuler">
          <span>📏</span> Toggle Ruler
        </button>
        <button class="btn btn-primary" @click="addHorizontalLine">
          <span>━</span> Add HR Line
        </button>
        <button class="btn btn-primary" @click="addVerticalLine">
          <span>┃</span> Add V Line
        </button>
        <button class="btn btn-primary" @click="addTable">
          <span>🏗️</span> Add Table
        </button>
        <button class="btn btn-warning" @click="addTestElements">
          <span>🧪</span> Add Test Elements
        </button>
        <button class="btn btn-info" @click="togglePageBorder">
          <span>🔲</span> Page Border
        </button>
        
        <select v-model="selectedPageSize" @change="changePageSize" class="btn page-size-select">
          <option value="">Page Size</option>
          <optgroup label="📄 Standard Pages">
            <option value="a4">A4 (210×297mm)</option>
            <option value="a3">A3 (297×420mm)</option>
            <option value="a5">A5 (148×210mm)</option>
            <option value="letter">Letter (8.5×11in)</option>
            <option value="legal">Legal (8.5×14in)</option>
            <option value="tabloid">Tabloid (11×17in)</option>
          </optgroup>
          <optgroup label="🎴 Card Sizes">
            <option value="business-card">Business Card (3.5×2in)</option>
            <option value="id-card">ID Card (3.375×2.125in)</option>
            <option value="badge">Badge (4×3in)</option>
            <option value="postcard">Postcard (6×4in)</option>
            <option value="greeting-card">Greeting Card (5×7in)</option>
            <option value="certificate">Certificate (11×8.5in)</option>
          </optgroup>
        </select>
        
        <button class="btn btn-info" @click="toggleOrientation">
          <span>🔄</span> {{ orientation }}
        </button>
        
        <select v-model="selectedFormat" @change="applyHeading" class="btn format-select">
          <option value="">Format</option>
          <option value="h1">H1 - Large Heading</option>
          <option value="h2">H2 - Heading</option>
          <option value="h3">H3 - Sub Heading</option>
          <option value="h4">H4 - Small Heading</option>
          <option value="h5">H5 - Tiny Heading</option>
          <option value="p">P - Normal Text</option>
          <option value="pre">PRE - Code/Preformatted</option>
        </select>
        
        <input type="color" v-model="textColor" @change="applyTextColor" title="Text Color" class="color-input">
        <input type="color" v-model="bgColor" @change="applyBackgroundColor" title="Background Color" class="color-input">
        
        <button class="btn btn-warning" @click="formatSelected('bold')">
          <span><strong>B</strong></span>
        </button>
        <button class="btn btn-warning" @click="formatSelected('italic')">
          <span><em>I</em></span>
        </button>
        <button class="btn btn-warning" @click="formatSelected('underline')">
          <span><u>U</u></span>
        </button>
        <button class="btn btn-warning" @click="increaseFontSize">
          <span>🔍+</span>
        </button>
        <button class="btn btn-warning" @click="decreaseFontSize">
          <span>🔍-</span>
        </button>
        <button class="btn btn-info" @click="alignText('left')">
          <span>⬅️</span> Left
        </button>
        <button class="btn btn-info" @click="alignText('center')">
          <span>↔️</span> Center
        </button>
        <button class="btn btn-info" @click="alignText('right')">
          <span>➡️</span> Right
        </button>
        
        <!-- Table Cell Controls -->
        <div v-if="selectedTableCell" class="table-cell-controls">
          <span class="control-label">📊 Table Cell:</span>
          <button class="btn btn-info btn-sm" @click="setCellAlignment('left')" title="Align cell left">
            <span>⬅️</span>
          </button>
          <button class="btn btn-info btn-sm" @click="setCellAlignment('center')" title="Align cell center">
            <span>↔️</span>
          </button>
          <button class="btn btn-info btn-sm" @click="setCellAlignment('right')" title="Align cell right">
            <span>➡️</span>
          </button>
        </div>
        
        <!-- Table Direction Controls -->
        <div v-if="hasSelectedTable" class="table-direction-controls">
          <span class="control-label">🌐 Table Direction:</span>
          <button class="btn btn-info btn-sm" @click="setTableDirection('ltr')" title="Left to Right">
            <span>LTR</span>
          </button>
          <button class="btn btn-info btn-sm" @click="setTableDirection('rtl')" title="Right to Left">
            <span>RTL</span>
          </button>
        </div>
        
        <button class="btn btn-warning" @click="clearCanvas">
          <span>🗑️</span> Clear
        </button>
        <button class="btn btn-success" @click="saveTemplate">
          <span>💾</span> Generate HR Document
        </button>
      </div>

      <div class="editor-layout">
        <CanvasElement 
          ref="canvasRef"
          :page-size="selectedPageSize"
          :orientation="orientation"
          :show-grid="showGrid"
          :show-ruler="showRuler"
          :show-page-border="showPageBorder"
          @element-selected="handleElementSelected"
          @elements-selected="handleElementsSelected"
        />

        <PlaceholdersPanel 
          :placeholders="placeholders"
          @drag-start="handleDragStart"
        />
      </div>

      <div v-if="showOutput" class="output-section">
        <h3>📤 Generated HR Document HTML</h3>
        <textarea 
          v-model="htmlOutput" 
          placeholder="Your HR document HTML will appear here..." 
          readonly
          class="html-output"
        />
      </div>
    </div>

    <ImageUploadModal 
      v-if="showImageModal"
      @close="closeImageModal"
      @confirm="confirmImageUpload"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import CanvasElement from './CanvasElement.vue'
import PlaceholdersPanel from './PlaceholdersPanel.vue'
import ImageUploadModal from './ImageUploadModal.vue'

export default {
  name: 'HRDocumentEditor',
  components: {
    CanvasElement,
    PlaceholdersPanel,
    ImageUploadModal
  },
  props: {
    placeholders: {
      type: Array,
      default: () => []
    },
    showOutput: {
      type: Boolean,
      default: true
    },
    loadHtml: {
      type: String,
      default: ''
    }
  },
  emits: ['html-generated'],
  setup(props, { emit }) {
    const canvasRef = ref(null)
    const selectedElements = ref([])
    const selectedElement = ref(null)
    const selectedPageSize = ref('a4')
    const orientation = ref('Portrait')
    const selectedFormat = ref('')
    const textColor = ref('#000000')
    const bgColor = ref('#ffffff')
    const showGrid = ref(false)
    const showRuler = ref(false)
    const showPageBorder = ref(false)
    const showImageModal = ref(false)
    const htmlOutput = ref('')
    const groups = ref([])
    const groupCounter = ref(0)
    const selectedTableCell = ref(null)

    const addTextElement = () => {
      if (canvasRef.value) {
        canvasRef.value.addTextElement('Click to edit text...')
      }
    }

    const addImageElement = () => {
      showImageModal.value = true
    }

    const uploadDocx = () => {
      if (canvasRef.value) {
        canvasRef.value.uploadDocx()
      }
    }


    const toggleGrid = () => {
      showGrid.value = !showGrid.value
    }

    const toggleRuler = () => {
      showRuler.value = !showRuler.value
    }

    const togglePageBorder = () => {
      showPageBorder.value = !showPageBorder.value
    }

    const addHorizontalLine = () => {
      if (canvasRef.value) {
        canvasRef.value.addHorizontalLine()
      }
    }

    const addVerticalLine = () => {
      if (canvasRef.value) {
        canvasRef.value.addVerticalLine()
      }
    }

    const addTable = () => {
      if (canvasRef.value) {
        canvasRef.value.addTable()
      }
    }

    const addTestElements = () => {
      console.log('🔥 HRDocumentEditor addTestElements button clicked!')
      if (canvasRef.value) {
        canvasRef.value.addTestElements()
      } else {
        console.log('🔥 ERROR: canvasRef.value is null!')
      }
    }

    const changePageSize = () => {
      if (canvasRef.value) {
        canvasRef.value.changePageSize(selectedPageSize.value)
      }
    }

    const toggleOrientation = () => {
      orientation.value = orientation.value === 'Portrait' ? 'Landscape' : 'Portrait'
    }

    const applyHeading = () => {
      if (selectedElement.value && canvasRef.value) {
        canvasRef.value.applyHeading(selectedFormat.value)
      }
    }

    const applyTextColor = () => {
      if (selectedElement.value && canvasRef.value) {
        canvasRef.value.applyTextColor(textColor.value)
      }
    }

    const applyBackgroundColor = () => {
      if (selectedElement.value && canvasRef.value) {
        canvasRef.value.applyBackgroundColor(bgColor.value)
      }
    }

    const formatSelected = (format) => {
      if (selectedElement.value && canvasRef.value) {
        canvasRef.value.formatSelected(format)
      }
    }

    const increaseFontSize = () => {
      if (selectedElement.value && canvasRef.value) {
        canvasRef.value.increaseFontSize()
      }
    }

    const decreaseFontSize = () => {
      if (selectedElement.value && canvasRef.value) {
        canvasRef.value.decreaseFontSize()
      }
    }

    const alignText = (alignment) => {
      if (selectedElement.value && canvasRef.value) {
        canvasRef.value.alignText(alignment)
      }
    }

    const clearCanvas = () => {
      if (canvasRef.value) {
        canvasRef.value.clearCanvas()
      }
      selectedElements.value = []
      selectedElement.value = null
    }

    const saveTemplate = () => {
      if (canvasRef.value) {
        htmlOutput.value = canvasRef.value.generateHTML()
        emit('html-generated', htmlOutput.value)
      }
    }

    const handleElementSelected = (element) => {
      selectedElement.value = element
      selectedElements.value = element ? [element] : []
      // Clear table cell selection when a different element is selected
      if (!element || element.type !== 'table') {
        selectedTableCell.value = null
      }
    }

    const handleElementsSelected = (elements) => {
      selectedElements.value = elements
      selectedElement.value = elements.length === 1 ? elements[0] : null
    }

    const handleDragStart = (event, data) => {
      if (canvasRef.value) {
        canvasRef.value.handleDragStart(event, data)
      }
    }

    const closeImageModal = () => {
      showImageModal.value = false
    }

    const confirmImageUpload = (imageData) => {
      if (canvasRef.value) {
        canvasRef.value.addImageElement(imageData)
      }
      showImageModal.value = false
    }

    const loadHtmlContent = (htmlContent) => {
      if (canvasRef.value && htmlContent) {
        canvasRef.value.loadFromHtml(htmlContent)
      }
    }

    // Computed properties
    const hasSelectedTable = computed(() => {
      return selectedElements.value.some(el => el?.type === 'table')
    })

    // Table cell and direction methods
    const setCellAlignment = (alignment) => {
      if (canvasRef.value) {
        canvasRef.value.setCellAlignment(alignment)
      }
    }

    const setTableDirection = (direction) => {
      if (canvasRef.value) {
        canvasRef.value.setTableDirection(direction)
      }
    }

    // Watch for loadHtml prop changes
    watch(() => props.loadHtml, (newHtml) => {
      if (newHtml) {
        loadHtmlContent(newHtml)
      }
    }, { immediate: true })

    // Watch for table cell selection changes in canvas
    watch(() => canvasRef.value?.selectedTableCell, (newCell) => {
      selectedTableCell.value = newCell
    }, { deep: true })

    return {
      canvasRef,
      selectedElements,
      selectedElement,
      selectedPageSize,
      orientation,
      selectedFormat,
      textColor,
      bgColor,
      showGrid,
      showRuler,
      showPageBorder,
      showImageModal,
      htmlOutput,
      groups,
      groupCounter,
      selectedTableCell,
      hasSelectedTable,
      addTextElement,
      addImageElement,
      uploadDocx,
      toggleGrid,
      toggleRuler,
      togglePageBorder,
      addHorizontalLine,
      addVerticalLine,
      addTable,
      addTestElements,
      changePageSize,
      toggleOrientation,
      applyHeading,
      applyTextColor,
      applyBackgroundColor,
      formatSelected,
      increaseFontSize,
      decreaseFontSize,
      alignText,
      clearCanvas,
      saveTemplate,
      handleElementSelected,
      handleElementsSelected,
      handleDragStart,
      closeImageModal,
      confirmImageUpload,
      setCellAlignment,
      setTableDirection
    }
  }
}
</script>

<style scoped>
.hr-document-editor {
  font-family: Arial, sans-serif;
}

.container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}


.control-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.page-size-select,
.format-select {
  background: #6f42c1;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px;
}

.color-input {
  width: 40px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.editor-layout {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.output-section {
  margin-top: 20px;
}

.html-output {
  width: 100%;
  height: 200px;
  font-family: monospace;
  font-size: 12px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f8f9fa;
  resize: vertical;
}

@media (max-width: 768px) {
  .editor-layout {
    flex-direction: column;
  }
  
  .control-buttons {
    flex-direction: column;
    align-items: center;
  }
}

/* Table Controls */
.table-cell-controls,
.table-direction-controls {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background: rgba(23, 162, 184, 0.1);
  border: 1px solid #17a2b8;
  border-radius: 8px;
  font-size: 12px;
}

.control-label {
  font-size: 11px;
  font-weight: bold;
  color: #17a2b8;
  margin-right: 5px;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 11px;
  min-width: 30px;
}

.table-cell-controls .btn-sm {
  background: #17a2b8;
}

.table-direction-controls .btn-sm {
  background: #6f42c1;
  color: white;
}

.table-direction-controls {
  background: rgba(111, 66, 193, 0.1);
  border-color: #6f42c1;
}

.table-direction-controls .control-label {
  color: #6f42c1;
}
</style>