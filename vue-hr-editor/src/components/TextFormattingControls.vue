<template>
  <div class="text-formatting-controls">
    <!-- Heading Format -->
    <select 
      class="format-select"
      @change="$emit('apply-heading', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">Format</option>
      <option value="h1">H1 - Large Heading</option>
      <option value="h2">H2 - Heading</option>
      <option value="h3">H3 - Sub Heading</option>
      <option value="h4">H4 - Small Heading</option>
      <option value="h5">H5 - Tiny Heading</option>
      <option value="p">P - Normal Text</option>
      <option value="pre">PRE - Code/Preformatted</option>
    </select>
    
    <!-- Font Family -->
    <select 
      class="format-select"
      @change="$emit('apply-font-family', ($event.target as HTMLSelectElement).value)"
    >
      <option value="">Font Family</option>
      <option value="Arial, sans-serif">Arial</option>
      <option value="'Times New Roman', serif">Times New Roman</option>
      <option value="'Courier New', monospace">Courier New</option>
      <option value="Georgia, serif">Georgia</option>
      <option value="Verdana, sans-serif">Verdana</option>
      <option value="'Comic Sans MS', cursive">Comic Sans</option>
      <option value="Impact, fantasy">Impact</option>
      <option value="'Trebuchet MS', sans-serif">Trebuchet</option>
      <option value="'Amiri', serif">Amiri (Arabic)</option>
      <option value="'Noto Sans Arabic', sans-serif">Noto Sans Arabic</option>
      <option value="'Cairo', sans-serif">Cairo (Arabic)</option>
      <option value="'Scheherazade New', serif">Scheherazade New (Arabic)</option>
      <option value="'Markazi Text', serif">Markazi Text (Arabic)</option>
    </select>
    
    <!-- Color Controls -->
    <input 
      type="color" 
      class="color-input"
      title="Text Color"
      @change="$emit('apply-text-color', ($event.target as HTMLInputElement).value)"
    >
    <input 
      type="color" 
      class="color-input"
      title="Background Color" 
      value="#ffffff"
      @change="$emit('apply-background-color', ($event.target as HTMLInputElement).value)"
    >
    
    <!-- Text Formatting Buttons -->
    <button class="format-btn" @click="$emit('format-text', 'bold')">
      <strong>B</strong>
    </button>
    <button class="format-btn" @click="$emit('format-text', 'italic')">
      <em>I</em>
    </button>
    <button class="format-btn" @click="$emit('format-text', 'underline')">
      <u>U</u>
    </button>
    
    <!-- Font Size Controls -->
    <button class="format-btn" @click="$emit('increase-font-size')">
      🔍+
    </button>
    <button class="format-btn" @click="$emit('decrease-font-size')">
      🔍-
    </button>
    
    <!-- Text Alignment -->
    <button class="format-btn" @click="$emit('align-text', 'left')">
      ⬅️ Left
    </button>
    <button class="format-btn" @click="$emit('align-text', 'center')">
      ↔️ Center
    </button>
    <button class="format-btn" @click="$emit('align-text', 'right')">
      ➡️ Right
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  selectedElement: any
}

defineProps<Props>()

defineEmits<{
  'apply-heading': [format: string]
  'apply-font-family': [fontFamily: string]
  'apply-text-color': [color: string]
  'apply-background-color': [color: string]
  'format-text': [command: string]
  'align-text': [alignment: string]
  'increase-font-size': []
  'decrease-font-size': []
}>()
</script>

<style scoped>
.text-formatting-controls {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.format-select {
  background: #ffc107;
  color: #212529;
  border: none;
  border-radius: 8px;
  padding: 8px;
  font-size: 14px;
  cursor: pointer;
}

.color-input {
  width: 40px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.format-btn {
  padding: 8px 12px;
  background: #ffc107;
  color: #212529;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.format-btn:hover {
  background: #e0a800;
  transform: translateY(-1px);
}
</style>