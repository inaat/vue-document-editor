<template>
  <div id="app">
    <HRDocumentEditor 
      :placeholders="customPlaceholders" 
      :showOutput="false"
      :loadHtml="htmlToLoad"
      @html-generated="handleHtmlGenerated"
    />

   <div v-if="generatedHtml" class="generated-output">
  <h2>🎉 Generated HTML Output:</h2>
  <button class="btn btn-primary" @click="handlePrintPreview">
    🖨️ Preview & Print
  </button>
  <div class="output-container">
    <iframe 
      ref="previewIframe"
      class="output-preview-iframe"
      sandbox="allow-same-origin allow-scripts"
      title="HTML Preview"
    ></iframe>
    <textarea 
      v-model="generatedHtml" 
      class="output-code"
      readonly
      placeholder="Generated HTML will appear here..."
    />
  </div>
</div>


   
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import HRDocumentEditor from './components/DocumentEditor.vue'

// Refs
const generatedHtml = ref('')
const htmlToLoad = ref('')
const previewIframe = ref(null)

// Load HTML after component mounts
onMounted(() => {
  setTimeout(() => {
    htmlToLoad.value = `
  <div class="hr-document">
    <div class="element element-placeholder" style="position: absolute; left: 165px; top: 124.625px; width: 150px; height: 25px; font-size: 14px; color: #6c757d; background-color: transparent; text-align: left; font-weight: bold; font-style: normal; text-decoration: none; font-family: Arial, sans-serif; z-index: 1;">
      {employee_name}
    </div>
    <div class="element element-placeholder" style="position: absolute; left: 381px; top: 246.625px; width: 150px; height: 25px; font-size: 14px; color: #6c757d; background-color: transparent; text-align: left; font-weight: bold; font-style: normal; text-decoration: none; font-family: Arial, sans-serif; z-index: 1;">
      {department}
    </div>
  </div>
`
    setTimeout(() => {
      htmlToLoad.value = ''
    }, 100)
  }, 500)
})

// Handle HTML generated event
const handleHtmlGenerated = async (html) => {
  generatedHtml.value = html
  console.log('🔥 Generated HTML received:', html.substring(0, 200) + '...')

  await nextTick()

  if (previewIframe.value) {
    const isolatedHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>HTML Preview</title>
  <style>
   
  </style>
</head>
<body>
  ${html}
</body>
</html>`

    // ✅ Use srcdoc for iframe preview
    previewIframe.value.srcdoc = isolatedHtml
  }
}
const handlePrintPreview = () => {
  const printHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Print Preview</title>
  <style>
    
  </style>
</head>
<body onload="window.print()">
  ${generatedHtml.value}
</body>
</html>
`

  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.open()
    printWindow.document.write(printHtml)
    printWindow.document.close()
  } else {
    alert('Pop-up blocked! Please allow pop-ups for this site.')
  }
}


// Load content after component mounts
onMounted(() => {
  setTimeout(() => {
    htmlToLoad.value = `
  <div class="hr-document">
    <div class="element element-placeholder" style="position: absolute; left: 165px; top: 124.625px; width: 150px; height: 25px; font-size: 14px; color: #6c757d; background-color: transparent; text-align: left; font-weight: bold; font-style: normal; text-decoration: none; font-family: Arial, sans-serif; z-index: 1;">
      {employee_name}
    </div>
    <div class="element element-placeholder" style="position: absolute; left: 381px; top: 246.625px; width: 150px; height: 25px; font-size: 14px; color: #6c757d; background-color: transparent; text-align: left; font-weight: bold; font-style: normal; text-decoration: none; font-family: Arial, sans-serif; z-index: 1;">
      {department}
    </div>
  </div>
`
    // Clear it after loading to reset the trigger
    setTimeout(() => {
      htmlToLoad.value = ''
    }, 100)
  }, 500)
})



// Placeholder config
const customPlaceholders = ref([
  {
    name: '👨‍💼 Staff Details',
    items: [
      { type: 'placeholder', content: '{employee_name}', icon: '👤', label: 'Employee Name' },
      { type: 'placeholder', content: '{employee_id}', icon: '🆔', label: 'Employee ID' },
      { type: 'placeholder', content: '{position}', icon: '💼', label: 'Position' },
      { type: 'placeholder', content: '{department}', icon: '🏢', label: 'Department' },
      { type: 'placeholder', content: '{start_date}', icon: '📅', label: 'Start Date' },
      { type: 'placeholder', content: '{email}', icon: '📧', label: 'Email' },
      { type: 'placeholder', content: '{phone}', icon: '📞', label: 'Phone' },
      { type: 'placeholder', content: '{address}', icon: '🏠', label: 'Address' }
    ]
  },
  {
    name: '💸 Compensation Package',
    items: [
      { type: 'placeholder', content: '{salary}', icon: '💰', label: 'Salary' },
      { type: 'placeholder', content: '{hourly_rate}', icon: '⏰', label: 'Hourly Rate' },
      { type: 'placeholder', content: '{bonus}', icon: '🎁', label: 'Bonus' },
      { type: 'placeholder', content: '{benefits}', icon: '🏥', label: 'Benefits' },
      { type: 'placeholder', content: '{vacation_days}', icon: '🌴', label: 'Vacation Days' },
      { type: 'placeholder', content: '{sick_days}', icon: '🏥', label: 'Sick Days' }
    ]
  },
  {
    name: '🏭 Organization Info',
    items: [
      { type: 'placeholder', content: '{company_name}', icon: '🏢', label: 'Company Name' },
      { type: 'placeholder', content: '{company_address}', icon: '📍', label: 'Company Address' },
      { type: 'placeholder', content: '{hr_contact}', icon: '👥', label: 'HR Contact' },
      { type: 'placeholder', content: '{manager_name}', icon: '👨‍💼', label: 'Manager Name' },
      { type: 'placeholder', content: '{company_phone}', icon: '📞', label: 'Company Phone' },
      { type: 'placeholder', content: '{company_email}', icon: '📧', label: 'Company Email' }
    ]
  },
  {
    name: '📊 Performance Metrics',
    items: [
      { type: 'placeholder', content: '{review_date}', icon: '📅', label: 'Review Date' },
      { type: 'placeholder', content: '{next_review}', icon: '⏭️', label: 'Next Review' },
      { type: 'placeholder', content: '{performance_rating}', icon: '⭐', label: 'Performance Rating' },
      { type: 'placeholder', content: '{goals}', icon: '🎯', label: 'Goals' },
      { type: 'placeholder', content: '{training_completed}', icon: '🎓', label: 'Training Completed' },
      { type: 'placeholder', content: '{certifications}', icon: '📜', label: 'Certifications' }
    ]
  },
  {
    name: '🖼️ Media Assets',
    items: [
      { type: 'image-placeholder', content: '{{employee_image}}', icon: '👤', label: '{{employee_image}}' },
      { type: 'image-placeholder', content: '{{company_logo}}', icon: '🏢', label: '{{company_logo}}' },
      { type: 'image-placeholder', content: '{{signature_image}}', icon: '✍️', label: '{{signature_image}}' },
      { type: 'image', content: 'upload', icon: '📁', label: 'Upload Image' },
      { type: 'image', content: 'url', icon: '🌐', label: 'Image from URL' }
    ]
  },
  {
    name: '⚡ Quick Labels',
    items: [
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
  },
  {
    name: '✨ Text Styles',
    items: [
      { type: 'formatted-text', content: 'Main Title', format: 'h1', icon: 'H1', label: 'Heading 1 (H1)' },
      { type: 'formatted-text', content: 'Section Title', format: 'h2', icon: 'H2', label: 'Heading 2 (H2)' },
      { type: 'formatted-text', content: 'Subsection Title', format: 'h3', icon: 'H3', label: 'Heading 3 (H3)' },
      { type: 'formatted-text', content: 'Minor Heading', format: 'h4', icon: 'H4', label: 'Heading 4 (H4)' },
      { type: 'formatted-text', content: 'Small Heading', format: 'h5', icon: 'H5', label: 'Heading 5 (H5)' },
      { type: 'formatted-text', content: 'Regular paragraph text', format: 'p', icon: 'P', label: 'Paragraph (P)' },
      { type: 'formatted-text', content: 'Important Note', format: 'bold', icon: 'B', label: 'Bold Text' },
      { type: 'formatted-text', content: 'Emphasized text', format: 'italic', icon: 'I', label: 'Italic Text' },
      { type: 'formatted-text', content: 'Underlined text', format: 'underline', icon: 'U', label: 'Underlined Text' }
    ]
  }
])
</script>

<style>
#app {
  min-height: 100vh;
  background: #f8f9fa;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.controls {
  background: white;
  padding: 20px;
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.controls h1 {
  margin: 0 0 20px 0;
  color: #333;
}

.control-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #218838;
  transform: translateY(-2px);
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background: #e0a800;
  transform: translateY(-2px);
}

.generated-output, .saved-output {
  margin: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.generated-output h2 {
  margin-top: 0;
  color: #333;
  text-align: center;
}

.output-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.output-preview-iframe {
  width: 100%;
  height: 420px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  overflow: auto;
}



.output-code, .saved-code {
  width: 100%;
  height: 300px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f8f9fa;
  resize: vertical;
}

.saved-code {
  height: 200px;
  background: #fff8e1;
  border-color: #ffc107;
}

@media (max-width: 768px) {
  .output-container {
    grid-template-columns: 1fr;
  }
  
  .control-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>