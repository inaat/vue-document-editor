<template>
  <div class="placeholders-panel">
    <h3>🏷️ Drag to Canvas</h3>
    
    <div class="add-text-form">
      <input 
        v-model="customText"
        type="text" 
        placeholder="Type text to add..."
        @keypress.enter="handleAddCustomText"
      >
      <button @click="handleAddCustomText">Add</button>
    </div>

    <div class="placeholder-category">
      <h4>👤 Employee Information</h4>
      <div class="placeholder-grid">
        <div 
          v-for="placeholder in employeeInfo"
          :key="placeholder.content"
          class="placeholder-btn" 
          draggable="true"
          @dragstart="handleDragStart($event, placeholder)"
          @dragend="handleDragEnd"
        >
          <span>{{ placeholder.icon }}</span> {{ placeholder.label }}
        </div>
      </div>
    </div>

    <div class="placeholder-category">
      <h4>💰 Salary & Benefits</h4>
      <div class="placeholder-grid">
        <div 
          v-for="placeholder in salaryBenefits"
          :key="placeholder.content"
          class="placeholder-btn" 
          draggable="true"
          @dragstart="handleDragStart($event, placeholder)"
          @dragend="handleDragEnd"
        >
          <span>{{ placeholder.icon }}</span> {{ placeholder.label }}
        </div>
      </div>
    </div>

    <div class="placeholder-category">
      <h4>🏢 Company Information</h4>
      <div class="placeholder-grid">
        <div 
          v-for="placeholder in companyInfo"
          :key="placeholder.content"
          class="placeholder-btn" 
          draggable="true"
          @dragstart="handleDragStart($event, placeholder)"
          @dragend="handleDragEnd"
        >
          <span>{{ placeholder.icon }}</span> {{ placeholder.label }}
        </div>
      </div>
    </div>

    <div class="placeholder-category">
      <h4>📋 Performance & Dates</h4>
      <div class="placeholder-grid">
        <div 
          v-for="placeholder in performanceDates"
          :key="placeholder.content"
          class="placeholder-btn" 
          draggable="true"
          @dragstart="handleDragStart($event, placeholder)"
          @dragend="handleDragEnd"
        >
          <span>{{ placeholder.icon }}</span> {{ placeholder.label }}
        </div>
      </div>
    </div>

    <div class="placeholder-category">
      <h4>🖼️ Employee Images</h4>
      <div class="placeholder-grid">
        <div 
          v-for="placeholder in employeeImages"
          :key="placeholder.content"
          class="placeholder-btn" 
          draggable="true"
          @dragstart="handleDragStart($event, placeholder)"
          @dragend="handleDragEnd"
        >
          <span>{{ placeholder.icon }}</span> {{ placeholder.label }}
        </div>
      </div>
    </div>

    <div class="placeholder-category">
      <h4>📝 Quick Text</h4>
      <div class="placeholder-grid">
        <div 
          v-for="placeholder in quickText"
          :key="placeholder.content"
          class="placeholder-btn" 
          draggable="true"
          @dragstart="handleDragStart($event, placeholder)"
          @dragend="handleDragEnd"
        >
          <span>{{ placeholder.icon }}</span> {{ placeholder.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface PlaceholderItem {
  type: string
  content: string
  icon: string
  label: string
}

const emit = defineEmits<{
  'drag-start': [item: PlaceholderItem]
  'add-custom-text': [text: string]
}>()

const customText = ref('')

const employeeInfo: PlaceholderItem[] = [
  { type: 'placeholder', content: '{employee_name}', icon: '👤', label: 'Employee Name' },
  { type: 'placeholder', content: '{employee_id}', icon: '🆔', label: 'Employee ID' },
  { type: 'placeholder', content: '{position}', icon: '💼', label: 'Position' },
  { type: 'placeholder', content: '{department}', icon: '🏢', label: 'Department' },
  { type: 'placeholder', content: '{start_date}', icon: '📅', label: 'Start Date' },
  { type: 'placeholder', content: '{email}', icon: '📧', label: 'Email' },
  { type: 'placeholder', content: '{phone}', icon: '📞', label: 'Phone' },
  { type: 'placeholder', content: '{address}', icon: '🏠', label: 'Address' }
]

const salaryBenefits: PlaceholderItem[] = [
  { type: 'placeholder', content: '{salary}', icon: '💰', label: 'Salary' },
  { type: 'placeholder', content: '{hourly_rate}', icon: '⏰', label: 'Hourly Rate' },
  { type: 'placeholder', content: '{bonus}', icon: '🎁', label: 'Bonus' },
  { type: 'placeholder', content: '{benefits}', icon: '🏥', label: 'Benefits' },
  { type: 'placeholder', content: '{vacation_days}', icon: '🌴', label: 'Vacation Days' },
  { type: 'placeholder', content: '{sick_days}', icon: '🏥', label: 'Sick Days' }
]

const companyInfo: PlaceholderItem[] = [
  { type: 'placeholder', content: '{company_name}', icon: '🏢', label: 'Company Name' },
  { type: 'placeholder', content: '{company_address}', icon: '📍', label: 'Company Address' },
  { type: 'placeholder', content: '{hr_contact}', icon: '👥', label: 'HR Contact' },
  { type: 'placeholder', content: '{manager_name}', icon: '👨‍💼', label: 'Manager Name' },
  { type: 'placeholder', content: '{company_phone}', icon: '📞', label: 'Company Phone' },
  { type: 'placeholder', content: '{company_email}', icon: '📧', label: 'Company Email' }
]

const performanceDates: PlaceholderItem[] = [
  { type: 'placeholder', content: '{review_date}', icon: '📅', label: 'Review Date' },
  { type: 'placeholder', content: '{next_review}', icon: '⏭️', label: 'Next Review' },
  { type: 'placeholder', content: '{performance_rating}', icon: '⭐', label: 'Performance Rating' },
  { type: 'placeholder', content: '{goals}', icon: '🎯', label: 'Goals' },
  { type: 'placeholder', content: '{training_completed}', icon: '🎓', label: 'Training Completed' },
  { type: 'placeholder', content: '{certifications}', icon: '📜', label: 'Certifications' }
]

const employeeImages: PlaceholderItem[] = [
  { type: 'image-placeholder', content: '{{employee_image}}', icon: '👤', label: '{{employee_image}}' },
  { type: 'image-placeholder', content: '{{company_logo}}', icon: '🏢', label: '{{company_logo}}' },
  { type: 'image-placeholder', content: '{{signature_image}}', icon: '✍️', label: '{{signature_image}}' },
  { type: 'image', content: 'upload', icon: '📁', label: 'Upload Image' },
  { type: 'image', content: 'url', icon: '🌐', label: 'Image from URL' }
]

const quickText: PlaceholderItem[] = [
  { type: 'text', content: 'EMPLOYEE RECORD', icon: '📄', label: '"EMPLOYEE RECORD" Title' },
  { type: 'text', content: 'PERFORMANCE REVIEW', icon: '📋', label: '"PERFORMANCE REVIEW" Title' },
  { type: 'text', content: 'JOB OFFER LETTER', icon: '💼', label: '"JOB OFFER LETTER" Title' },
  { type: 'text', content: 'EMPLOYEE HANDBOOK', icon: '📚', label: '"EMPLOYEE HANDBOOK" Title' },
  { type: 'text', content: 'Employee Details:', icon: '👤', label: '"Employee Details:" Label' },
  { type: 'text', content: 'Department:', icon: '🏢', label: '"Department:" Label' },
  { type: 'text', content: 'Salary:', icon: '💰', label: '"Salary:" Label' },
  { type: 'text', content: 'HR Manager:', icon: '👥', label: '"HR Manager:" Label' },
  { type: 'text', content: 'Date:', icon: '📅', label: '"Date:" Label' },
  { type: 'text', content: 'Signature:', icon: '✍️', label: '"Signature:" Label' }
]

const handleDragStart = (e: DragEvent, item: PlaceholderItem) => {
  if (e.target instanceof HTMLElement) {
    e.target.classList.add('dragging')
  }
  e.dataTransfer!.effectAllowed = 'copy'
  emit('drag-start', item)
}

const handleDragEnd = (e: DragEvent) => {
  if (e.target instanceof HTMLElement) {
    e.target.classList.remove('dragging')
  }
}

const handleAddCustomText = () => {
  if (customText.value.trim()) {
    emit('add-custom-text', customText.value.trim())
    customText.value = ''
  }
}
</script>

<style scoped>
.placeholders-panel {
  width: 300px;
  max-height: 600px;
  overflow-y: auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.placeholders-panel h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.2em;
  text-align: center;
}

.add-text-form {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.add-text-form input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.add-text-form button {
  padding: 8px 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-text-form button:hover {
  background: #0056b3;
}

.placeholder-category {
  margin-bottom: 25px;
}

.placeholder-category h4 {
  margin: 0 0 10px 0;
  color: #555;
  font-size: 1em;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 5px;
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
  padding: 10px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: grab;
  transition: all 0.2s ease;
  font-size: 0.9em;
  user-select: none;
}

.placeholder-btn:hover {
  background: #e3f2fd;
  border-color: #2196f3;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.placeholder-btn.dragging {
  opacity: 0.5;
  transform: rotate(3deg);
}

.placeholder-btn span {
  font-size: 1.1em;
  flex-shrink: 0;
}

/* Scrollbar styling */
.placeholders-panel::-webkit-scrollbar {
  width: 6px;
}

.placeholders-panel::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.placeholders-panel::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.placeholders-panel::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>