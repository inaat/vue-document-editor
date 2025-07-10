# Vue HR Document Editor 📝

A powerful Vue 3 component library for creating HR document layouts with drag & drop functionality, resize handles, and professional modal interfaces.

## ✨ Features

- **🎯 Drag & Drop Interface** - Intuitive element placement
- **📐 Resize Handles** - Corner resize for images and table cells
- **🏗️ Table Editor** - Full table creation with cell-level resizing
- **🖼️ Image Management** - Upload or URL-based images with modal interface
- **📝 Text Formatting** - Rich text controls and styling options
- **📦 Grouping System** - Group elements and move them together
- **📏 Grid & Rulers** - Visual alignment aids
- **📄 Multiple Page Sizes** - A4, A3, Letter, Business Card, and more
- **🔄 Orientation Support** - Portrait and landscape modes
- **⚡ Vue 3 + TypeScript** - Modern development with full type safety

## 🚀 Installation

```bash
npm install vue-hr-document-editor
```

## 📖 Usage

### Basic Usage

```vue
<template>
  <HRDocumentEditor
    :initial-elements="elements"
    @elements-changed="handleElementsChanged"
    @document-generated="handleDocumentGenerated"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HRDocumentEditor } from 'vue-hr-document-editor'
import type { CanvasElement } from 'vue-hr-document-editor'

const elements = ref<CanvasElement[]>([])

const handleElementsChanged = (newElements: CanvasElement[]) => {
  console.log('Elements updated:', newElements)
}

const handleDocumentGenerated = (html: string) => {
  console.log('Generated HTML:', html)
}
</script>
```

### Plugin Installation

```typescript
import { createApp } from 'vue'
import HRDocumentEditorPlugin from 'vue-hr-document-editor'
import App from './App.vue'

const app = createApp(App)
app.use(HRDocumentEditorPlugin)
app.mount('#app')
```

### Individual Components

```vue
<template>
  <div>
    <CanvasElement 
      :element="element"
      :selected="false"
      @select="handleSelect"
      @delete="handleDelete"
      @update="handleUpdate"
    />
    
    <ImageUploadModal
      :is-open="modalOpen"
      :source-type="'upload'"
      :width="200"
      :height="150"
      @close="modalOpen = false"
      @confirm="handleImageConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { 
  CanvasElement, 
  ImageUploadModal 
} from 'vue-hr-document-editor'
</script>
```

## 🎛️ Component Props

### HRDocumentEditor

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialElements` | `CanvasElement[]` | `[]` | Initial canvas elements |
| `canvasWidth` | `string` | `'794px'` | Canvas width |
| `canvasHeight` | `string` | `'1123px'` | Canvas height |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `elements-changed` | `CanvasElement[]` | Fired when elements are modified |
| `document-generated` | `string` | Fired when HTML document is generated |

## 🏗️ Element Types

### Text Element
```typescript
{
  id: 'text-1',
  type: 'text',
  content: 'Sample Text',
  position: { x: 100, y: 50 },
  selected: false,
  styles: {
    fontSize: '16px',
    color: '#333'
  }
}
```

### Image Element
```typescript
{
  id: 'img-1',
  type: 'image',
  content: 'https://example.com/image.jpg',
  position: { x: 200, y: 100 },
  dimensions: { width: 200, height: 150 },
  selected: false
}
```

### Placeholder Element
```typescript
{
  id: 'placeholder-1',
  type: 'placeholder',
  content: '{employee_name}',
  position: { x: 50, y: 200 },
  selected: false
}
```

### Table Element
```typescript
{
  id: 'table-1',
  type: 'table',
  content: '',
  position: { x: 100, y: 300 },
  dimensions: { width: 200, height: 100 },
  selected: false
}
```

## 🎨 Available Placeholders

### Employee Information
- `{employee_name}` - Employee Name
- `{employee_id}` - Employee ID
- `{position}` - Job Position
- `{department}` - Department
- `{start_date}` - Start Date
- `{email}` - Email Address
- `{phone}` - Phone Number
- `{address}` - Address

### Salary & Benefits
- `{salary}` - Salary
- `{hourly_rate}` - Hourly Rate
- `{bonus}` - Bonus
- `{benefits}` - Benefits
- `{vacation_days}` - Vacation Days
- `{sick_days}` - Sick Days

### Company Information
- `{company_name}` - Company Name
- `{company_address}` - Company Address
- `{hr_contact}` - HR Contact
- `{manager_name}` - Manager Name
- `{company_phone}` - Company Phone
- `{company_email}` - Company Email

### Performance & Dates
- `{review_date}` - Review Date
- `{next_review}` - Next Review
- `{performance_rating}` - Performance Rating
- `{goals}` - Goals
- `{training_completed}` - Training Completed
- `{certifications}` - Certifications

## 📏 Page Sizes

The editor supports multiple page sizes:

### Standard Pages
- **A4** (210×297mm)
- **A3** (297×420mm)
- **A5** (148×210mm)
- **Letter** (8.5×11in)
- **Legal** (8.5×14in)
- **Tabloid** (11×17in)

### Card Sizes
- **Business Card** (3.5×2in)
- **ID Card** (3.375×2.125in)
- **Badge** (4×3in)
- **Postcard** (6×4in)
- **Greeting Card** (5×7in)
- **Certificate** (11×8.5in)

### Digital Sizes
- **Mobile** (375×812px)
- **Tablet** (768×1024px)
- **Desktop** (1920×1080px)

## 🔧 Development

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/vue-hr-document-editor
cd vue-hr-document-editor

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check
```

### Project Structure
```
src/
├── components/           # Vue components
│   ├── HRDocumentEditor.vue
│   ├── CanvasElement.vue
│   ├── ImageUploadModal.vue
│   ├── PlaceholdersPanel.vue
│   ├── TextFormattingControls.vue
│   └── GroupContainer.vue
├── types.ts             # TypeScript definitions
├── style.css           # Component styles
├── index.ts            # Main export
└── demo.vue            # Demo component
```

## 🎯 Roadmap

- [ ] **Undo/Redo System** - Action history management
- [ ] **Template Library** - Pre-built HR document templates
- [ ] **PDF Export** - Direct PDF generation
- [ ] **Cloud Storage** - Save/load documents from cloud
- [ ] **Collaboration** - Real-time collaborative editing
- [ ] **Advanced Tables** - Merged cells, formulas
- [ ] **Charts & Graphs** - Data visualization components
- [ ] **Mobile App** - React Native version

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- TypeScript team for excellent tooling
- All contributors and users of this library

## 📞 Support

- 📧 Email: support@example.com
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/vue-hr-document-editor/discussions)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/vue-hr-document-editor/issues)

---

Made with ❤️ by [Your Name](https://github.com/yourusername)