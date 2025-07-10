<template>
  <div v-if="isOpen" class="modal" @click="handleBackdropClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>🖼️ Add Image</h3>
        <span class="close" @click="$emit('close')">&times;</span>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label>Image Source:</label>
          <div class="source-options">
            <label class="radio-option">
              <input 
                type="radio" 
                :value="'upload'" 
                :checked="sourceType === 'upload'"
                @change="$emit('update:sourceType', 'upload')"
              >
              <span>📁 Upload from Computer</span>
            </label>
            <label class="radio-option">
              <input 
                type="radio" 
                :value="'url'" 
                :checked="sourceType === 'url'"
                @change="$emit('update:sourceType', 'url')"
              >
              <span>🌐 Image URL</span>
            </label>
          </div>
        </div>
        
        <div v-if="sourceType === 'url'" class="form-group">
          <label for="imageUrl">Image URL:</label>
          <input 
            id="imageUrl"
            type="url" 
            :value="url"
            @input="$emit('update:url', ($event.target as HTMLInputElement).value)"
            placeholder="https://example.com/image.jpg"
          >
        </div>
        
        <div class="form-group">
          <label>Image Dimensions:</label>
          <div class="dimensions-group">
            <div class="dimension-input">
              <label for="imageWidth">Width:</label>
              <input 
                id="imageWidth"
                type="number" 
                :value="width"
                @input="$emit('update:width', Number(($event.target as HTMLInputElement).value))"
                min="50" 
                max="500"
              >
              <span>px</span>
            </div>
            <div class="dimension-input">
              <label for="imageHeight">Height:</label>
              <input 
                id="imageHeight"
                type="number" 
                :value="height"
                @input="$emit('update:height', Number(($event.target as HTMLInputElement).value))"
                min="50" 
                max="500"
              >
              <span>px</span>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <div class="preset-sizes">
            <button type="button" class="preset-btn" @click="setImageSize(120, 150)">
              👤 Profile (120×150)
            </button>
            <button type="button" class="preset-btn" @click="setImageSize(200, 100)">
              📄 Banner (200×100)
            </button>
            <button type="button" class="preset-btn" @click="setImageSize(150, 150)">
              ⬜ Square (150×150)
            </button>
            <button type="button" class="preset-btn" @click="setImageSize(300, 200)">
              🖼️ Large (300×200)
            </button>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="$emit('close')">
          Cancel
        </button>
        <button type="button" class="btn btn-primary" @click="$emit('confirm')">
          Add Image
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  sourceType: 'upload' | 'url'
  url: string
  width: number
  height: number
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  confirm: []
  'update:sourceType': [value: 'upload' | 'url']
  'update:url': [value: string]
  'update:width': [value: number]
  'update:height': [value: number]
}>()

const setImageSize = (width: number, height: number) => {
  emit('update:width', width)
  emit('update:height', height)
}

const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}
</script>

<style scoped>
.modal {
  display: block;
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
}

.modal-content {
  background-color: #fefefe;
  margin: 5% auto;
  padding: 0;
  border: none;
  border-radius: 12px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.4em;
  font-weight: 600;
}

.close {
  color: white;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close:hover {
  color: #f0f0f0;
}

.modal-body {
  padding: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.source-options {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.radio-option:hover {
  border-color: #667eea;
  background-color: #f8f9ff;
}

.radio-option input[type="radio"] {
  margin: 0;
}

.radio-option:has(input[type="radio"]:checked) {
  border-color: #667eea;
  background-color: #f8f9ff;
}

.radio-option input[type="radio"]:checked + span {
  color: #667eea;
  font-weight: 600;
}

.dimensions-group {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.dimension-input {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.dimension-input label {
  margin-bottom: 0;
  font-weight: normal;
  font-size: 0.9em;
}

.dimension-input input {
  width: 70px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
}

.dimension-input span {
  color: #666;
  font-size: 0.9em;
}

.preset-sizes {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.preset-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 0.85em;
  transition: all 0.3s ease;
}

.preset-btn:hover {
  background-color: #667eea;
  color: white;
  border-color: #667eea;
}

#imageUrl {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px 25px;
  border-top: 1px solid #e0e0e0;
  background-color: #f8f9fa;
  border-radius: 0 0 12px 12px;
}

.modal-footer .btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.modal-footer .btn-secondary {
  background-color: #6c757d;
  color: white;
}

.modal-footer .btn-secondary:hover {
  background-color: #5a6268;
}

.modal-footer .btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-footer .btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>