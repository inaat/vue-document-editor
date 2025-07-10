<template>
  <div class="hr-document-editor">
    <!-- Header -->
    <h1>👥 HR Document Layout Editor</h1>
    
    <!-- Selection Counter -->
    <div 
      v-if="selectedElements.length > 0" 
      class="selection-counter"
    >
      {{ selectedElements.length }} element(s) selected
    </div>
    
    <!-- Control Buttons -->
    <div class="control-buttons">
      <button class="btn btn-primary" @click="addTextElement">
        <span>📝</span> Add Text
      </button>
      <button class="btn btn-primary" @click="openImageModal">
        <span>🖼️</span> Add Image
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
      <button 
        class="btn btn-success" 
        @click="createGroup"
        :disabled="selectedElements.length < 2"
      >
        <span>📦</span> Group Selected
      </button>
      <button 
        class="btn btn-warning" 
        @click="ungroupSelected"
        :disabled="selectedElements.length === 0"
      >
        <span>📂</span> Ungroup
      </button>
      <button class="btn btn-info" @click="toggleGroupVisibility">
        <span>👁️</span> Toggle Groups
      </button>
      <button class="btn btn-info" @click="togglePageBorder">
        <span>🔲</span> Page Border
      </button>
      
      <!-- Page Size Selection -->
      <select 
        v-model="selectedPageSize" 
        @change="changePageSize"
        class="btn page-size-select"
      >
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
        <optgroup label="📱 Digital Sizes">
          <option value="mobile">Mobile (375×812px)</option>
          <option value="tablet">Tablet (768×1024px)</option>
          <option value="desktop">Desktop (1920×1080px)</option>
        </optgroup>
      </select>
      
      <!-- Orientation Toggle -->
      <button class="btn btn-info" @click="toggleOrientation">
        <span>🔄</span> {{ isLandscape ? 'Landscape' : 'Portrait' }}
      </button>
      
      <!-- Text Formatting Controls -->
      <TextFormattingControls 
        :selected-element="selectedElement"
        @apply-heading="applyHeading"
        @apply-font-family="applyFontFamily"
        @apply-text-color="applyTextColor"
        @apply-background-color="applyBackgroundColor"
        @format-text="formatText"
        @align-text="alignText"
        @increase-font-size="increaseFontSize"
        @decrease-font-size="decreaseFontSize"
      />
      
      <button class="btn btn-warning" @click="clearCanvas">
        <span>🗑️</span> Clear
      </button>
      <button class="btn btn-success" @click="generateDocument">
        <span>💾</span> Generate HR Document
      </button>
    </div>

    <!-- Editor Layout -->
    <div class="editor-layout">
      <!-- Canvas -->
      <div 
        ref="canvasRef"
        :class="canvasClasses"
        @click="handleCanvasClick"
        @dragover="handleDragOver"
        @drop="handleDrop"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
      >
        <!-- Grid Overlay -->
        <div 
          v-if="showGrid" 
          class="grid-overlay visible"
        ></div>
        
        <!-- Ruler Overlay -->
        <div 
          v-if="showRuler" 
          class="ruler-overlay visible"
        >
          <div class="ruler-horizontal"></div>
          <div class="ruler-vertical"></div>
        </div>
        
        <!-- Canvas Elements -->
        <CanvasElementComponent
          v-for="element in canvasElements"
          :key="element.id"
          :element="element"
          :selected="selectedElements.includes(element.id)"
          @select="selectElement"
          @delete="deleteElement"
          @update="updateElement"
        />
        
        <!-- Groups -->
        <GroupContainer
          v-for="group in groups"
          :key="group.id"
          :group="group"
          :visible="showGroups"
          @select="selectGroup"
          @move="moveGroup"
        />
      </div>

      <!-- Placeholders Panel -->
      <PlaceholdersPanel
        @drag-start="handlePlaceholderDragStart"
        @add-custom-text="addCustomText"
      />
    </div>

    <!-- Output Section -->
    <div class="output-section">
      <h3>📤 Generated HR Document HTML</h3>
      <textarea 
        v-model="generatedHtml" 
        placeholder="Your HR document HTML will appear here..." 
        readonly
        class="html-output"
      ></textarea>
    </div>
    
    <!-- Image Upload Modal -->
    <ImageUploadModal
      :is-open="imageModal.isOpen"
      :source-type="imageModal.sourceType"
      :url="imageModal.url"
      :width="imageModal.width"
      :height="imageModal.height"
      @close="closeImageModal"
      @confirm="confirmImageUpload"
      @update:source-type="imageModal.sourceType = $event"
      @update:url="imageModal.url = $event"
      @update:width="imageModal.width = $event"
      @update:height="imageModal.height = $event"
    />
    
    <!-- Hidden File Inputs -->
    <input 
      ref="imageUploadRef"
      type="file" 
      accept="image/*" 
      style="display: none;"
      @change="handleImageUpload"
    >
    <input 
      ref="employeePhotoUploadRef"
      type="file" 
      accept="image/jpeg,image/png,image/jpg" 
      style="display: none;"
      @change="handleEmployeePhotoUpload"
    >
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, onMounted } from 'vue'
import type { 
  CanvasElement, 
  ImageModalData, 
  Group, 
  ElementPosition,
  DragState 
} from '../types'
import CanvasElementComponent from './CanvasElement.vue'
import GroupContainer from './GroupContainer.vue'
import PlaceholdersPanel from './PlaceholdersPanel.vue'
import ImageUploadModal from './ImageUploadModal.vue'
import TextFormattingControls from './TextFormattingControls.vue'

// Props
interface Props {
  initialElements?: CanvasElement[]
  canvasWidth?: string
  canvasHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialElements: () => [],
  canvasWidth: '794px',
  canvasHeight: '1123px'
})

// Emits
const emit = defineEmits<{
  elementsChanged: [elements: CanvasElement[]]
  documentGenerated: [html: string]
}>()

// Refs
const canvasRef = ref<HTMLElement>()
const imageUploadRef = ref<HTMLInputElement>()
const employeePhotoUploadRef = ref<HTMLInputElement>()

// Reactive state
const canvasElements = ref<CanvasElement[]>([...props.initialElements])
const selectedElements = ref<string[]>([])
const selectedElement = computed(() => 
  selectedElements.value.length === 1 
    ? canvasElements.value.find(el => el.id === selectedElements.value[0])
    : null
)

const groups = ref<Group[]>([])
const groupCounter = ref(0)

const showGrid = ref(false)
const showRuler = ref(false)
const showGroups = ref(true)
const showPageBorder = ref(false)
const isLandscape = ref(false)
const selectedPageSize = ref('a4')

const generatedHtml = ref('')

const imageModal = reactive<ImageModalData>({
  isOpen: false,
  sourceType: 'upload',
  url: '',
  width: 200,
  height: 150
})

const dragState = reactive<DragState>({
  isDragging: false,
  draggedItem: null,
  dragOffset: { x: 0, y: 0 }
})

// Computed
const canvasClasses = computed(() => [
  'canvas',
  selectedPageSize.value,
  {
    'landscape': isLandscape.value,
    'bordered': showPageBorder.value,
    'drag-over': dragState.isDragging
  }
])

// Methods
const generateId = () => Math.random().toString(36).substr(2, 9)

const addTextElement = () => {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return
  
  const x = Math.random() * (rect.width - 200) + 50
  const y = Math.random() * (rect.height - 100) + 50
  
  const element: CanvasElement = {
    id: generateId(),
    type: 'text',
    content: 'Click to edit text...',
    position: { x, y },
    selected: false
  }
  
  canvasElements.value.push(element)
  selectElement(element.id)
  emit('elementsChanged', canvasElements.value)
}

const openImageModal = () => {
  imageModal.isOpen = true
  imageModal.sourceType = 'upload'
  imageModal.url = ''
  imageModal.width = 200
  imageModal.height = 150
}

const closeImageModal = () => {
  imageModal.isOpen = false
}

const confirmImageUpload = () => {
  if (imageModal.sourceType === 'upload') {
    imageUploadRef.value?.click()
  } else {
    if (!imageModal.url.trim()) {
      alert('Please enter a valid image URL.')
      return
    }
    
    const rect = canvasRef.value?.getBoundingClientRect()
    if (!rect) return
    
    const x = Math.random() * (rect.width - imageModal.width) + 50
    const y = Math.random() * (rect.height - imageModal.height) + 50
    
    const element: CanvasElement = {
      id: generateId(),
      type: 'image',
      content: imageModal.url,
      position: { x, y },
      dimensions: { width: imageModal.width, height: imageModal.height },
      selected: false
    }
    
    canvasElements.value.push(element)
    emit('elementsChanged', canvasElements.value)
  }
  
  closeImageModal()
}

const addHorizontalLine = () => {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return
  
  const x = Math.random() * (rect.width - 200) + 50
  const y = Math.random() * (rect.height - 50) + 50
  
  const element: CanvasElement = {
    id: generateId(),
    type: 'horizontal-line',
    content: '',
    position: { x, y },
    dimensions: { width: 200, height: 2 },
    selected: false
  }
  
  canvasElements.value.push(element)
  emit('elementsChanged', canvasElements.value)
}

const addVerticalLine = () => {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return
  
  const x = Math.random() * (rect.width - 50) + 50
  const y = Math.random() * (rect.height - 100) + 50
  
  const element: CanvasElement = {
    id: generateId(),
    type: 'vertical-line',
    content: '',
    position: { x, y },
    dimensions: { width: 2, height: 100 },
    selected: false
  }
  
  canvasElements.value.push(element)
  emit('elementsChanged', canvasElements.value)
}

const addTable = () => {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return
  
  const x = Math.random() * (rect.width - 250) + 50
  const y = Math.random() * (rect.height - 120) + 50
  
  const element: CanvasElement = {
    id: generateId(),
    type: 'table',
    content: '',
    position: { x, y },
    dimensions: { width: 200, height: 100 },
    selected: false
  }
  
  canvasElements.value.push(element)
  emit('elementsChanged', canvasElements.value)
}

const addCustomText = (text: string) => {
  if (!text.trim()) {
    alert('Please enter some text')
    return
  }
  
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return
  
  const x = Math.random() * (rect.width - 200) + 50
  const y = Math.random() * (rect.height - 100) + 50
  
  const element: CanvasElement = {
    id: generateId(),
    type: 'text',
    content: text,
    position: { x, y },
    selected: false
  }
  
  canvasElements.value.push(element)
  emit('elementsChanged', canvasElements.value)
}

const selectElement = (elementId: string, multiSelect = false) => {
  if (multiSelect) {
    if (selectedElements.value.includes(elementId)) {
      selectedElements.value = selectedElements.value.filter(id => id !== elementId)
    } else {
      selectedElements.value.push(elementId)
    }
  } else {
    selectedElements.value = [elementId]
  }
  
  // Update selected state in elements
  canvasElements.value.forEach(el => {
    el.selected = selectedElements.value.includes(el.id)
  })
}

const deleteElement = (elementId: string) => {
  canvasElements.value = canvasElements.value.filter(el => el.id !== elementId)
  selectedElements.value = selectedElements.value.filter(id => id !== elementId)
  emit('elementsChanged', canvasElements.value)
}

const updateElement = (elementId: string, updates: Partial<CanvasElement>) => {
  const index = canvasElements.value.findIndex(el => el.id === elementId)
  if (index !== -1) {
    canvasElements.value[index] = { ...canvasElements.value[index], ...updates }
    emit('elementsChanged', canvasElements.value)
  }
}

const clearSelection = () => {
  selectedElements.value = []
  canvasElements.value.forEach(el => {
    el.selected = false
  })
}

const handleCanvasClick = (e: MouseEvent) => {
  if (e.target === canvasRef.value) {
    clearSelection()
  }
}

const toggleGrid = () => {
  showGrid.value = !showGrid.value
}

const toggleRuler = () => {
  showRuler.value = !showRuler.value
}

const toggleGroupVisibility = () => {
  showGroups.value = !showGroups.value
}

const togglePageBorder = () => {
  showPageBorder.value = !showPageBorder.value
}

const toggleOrientation = () => {
  isLandscape.value = !isLandscape.value
}

const changePageSize = () => {
  // Page size change logic
  console.log('Page size changed to:', selectedPageSize.value)
}

const createGroup = () => {
  if (selectedElements.value.length < 2) return
  
  const groupId = `group_${++groupCounter.value}`
  const selectedEls = canvasElements.value.filter(el => selectedElements.value.includes(el.id))
  
  // Calculate group bounds
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  selectedEls.forEach(el => {
    const x = el.position.x
    const y = el.position.y
    const width = el.dimensions?.width || 100
    const height = el.dimensions?.height || 50
    
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    maxX = Math.max(maxX, x + width)
    maxY = Math.max(maxY, y + height)
  })
  
  const group: Group = {
    id: groupId,
    elements: [...selectedElements.value],
    position: { x: minX - 5, y: minY - 5 },
    dimensions: { width: maxX - minX + 10, height: maxY - minY + 10 }
  }
  
  groups.value.push(group)
  clearSelection()
}

const ungroupSelected = () => {
  // Ungroup logic
  console.log('Ungrouping selected elements')
}

const selectGroup = (groupId: string) => {
  const group = groups.value.find(g => g.id === groupId)
  if (group) {
    selectedElements.value = [...group.elements]
  }
}

const moveGroup = (groupId: string, position: ElementPosition) => {
  const group = groups.value.find(g => g.id === groupId)
  if (group) {
    group.position = position
  }
}

const clearCanvas = () => {
  if (confirm('Are you sure you want to clear the entire canvas?')) {
    canvasElements.value = []
    selectedElements.value = []
    groups.value = []
    emit('elementsChanged', canvasElements.value)
  }
}

const generateDocument = () => {
  // Generate HTML document logic
  let html = '<div class="hr-document">'
  
  canvasElements.value.forEach(element => {
    const style = `position: absolute; left: ${element.position.x}px; top: ${element.position.y}px;`
    
    switch (element.type) {
      case 'text':
        html += `<div style="${style}">${element.content}</div>`
        break
      case 'image':
        html += `<img src="${element.content}" style="${style}" alt="HR Document Image">`
        break
      // Add other element types
    }
  })
  
  html += '</div>'
  generatedHtml.value = html
  emit('documentGenerated', html)
  
  // Copy to clipboard
  navigator.clipboard.writeText(html).then(() => {
    alert('✅ HR document HTML generated and copied to clipboard!')
  }).catch(() => {
    alert('✅ HR document HTML generated! Check the output box below.')
  })
}

// Text formatting methods
const applyHeading = (format: string) => {
  console.log('Apply heading:', format)
}

const applyFontFamily = (fontFamily: string) => {
  console.log('Apply font family:', fontFamily)
}

const applyTextColor = (color: string) => {
  console.log('Apply text color:', color)
}

const applyBackgroundColor = (color: string) => {
  console.log('Apply background color:', color)
}

const formatText = (command: string) => {
  console.log('Format text:', command)
}

const alignText = (alignment: string) => {
  console.log('Align text:', alignment)
}

const increaseFontSize = () => {
  console.log('Increase font size')
}

const decreaseFontSize = () => {
  console.log('Decrease font size')
}

// Drag and drop handlers
const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  e.dataTransfer!.dropEffect = 'copy'
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  // Handle drop logic
}

const handleDragEnter = (e: DragEvent) => {
  e.preventDefault()
  dragState.isDragging = true
}

const handleDragLeave = (e: DragEvent) => {
  if (!canvasRef.value?.contains(e.relatedTarget as Node)) {
    dragState.isDragging = false
  }
}

const handlePlaceholderDragStart = (item: any) => {
  dragState.draggedItem = item
}

const handleImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  
  // Validate file
  if (file.size > 5 * 1024 * 1024) {
    alert('Image size should be less than 5MB')
    target.value = ''
    return
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    alert('Please select a valid image file (JPEG, PNG, JPG, GIF)')
    target.value = ''
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const rect = canvasRef.value?.getBoundingClientRect()
    if (!rect) return
    
    const x = Math.random() * (rect.width - imageModal.width) + 50
    const y = Math.random() * (rect.height - imageModal.height) + 50
    
    const element: CanvasElement = {
      id: generateId(),
      type: 'image',
      content: e.target?.result as string,
      position: { x, y },
      dimensions: { width: imageModal.width, height: imageModal.height },
      selected: false
    }
    
    canvasElements.value.push(element)
    emit('elementsChanged', canvasElements.value)
  }
  reader.readAsDataURL(file)
  target.value = ''
}

const handleEmployeePhotoUpload = (e: Event) => {
  // Similar to handleImageUpload but with employee-specific logic
  handleImageUpload(e)
}

// Lifecycle
onMounted(() => {
  // Initialize with sample elements
  nextTick(() => {
    addTextElement()
    // Add initial placeholder
    const element: CanvasElement = {
      id: generateId(),
      type: 'placeholder',
      content: '{employee_name}',
      position: { x: 50, y: 100 },
      selected: false
    }
    canvasElements.value.push(element)
    emit('elementsChanged', canvasElements.value)
  })
})
</script>

<style scoped>
/* Component styles will be added here */
</style>