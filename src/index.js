import HRDocumentEditor from './components/HRDocumentEditor.vue'
import CanvasElement from './components/CanvasElement.vue'
import PlaceholdersPanel from './components/PlaceholdersPanel.vue'
import ImageUploadModal from './components/ImageUploadModal.vue'

const components = {
  HRDocumentEditor,
  CanvasElement,
  PlaceholdersPanel,
  ImageUploadModal
}

const install = (app) => {
  Object.keys(components).forEach(name => {
    app.component(name, components[name])
  })
}

export default {
  install
}

export {
  HRDocumentEditor,
  CanvasElement,
  PlaceholdersPanel,
  ImageUploadModal
}