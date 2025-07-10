<template>
  <div id="app">
    <HRDocumentEditor
      :initial-elements="initialElements"
      @elements-changed="handleElementsChanged"
      @document-generated="handleDocumentGenerated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HRDocumentEditor } from './index'
import type { CanvasElement } from './types'

const initialElements = ref<CanvasElement[]>([
  {
    id: '1',
    type: 'text',
    content: 'Sample HR Document',
    position: { x: 100, y: 50 },
    selected: false,
    styles: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333'
    }
  },
  {
    id: '2',
    type: 'placeholder',
    content: '{employee_name}',
    position: { x: 100, y: 100 },
    selected: false
  }
])

const handleElementsChanged = (elements: CanvasElement[]) => {
  console.log('Elements changed:', elements)
}

const handleDocumentGenerated = (html: string) => {
  console.log('Document generated:', html)
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>