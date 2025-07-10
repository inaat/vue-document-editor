import DocumentEditor from './components/DocumentEditor.vue'
import CanvasElement from './components/CanvasElement.vue'
import PlaceholdersPanel from './components/PlaceholdersPanel.vue'
import ImageUploadModal from './components/ImageUploadModal.vue'

const components = {
  DocumentEditor,
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
  DocumentEditor,
  CanvasElement,
  PlaceholdersPanel,
  ImageUploadModal
}