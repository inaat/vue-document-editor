import { App } from 'vue'
import HRDocumentEditor from './components/HRDocumentEditor.vue'
import './style.css'

// Export the component
export { HRDocumentEditor }

// Export types
export * from './types'

// Plugin install function
export default {
  install(app: App) {
    app.component('HRDocumentEditor', HRDocumentEditor)
  }
}

// Export individual components
export { default as CanvasElement } from './components/CanvasElement.vue'
export { default as ImageUploadModal } from './components/ImageUploadModal.vue'
export { default as PlaceholdersPanel } from './components/PlaceholdersPanel.vue'
export { default as TextFormattingControls } from './components/TextFormattingControls.vue'
export { default as GroupContainer } from './components/GroupContainer.vue'