<template>
  <div class="placeholders-panel">
    <h3>🏷️ Drag to Canvas</h3>
    
    <div 
      v-for="(category, index) in placeholders" 
      :key="index"
      class="placeholder-category"
    >
      <h4>{{ category.name }}</h4>
      <div class="placeholder-grid">
        <div 
          v-for="placeholder in category.items" 
          :key="placeholder.content"
          class="placeholder-btn" 
          draggable="true" 
          @dragstart="startDrag($event, placeholder)"
        >
          <span>{{ placeholder.icon }}</span> {{ placeholder.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'PlaceholdersPanel',
  props: {
    placeholders: {
      type: Array,
      default: () => []
    }
  },
  emits: ['drag-start'],
  setup(props, { emit }) {

    const startDrag = (event, data) => {
      event.dataTransfer.setData('application/json', JSON.stringify(data))
      emit('drag-start', event, data)
    }

    return {
      startDrag
    }
  }
}
</script>

<style scoped>
.placeholders-panel {
  width: 300px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  max-height: 600px;
  overflow-y: auto;
}

.placeholders-panel h3 {
  margin-top: 0;
  color: #333;
}


.placeholder-category {
  margin-bottom: 20px;
}

.placeholder-category h4 {
  margin: 0 0 10px 0;
  color: #555;
  font-size: 14px;
}

.placeholder-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.placeholder-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: grab;
  font-size: 12px;
  transition: all 0.3s;
}

.placeholder-btn:hover {
  background: #e9ecef;
  border-color: #007bff;
  transform: translateY(-1px);
}

.placeholder-btn:active {
  cursor: grabbing;
}

.placeholder-btn span {
  font-size: 16px;
}

@media (max-width: 768px) {
  .placeholders-panel {
    width: 100%;
    max-height: 300px;
  }
}
</style>