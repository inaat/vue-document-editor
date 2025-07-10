# Vue HR Document Editor

A Vue 3 component library for creating HR documents with a drag-and-drop interface. Build professional HR documents, employee records, performance reviews, and more with an intuitive visual editor.

## Features

- 🎨 **Drag & Drop Interface** - Easy-to-use visual editor
- 📄 **Multiple Page Sizes** - Support for A4, A3, A5, Letter, Legal, Business Cards, and more
- 🔄 **Orientation Support** - Portrait and Landscape modes
- 📝 **Rich Text Editing** - Format text with different styles, fonts, and sizes
- 🏷️ **Smart Placeholders** - Pre-defined HR data placeholders
- 🖼️ **Image Support** - Upload images or use URLs
- 📊 **Tables** - Add and edit tables for structured data
- 📐 **Grid & Rulers** - Visual aids for precise positioning
- 📦 **Grouping** - Group elements together
- 💾 **HTML Export** - Generate clean HTML output
- 🌐 **Responsive Design** - Works on desktop and mobile

## Installation

```bash
npm install vue-document-editor
```

## Usage

### Basic Usage

```vue
<template>
  <div>
    <HRDocumentEditor />
  </div>
</template>

<script>
import { HRDocumentEditor } from 'vue-document-editor'
import 'vue-document-editor/dist/style.css'

export default {
  components: {
    HRDocumentEditor
  }
}
</script>
```

### Global Installation

```js
import { createApp } from 'vue'
import VueHRDocumentEditor from 'vue-document-editor'
import 'vue-document-editor/dist/style.css'

const app = createApp(App)
app.use(VueHRDocumentEditor)
app.mount('#app')
```

### Individual Components

```vue
<template>
  <div>
    <CanvasElement 
      :page-size="'a4'"
      :orientation="'Portrait'"
      :show-grid="true"
    />
    <PlaceholdersPanel />
  </div>
</template>

<script>
import { CanvasElement, PlaceholdersPanel } from 'vue-document-editor'

export default {
  components: {
    CanvasElement,
    PlaceholdersPanel
  }
}
</script>
```

## Components

### HRDocumentEditor

The main component that includes all features.

**Props:**
- None (fully self-contained)

**Events:**
- `@document-generated` - Emitted when HTML is generated
- `@element-selected` - Emitted when an element is selected
- `@canvas-cleared` - Emitted when canvas is cleared

### CanvasElement

The canvas where elements are placed and edited.

**Props:**
- `pageSize` (String) - Page size: 'a4', 'a3', 'a5', 'letter', 'legal', etc.
- `orientation` (String) - 'Portrait' or 'Landscape'
- `showGrid` (Boolean) - Show/hide grid overlay
- `showRuler` (Boolean) - Show/hide ruler
- `showPageBorder` (Boolean) - Show/hide page border

### PlaceholdersPanel

Panel with draggable placeholders and quick text options.

**Events:**
- `@add-custom-text` - Emitted when custom text is added
- `@drag-start` - Emitted when dragging starts

### ImageUploadModal

Modal for uploading images with size controls.

**Events:**
- `@close` - Emitted when modal is closed
- `@confirm` - Emitted when image is confirmed

## Available Placeholders

### Employee Information
- `{employee_name}` - Employee Name
- `{employee_id}` - Employee ID
- `{position}` - Position
- `{department}` - Department
- `{start_date}` - Start Date
- `{email}` - Email
- `{phone}` - Phone
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
- `{next_review}` - Next Review Date
- `{performance_rating}` - Performance Rating
- `{goals}` - Goals
- `{training_completed}` - Training Completed
- `{certifications}` - Certifications

### Image Placeholders
- `{{employee_image}}` - Employee Photo
- `{{company_logo}}` - Company Logo
- `{{signature_image}}` - Signature Image

## Page Sizes

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

## Development

### Setup

```bash
git clone <repository-url>
cd vue-document-editor
npm install
```

### Development Server

```bash
npm run dev
```

### Build Library

```bash
npm run build
```

### Build for Production

```bash
npm run build:lib
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License

## Support

For support, please open an issue on GitHub or contact the maintainers.

---

Built with ❤️ using Vue 3 and Vite