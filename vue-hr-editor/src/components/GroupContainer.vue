<template>
  <div
    v-if="visible"
    :class="containerClasses"
    :style="containerStyles"
    @click="$emit('select', group.id)"
    @mousedown="handleMouseDown"
  >
    <div class="group-label">{{ group.id.replace('group_', 'Group ') }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Group, ElementPosition } from '../types'

interface Props {
  group: Group
  visible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [id: string]
  move: [id: string, position: ElementPosition]
}>()

const containerClasses = computed(() => [
  'group-container'
])

const containerStyles = computed(() => ({
  left: `${props.group.position.x}px`,
  top: `${props.group.position.y}px`,
  width: `${props.group.dimensions.width}px`,
  height: `${props.group.dimensions.height}px`
}))

const handleMouseDown = (e: MouseEvent) => {
  if (e.target instanceof HTMLElement && e.target.classList.contains('group-label')) {
    return
  }
  
  // Start group drag
  e.preventDefault()
  e.stopPropagation()
  
  const startX = e.clientX
  const startY = e.clientY
  const startLeft = props.group.position.x
  const startTop = props.group.position.y
  
  const handleMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY
    const newPosition = {
      x: Math.max(0, startLeft + deltaX),
      y: Math.max(0, startTop + deltaY)
    }
    emit('move', props.group.id, newPosition)
  }
  
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}
</script>

<style scoped>
.group-container {
  position: absolute;
  border: 2px dashed #28a745;
  background: rgba(40, 167, 69, 0.1);
  border-radius: 4px;
  cursor: move;
  z-index: 1;
  transition: all 0.3s ease;
}

.group-container:hover {
  background: rgba(40, 167, 69, 0.2);
  border-color: #1e7e34;
}

.group-label {
  position: absolute;
  top: -20px;
  left: 0;
  background: #28a745;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  pointer-events: none;
}
</style>