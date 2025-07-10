<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>🖼️ Add Image</h3>
        <button class="close-btn" @click="closeModal">&times;</button>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label>Image Source:</label>
          <div class="source-options">
            <label class="radio-option">
              <input 
                type="radio" 
                v-model="imageSource" 
                value="upload"
              >
              <span>📁 Upload from Computer</span>
            </label>
            <label class="radio-option">
              <input 
                type="radio" 
                v-model="imageSource" 
                value="url"
              >
              <span>🌐 Image URL</span>
            </label>
          </div>
        </div>
        
        <div 
          v-if="imageSource === 'upload'"
          class="form-group"
        >
          <label>Select Image:</label>
          <input 
            type="file" 
            ref="fileInput"
            accept="image/*"
            @change="handleFileSelect"
          >
        </div>
        
        <div 
          v-if="imageSource === 'url'"
          class="form-group"
        >
          <label for="imageUrl">Image URL:</label>
          <input 
            type="url" 
            id="imageUrl"
            v-model="imageUrl"
            placeholder="https://example.com/image.jpg"
          >
        </div>
        
        <div class="form-group">
          <label>Image Dimensions:</label>
          <div class="dimensions-group">
            <div class="dimension-input">
              <label for="imageWidth">Width:</label>
              <input 
                type="number" 
                id="imageWidth"
                v-model="imageWidth"
                min="50" 
                max="500"
              >
              <span>px</span>
            </div>
            <div class="dimension-input">
              <label for="imageHeight">Height:</label>
              <input 
                type="number" 
                id="imageHeight"
                v-model="imageHeight"
                min="50" 
                max="500"
              >
              <span>px</span>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <div class="preset-sizes">
            <button 
              type="button" 
              class="preset-btn" 
              @click="setImageSize(120, 150)"
            >
              👤 Profile (120×150)
            </button>
            <button 
              type="button" 
              class="preset-btn" 
              @click="setImageSize(200, 100)"
            >
              📄 Banner (200×100)
            </button>
            <button 
              type="button" 
              class="preset-btn" 
              @click="setImageSize(150, 150)"
            >
              ⬜ Square (150×150)
            </button>
            <button 
              type="button" 
              class="preset-btn" 
              @click="setImageSize(300, 200)"
            >
              🖼️ Large (300×200)
            </button>
          </div>
        </div>
        
        <div 
          v-if="previewSrc"
          class="preview-section"
        >
          <label>Preview:</label>
          <img 
            :src="previewSrc" 
            alt="Preview"
            class="image-preview"
            :style="{ width: imageWidth + 'px', height: imageHeight + 'px' }"
          >
        </div>
      </div>
      
      <div class="modal-footer">
        <button 
          type="button" 
          class="btn btn-secondary" 
          @click="closeModal"
        >
          Cancel
        </button>
        <button 
          type="button" 
          class="btn btn-primary" 
          @click="confirmUpload"
          :disabled="!canConfirm"
        >
          Add Image
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'ImageUploadModal',
  emits: ['close', 'confirm'],
  setup(props, { emit }) {
    const fileInput = ref(null)
    const imageSource = ref('upload')
    const imageUrl = ref('')
    const imageWidth = ref(200)
    const imageHeight = ref(150)
    const selectedFile = ref(null)
    const previewSrc = ref('')

    const canConfirm = computed(() => {
      if (imageSource.value === 'upload') {
        return selectedFile.value !== null
      } else if (imageSource.value === 'url') {
        return imageUrl.value.trim() !== ''
      }
      return false
    })

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        selectedFile.value = file
        
        const reader = new FileReader()
        reader.onload = (e) => {
          previewSrc.value = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const setImageSize = (width, height) => {
      imageWidth.value = width
      imageHeight.value = height
    }

    const closeModal = () => {
      emit('close')
    }

    const confirmUpload = () => {
      let imageData = {
        width: imageWidth.value,
        height: imageHeight.value,
        alt: 'Uploaded image'
      }

      if (imageSource.value === 'upload' && selectedFile.value) {
        imageData.src = previewSrc.value
        imageData.alt = selectedFile.value.name
      } else if (imageSource.value === 'url' && imageUrl.value.trim()) {
        imageData.src = imageUrl.value.trim()
        imageData.alt = 'Image from URL'
      }

      emit('confirm', imageData)
    }

    watch(imageUrl, (newUrl) => {
      if (newUrl && imageSource.value === 'url') {
        previewSrc.value = newUrl
      }
    })

    watch(imageSource, (newSource) => {
      if (newSource === 'upload') {
        previewSrc.value = selectedFile.value ? previewSrc.value : ''
      } else if (newSource === 'url') {
        previewSrc.value = imageUrl.value
      }
    })

    return {
      fileInput,
      imageSource,
      imageUrl,
      imageWidth,
      imageHeight,
      selectedFile,
      previewSrc,
      canConfirm,
      handleFileSelect,
      setImageSize,
      closeModal,
      confirmUpload
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #dee2e6;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #000;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.source-options {
  display: flex;
  gap: 20px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.radio-option input {
  margin: 0;
}

.dimensions-group {
  display: flex;
  gap: 20px;
}

.dimension-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dimension-input label {
  margin-bottom: 0;
  font-weight: normal;
}

.dimension-input input {
  width: 80px;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.preset-sizes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}

.preset-btn {
  padding: 8px 12px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.preset-btn:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.preview-section {
  margin-top: 20px;
  text-align: center;
}

.image-preview {
  max-width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  object-fit: cover;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #dee2e6;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn:disabled:hover {
  background: #007bff;
}

input[type="file"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input[type="url"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .dimensions-group {
    flex-direction: column;
    gap: 10px;
  }
  
  .source-options {
    flex-direction: column;
    gap: 10px;
  }
}
</style>