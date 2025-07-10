    // Global variables
    let draggedItem = null;
    let selectedElement = null;
    let selectedElements = [];
    let selectedCell = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let groups = [];
    let groupCounter = 0;

    // Add text element
    function addTextElement() {
      const canvas = document.getElementById('canvas');
      const rect = canvas.getBoundingClientRect();
      const x = Math.random() * (rect.width - 200) + 50;
      const y = Math.random() * (rect.height - 100) + 50;
      
      createElement('text', 'Click to edit text...', x, y);
    }

    // Add image element
    function addImageElement() {
      openImageModal();
    }

    // Add custom text
    function addCustomText() {
      const input = document.getElementById('custom-text');
      const text = input.value.trim();
      
      if (!text) {
        alert('Please enter some text');
        return;
      }
      
      const canvas = document.getElementById('canvas');
      const rect = canvas.getBoundingClientRect();
      const x = Math.random() * (rect.width - 200) + 50;
      const y = Math.random() * (rect.height - 100) + 50;
      
      createElement('text', text, x, y);
      input.value = '';
    }

    function applyHeading(format) {
      if (!selectedElement) {
        alert('Please select a text element first');
        return;
      }
      
      const textElement = selectedElement.querySelector('.text-editable');
      if (!textElement) {
        alert('Selected element is not editable text');
        return;
      }
      
      if (!format) return;
      
      // Reset styles
      textElement.style.fontSize = '';
      textElement.style.fontWeight = '';
      textElement.style.margin = '';
      textElement.style.whiteSpace = '';
      textElement.style.fontFamily = '';
      textElement.style.background = '';
      textElement.style.padding = '';
      textElement.style.border = '';
      textElement.style.borderRadius = '';
      
      // Apply new styles
      switch(format) {
        case 'h1':
          textElement.style.fontSize = '32px';
          textElement.style.fontWeight = 'bold';
          break;
        case 'h2':
          textElement.style.fontSize = '28px';
          textElement.style.fontWeight = 'bold';
          break;
        case 'h3':
          textElement.style.fontSize = '24px';
          textElement.style.fontWeight = 'bold';
          break;
        case 'h4':
          textElement.style.fontSize = '20px';
          textElement.style.fontWeight = 'bold';
          break;
        case 'h5':
          textElement.style.fontSize = '16px';
          textElement.style.fontWeight = 'bold';
          break;
        case 'pre':
          textElement.style.fontSize = '12px';
          textElement.style.fontFamily = 'Courier New, monospace';
          textElement.style.whiteSpace = 'pre-wrap';
          textElement.style.background = '#f8f9fa';
          textElement.style.padding = '8px';
          textElement.style.border = '1px solid #dee2e6';
          textElement.style.borderRadius = '4px';
          break;
        case 'p':
          textElement.style.fontSize = '14px';
          textElement.style.fontWeight = 'normal';
          break;
      }
      
      document.getElementById('headingFormat').value = '';
    }

    function applyFontFamily(fontFamily) {
      if (!selectedElement) {
        alert('Please select a text element first');
        return;
      }
      
      const textElement = selectedElement.querySelector('.text-editable');
      if (!textElement) {
        alert('Selected element is not editable text');
        return;
      }
      
      if (!fontFamily) return;
      
      textElement.style.fontFamily = fontFamily;
      document.getElementById('fontFamily').value = '';
    }

    function applyTextColor(color) {
      if (!selectedElement) {
        alert('Please select a text element first');
        return;
      }
      
      const textElement = selectedElement.querySelector('.text-editable');
      if (!textElement) {
        alert('Selected element is not editable text');
        return;
      }
      
      textElement.style.color = color;
    }

    function applyBackgroundColor(color) {
      if (!selectedElement) {
        alert('Please select a text element first');
        return;
      }
      
      const textElement = selectedElement.querySelector('.text-editable');
      if (!textElement) {
        alert('Selected element is not editable text');
        return;
      }
      
      if (color === '#ffffff') {
        textElement.style.backgroundColor = 'transparent';
      } else {
        textElement.style.backgroundColor = color;
      }
    }

    function increaseFontSize() {
      if (!selectedElement) {
        alert('Please select a text element first');
        return;
      }
      
      const textElement = selectedElement.querySelector('.text-editable');
      if (!textElement) {
        alert('Selected element is not editable text');
        return;
      }
      
      const currentSize = parseInt(window.getComputedStyle(textElement).fontSize);
      textElement.style.fontSize = (currentSize + 2) + 'px';
    }

    function decreaseFontSize() {
      if (!selectedElement) {
        alert('Please select a text element first');
        return;
      }
      
      const textElement = selectedElement.querySelector('.text-editable');
      if (!textElement) {
        alert('Selected element is not editable text');
        return;
      }
      
      const currentSize = parseInt(window.getComputedStyle(textElement).fontSize);
      if (currentSize > 8) {
        textElement.style.fontSize = (currentSize - 2) + 'px';
      }
    }

    function saveTemplate() {
      const canvas = document.getElementById('canvas');
      const elements = canvas.querySelectorAll('.canvas-element');
      
      // Get current canvas dimensions and orientation
      const canvasStyles = window.getComputedStyle(canvas);
      const canvasWidth = canvasStyles.width;
      const canvasHeight = canvasStyles.height;
      const isLandscape = canvas.classList.contains('landscape');
      
      // Get current page size class
      const sizeClasses = ['a4', 'a3', 'a5', 'letter', 'legal', 'tabloid', 
                          'business-card', 'id-card', 'badge', 'postcard', 
                          'greeting-card', 'certificate', 'mobile', 'tablet', 'desktop'];
      
      let currentSize = 'a4';
      sizeClasses.forEach(cls => {
        if (canvas.classList.contains(cls)) {
          currentSize = cls;
        }
      });
      
      // Add CSS for proper orientation and print handling
      let css = `
        <style>
          @media print {
            @page {
              size: ${isLandscape ? 'landscape' : 'portrait'};
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
            }
            .document-container {
              page-break-inside: avoid;
              break-inside: avoid;
            }
          }
          
          .document-container {
            position: relative;
            width: ${canvasWidth};
            height: ${canvasHeight};
            background: white;
            font-family: Arial, sans-serif;
            margin: 0 auto;
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
          }
        </style>
      `;
      
      let html = css + `<div class="document-container">`;
      
      elements.forEach(element => {
        const input = element.querySelector('input');
        const textDiv = element.querySelector('.text-editable');
        const imageContainer = element.querySelector('.image-container');
        const imagePlaceholder = element.querySelector('.image-placeholder-element');
        const left = element.style.left;
        const top = element.style.top;
        
        if (input && input.classList.contains('placeholder-element')) {
          const content = input.value;
          html += `<div style="position: absolute; left: ${left}; top: ${top}; background: linear-gradient(45deg, #fff3cd, #ffeaa7); color: #856404; padding: 4px 8px; border-radius: 4px; font-weight: bold; border: 1px solid #ffeaa7; font-family: Arial, sans-serif; font-size: 14px;">${content}</div>`;
        } else if (imagePlaceholder) {
          const content = imagePlaceholder.getAttribute('data-placeholder');
          const width = imagePlaceholder.style.width || '120px';
          const height = imagePlaceholder.style.height || '150px';
          html += `<div style="position: absolute; left: ${left}; top: ${top}; width: ${width}; height: ${height}; background: linear-gradient(45deg, #e3f2fd, #bbdefb); color: #1976d2; padding: 20px; border-radius: 8px; font-weight: bold; border: 2px dashed #2196f3; font-family: Arial, sans-serif; font-size: 14px; text-align: center; display: flex; align-items: center; justify-content: center;">${content}</div>`;
        } else if (imageContainer) {
          const img = imageContainer.querySelector('img');
          if (img) {
            const width = imageContainer.style.width || '150px';
            const height = imageContainer.style.height || '100px';
            html += `<div style="position: absolute; left: ${left}; top: ${top}; width: ${width}; height: ${height};"><img src="${img.src}" alt="${img.alt}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 4px;"></div>`;
          }
        } else if (textDiv) {
          const content = textDiv.innerHTML;
          const fontSize = textDiv.style.fontSize || '14px';
          const fontWeight = textDiv.style.fontWeight || 'normal';
          const fontStyle = textDiv.style.fontStyle || 'normal';
          const textDecoration = textDiv.style.textDecoration || 'none';
          const fontFamily = textDiv.style.fontFamily || 'Arial, sans-serif';
          const color = textDiv.style.color || '#000000';
          const backgroundColor = textDiv.style.backgroundColor || 'transparent';
          const whiteSpace = textDiv.style.whiteSpace || 'normal';
          const padding = textDiv.style.padding || '0';
          const border = textDiv.style.border || 'none';
          const borderRadius = textDiv.style.borderRadius || '0';
          const textAlign = textDiv.style.textAlign || 'left';
          
          html += `<div style="position: absolute; left: ${left}; top: ${top}; font-family: ${fontFamily}; font-size: ${fontSize}; font-weight: ${fontWeight}; font-style: ${fontStyle}; text-decoration: ${textDecoration}; color: ${color}; background-color: ${backgroundColor}; white-space: ${whiteSpace}; padding: ${padding}; border: ${border}; border-radius: ${borderRadius}; text-align: ${textAlign}; line-height: 1.4;">${content}</div>`;
        } else {
          // Handle horizontal lines
          const horizontalLine = element.querySelector('.horizontal-line-element');
          if (horizontalLine) {
            const width = horizontalLine.style.width || horizontalLine.offsetWidth + 'px';
            const height = horizontalLine.offsetHeight + 'px';
            const isDashed = horizontalLine.classList.contains('dashed');
            const isDotted = horizontalLine.classList.contains('dotted');
            const isThick = horizontalLine.classList.contains('thick');
            
            let style = `position: absolute; left: ${left}; top: ${top}; width: ${width}; height: ${height}; background: #333; border-radius: 1px;`;
            
            if (isDashed) {
              style = `position: absolute; left: ${left}; top: ${top}; width: ${width}; height: ${height}; background: transparent; border-top: ${isThick ? '4px' : '2px'} dashed #333;`;
            } else if (isDotted) {
              style = `position: absolute; left: ${left}; top: ${top}; width: ${width}; height: ${height}; background: transparent; border-top: ${isThick ? '4px' : '2px'} dotted #333;`;
            } else if (isThick) {
              style = `position: absolute; left: ${left}; top: ${top}; width: ${width}; height: 4px; background: #333; border-radius: 1px;`;
            }
            
            html += `<div style="${style}"></div>`;
          }
          
          // Handle vertical lines
          const verticalLine = element.querySelector('.vertical-line-element');
          if (verticalLine) {
            const width = verticalLine.offsetWidth + 'px';
            const height = verticalLine.style.height || verticalLine.offsetHeight + 'px';
            const isDashed = verticalLine.classList.contains('dashed');
            const isDotted = verticalLine.classList.contains('dotted');
            const isThick = verticalLine.classList.contains('thick');
            
            let style = `position: absolute; left: ${left}; top: ${top}; width: ${width}; height: ${height}; background: #333; border-radius: 1px;`;
            
            if (isDashed) {
              style = `position: absolute; left: ${left}; top: ${top}; width: ${width}; height: ${height}; background: transparent; border-left: ${isThick ? '4px' : '2px'} dashed #333;`;
            } else if (isDotted) {
              style = `position: absolute; left: ${left}; top: ${top}; width: ${width}; height: ${height}; background: transparent; border-left: ${isThick ? '4px' : '2px'} dotted #333;`;
            } else if (isThick) {
              style = `position: absolute; left: ${left}; top: ${top}; width: 4px; height: ${height}; background: #333; border-radius: 1px;`;
            }
            
            html += `<div style="${style}"></div>`;
          }
          
          // Handle tables
          const table = element.querySelector('.table-element');
          if (table) {
            const tableWidth = element.style.width || '200px';
            const tableHeight = element.style.height || '100px';
            
            html += `<div style="position: absolute; left: ${left}; top: ${top}; width: ${tableWidth}; height: ${tableHeight};">`;
            html += `<table style="border-collapse: collapse; background: white; border: 1px solid #333; width: 100%; height: 100%;">`;
            
            for (let i = 0; i < table.rows.length; i++) {
              html += '<tr>';
              for (let j = 0; j < table.rows[i].cells.length; j++) {
                const cell = table.rows[i].cells[j];
                const cellAlign = cell.style.textAlign || 'left';
                const cellWidth = cell.style.width || 'auto';
                const cellHeight = cell.style.height || 'auto';
                html += `<td style="border: 1px solid #333; padding: 8px; min-width: 80px; min-height: 30px; vertical-align: top; text-align: ${cellAlign}; width: ${cellWidth}; height: ${cellHeight};">${cell.innerHTML}</td>`;
              }
              html += '</tr>';
            }
            
            html += '</table>';
            html += '</div>';
          }
        }
      });
      
      html += '</div>';
      
      document.getElementById('html-output').value = html;
      
      navigator.clipboard.writeText(html).then(() => {
        alert('✅ HR document HTML generated and copied to clipboard!');
      }).catch(() => {
        alert('✅ HR document HTML generated! Check the output box below.');
      });
    }

    // Handle image upload
    function handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        event.target.value = '';
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, JPG, GIF)');
        event.target.value = '';
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function(e) {
        if (window.currentImageContainer === 'new') {
          const canvas = document.getElementById('canvas');
          const rect = canvas.getBoundingClientRect();
          const dimensions = window.currentImageDimensions || { width: 200, height: 150 };
          const x = Math.random() * (rect.width - dimensions.width) + 50;
          const y = Math.random() * (rect.height - dimensions.height) + 50;
          
          createElement('image', e.target.result, x, y, dimensions.width, dimensions.height);
          window.currentImageContainer = null;
          window.currentImageDimensions = null;
        } else if (window.currentImageContainer) {
          const dimensions = window.currentImageDimensions || {};
          createImageFromUrl(window.currentImageContainer, e.target.result, dimensions.width, dimensions.height);
          window.currentImageContainer = null;
          window.currentImageDimensions = null;
        }
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    }

    // Handle employee photo upload
    function handleEmployeePhotoUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // Validate file size (max 2MB for employee photos)
      if (file.size > 2 * 1024 * 1024) {
        alert('Employee photo should be less than 2MB');
        event.target.value = '';
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid photo file (JPEG, PNG, JPG)');
        event.target.value = '';
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function(e) {
        if (window.currentImageContainer === 'new') {
          const canvas = document.getElementById('canvas');
          const rect = canvas.getBoundingClientRect();
          const dimensions = window.currentImageDimensions || { width: 120, height: 150 };
          const x = Math.random() * (rect.width - dimensions.width) + 50;
          const y = Math.random() * (rect.height - dimensions.height) + 50;
          
          createElement('image', e.target.result, x, y, dimensions.width, dimensions.height);
          window.currentImageContainer = null;
          window.currentImageDimensions = null;
        } else if (window.currentImageContainer) {
          const dimensions = window.currentImageDimensions || {};
          createImageFromUrl(window.currentImageContainer, e.target.result, dimensions.width, dimensions.height);
          window.currentImageContainer = null;
          window.currentImageDimensions = null;
        }
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    }

    // Drag and drop from sidebar
    function initializeDragAndDrop() {
      const placeholderBtns = document.querySelectorAll('.placeholder-btn[draggable="true"]');
      const canvas = document.getElementById('canvas');

      placeholderBtns.forEach(btn => {
        btn.addEventListener('dragstart', handleDragStart);
        btn.addEventListener('dragend', handleDragEnd);
      });

      canvas.addEventListener('dragover', handleDragOver);
      canvas.addEventListener('drop', handleDrop);
      canvas.addEventListener('dragenter', handleDragEnter);
      canvas.addEventListener('dragleave', handleDragLeave);
      canvas.addEventListener('click', (e) => {
        if (e.target === canvas) {
          clearSelection();
          
          // Clear selected cell
          if (selectedCell) {
            selectedCell.classList.remove('selected-cell');
            selectedCell = null;
          }
        }
      });
    }

    function handleDragStart(e) {
      draggedItem = {
        type: e.target.dataset.type,
        content: e.target.dataset.content
      };
      e.target.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'copy';
    }

    function handleDragEnd(e) {
      e.target.classList.remove('dragging');
      draggedItem = null;
    }

    function handleDragEnter(e) {
      e.preventDefault();
      e.currentTarget.classList.add('drag-over');
    }

    function handleDragLeave(e) {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        e.currentTarget.classList.remove('drag-over');
      }
    }

    function handleDragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }

    function handleDrop(e) {
      e.preventDefault();
      e.currentTarget.classList.remove('drag-over');
      
      if (draggedItem) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        createElement(draggedItem.type, draggedItem.content, x, y);
      }
    }

    // Toggle grid
    function toggleGrid() {
      const grid = document.getElementById('gridOverlay');
      grid.classList.toggle('visible');
    }

    // Toggle ruler
    function toggleRuler() {
      const ruler = document.getElementById('rulerOverlay');
      ruler.classList.toggle('visible');
      
      if (ruler.classList.contains('visible')) {
        updateRulerMarks();
      }
    }

    // Update ruler marks based on canvas size
    function updateRulerMarks() {
      const canvas = document.getElementById('canvas');
      const horizontalRuler = document.getElementById('rulerHorizontal');
      const verticalRuler = document.getElementById('rulerVertical');
      
      // Clear existing marks
      horizontalRuler.innerHTML = '';
      verticalRuler.innerHTML = '';
      
      const canvasRect = canvas.getBoundingClientRect();
      const canvasWidth = canvasRect.width;
      const canvasHeight = canvasRect.height;
      
      // Add horizontal ruler marks
      for (let i = 0; i <= canvasWidth; i += 10) {
        const mark = document.createElement('div');
        mark.className = 'ruler-mark';
        mark.style.left = i + 'px';
        mark.style.top = '15px';
        mark.style.width = '1px';
        
        if (i % 50 === 0) {
          mark.classList.add('major');
          mark.style.height = '8px';
          
          // Add number
          const number = document.createElement('div');
          number.className = 'ruler-number';
          number.textContent = i;
          number.style.left = (i - 8) + 'px';
          number.style.top = '2px';
          horizontalRuler.appendChild(number);
        } else if (i % 25 === 0) {
          mark.style.height = '6px';
        } else {
          mark.classList.add('minor');
          mark.style.height = '4px';
        }
        
        horizontalRuler.appendChild(mark);
      }
      
      // Add vertical ruler marks
      for (let i = 0; i <= canvasHeight; i += 10) {
        const mark = document.createElement('div');
        mark.className = 'ruler-mark';
        mark.style.top = i + 'px';
        mark.style.left = '15px';
        mark.style.height = '1px';
        
        if (i % 50 === 0) {
          mark.classList.add('major');
          mark.style.width = '8px';
          
          // Add number
          const number = document.createElement('div');
          number.className = 'ruler-number';
          number.textContent = i;
          number.style.top = (i - 6) + 'px';
          number.style.left = '2px';
          number.style.transform = 'rotate(-90deg)';
          number.style.transformOrigin = 'center';
          verticalRuler.appendChild(number);
        } else if (i % 25 === 0) {
          mark.style.width = '6px';
        } else {
          mark.classList.add('minor');
          mark.style.width = '4px';
        }
        
        verticalRuler.appendChild(mark);
      }
    }

    // Add horizontal line
    function addHorizontalLine() {
      const canvas = document.getElementById('canvas');
      const rect = canvas.getBoundingClientRect();
      const x = Math.random() * (rect.width - 200) + 50;
      const y = Math.random() * (rect.height - 50) + 50;
      
      createElement('horizontal-line', null, x, y);
    }

    // Add vertical line
    function addVerticalLine() {
      const canvas = document.getElementById('canvas');
      const rect = canvas.getBoundingClientRect();
      const x = Math.random() * (rect.width - 50) + 50;
      const y = Math.random() * (rect.height - 100) + 50;
      
      createElement('vertical-line', null, x, y);
    }

    // Add table
    function addTable() {
      const canvas = document.getElementById('canvas');
      const rect = canvas.getBoundingClientRect();
      const x = Math.random() * (rect.width - 250) + 50;
      const y = Math.random() * (rect.height - 120) + 50;
      
      createElement('table', null, x, y);
    }

    // Toggle page border
    function togglePageBorder() {
      const canvas = document.getElementById('canvas');
      canvas.classList.toggle('bordered');
    }

    // Change line style
    function changeLineStyle(element, style) {
      const lineElement = element.querySelector('.horizontal-line-element, .vertical-line-element');
      if (lineElement) {
        // Remove existing style classes
        lineElement.classList.remove('thick', 'dashed', 'dotted');
        
        // Add new style class
        if (style !== 'normal') {
          lineElement.classList.add(style);
        }
      }
    }

    // Change line width (for horizontal lines)
    function changeLineWidth(element, width) {
      const lineElement = element.querySelector('.horizontal-line-element');
      if (lineElement) {
        const newWidth = Math.max(50, Math.min(800, parseInt(width)));
        lineElement.style.width = newWidth + 'px';
      }
    }

    // Change line height (for vertical lines)
    function changeLineHeight(element, height) {
      const lineElement = element.querySelector('.vertical-line-element');
      if (lineElement) {
        const newHeight = Math.max(50, Math.min(600, parseInt(height)));
        lineElement.style.height = newHeight + 'px';
      }
    }

    // Start line resize
    function startLineResize(e, direction, lineType) {
      e.preventDefault();
      e.stopPropagation();
      
      const element = e.target.closest('.canvas-element');
      const lineElement = element.querySelector(`.${lineType}-line-element`);
      const canvas = document.getElementById('canvas');
      const canvasRect = canvas.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = lineElement.offsetWidth;
      const startHeight = lineElement.offsetHeight;
      const startLeft = parseInt(element.style.left);
      const startTop = parseInt(element.style.top);
      
      function onMouseMove(e) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        if (lineType === 'horizontal') {
          if (direction === 'right') {
            // Resize from right edge
            const newWidth = Math.max(50, Math.min(800, startWidth + deltaX));
            lineElement.style.width = newWidth + 'px';
            
            // Update input field
            const widthInput = element.querySelector('.line-width-input');
            if (widthInput) widthInput.value = newWidth;
          } else if (direction === 'left') {
            // Resize from left edge
            const newWidth = Math.max(50, Math.min(800, startWidth - deltaX));
            const newLeft = Math.max(0, Math.min(startLeft + deltaX, canvasRect.width - newWidth));
            
            lineElement.style.width = newWidth + 'px';
            element.style.left = newLeft + 'px';
            
            // Update input field
            const widthInput = element.querySelector('.line-width-input');
            if (widthInput) widthInput.value = newWidth;
          }
        } else if (lineType === 'vertical') {
          if (direction === 'bottom') {
            // Resize from bottom edge
            const newHeight = Math.max(50, Math.min(600, startHeight + deltaY));
            lineElement.style.height = newHeight + 'px';
            
            // Update input field
            const heightInput = element.querySelector('.line-height-input');
            if (heightInput) heightInput.value = newHeight;
          } else if (direction === 'top') {
            // Resize from top edge
            const newHeight = Math.max(50, Math.min(600, startHeight - deltaY));
            const newTop = Math.max(0, Math.min(startTop + deltaY, canvasRect.height - newHeight));
            
            lineElement.style.height = newHeight + 'px';
            element.style.top = newTop + 'px';
            
            // Update input field
            const heightInput = element.querySelector('.line-height-input');
            if (heightInput) heightInput.value = newHeight;
          }
        }
      }
      
      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    // Change table width
    function changeTableWidth(element, width) {
      const newWidth = Math.max(150, Math.min(800, parseInt(width)));
      element.style.width = newWidth + 'px';
    }

    // Change table height
    function changeTableHeight(element, height) {
      const newHeight = Math.max(80, Math.min(600, parseInt(height)));
      element.style.height = newHeight + 'px';
    }

    // Start table resize
    function startTableResize(e, direction) {
      e.preventDefault();
      e.stopPropagation();
      
      const element = e.target.closest('.canvas-element');
      const canvas = document.getElementById('canvas');
      const canvasRect = canvas.getBoundingClientRect();
      
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = element.offsetWidth;
      const startHeight = element.offsetHeight;
      const startLeft = parseInt(element.style.left);
      const startTop = parseInt(element.style.top);
      
      function onMouseMove(e) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        let newWidth = startWidth;
        let newHeight = startHeight;
        let newLeft = startLeft;
        let newTop = startTop;
        
        // Handle different resize directions
        switch(direction) {
          case 'se': // Southeast - resize from bottom-right
            newWidth = Math.max(150, Math.min(800, startWidth + deltaX));
            newHeight = Math.max(80, Math.min(600, startHeight + deltaY));
            break;
          case 'sw': // Southwest - resize from bottom-left
            newWidth = Math.max(150, Math.min(800, startWidth - deltaX));
            newHeight = Math.max(80, Math.min(600, startHeight + deltaY));
            newLeft = Math.max(0, Math.min(startLeft + deltaX, canvasRect.width - newWidth));
            break;
          case 'ne': // Northeast - resize from top-right
            newWidth = Math.max(150, Math.min(800, startWidth + deltaX));
            newHeight = Math.max(80, Math.min(600, startHeight - deltaY));
            newTop = Math.max(0, Math.min(startTop + deltaY, canvasRect.height - newHeight));
            break;
          case 'nw': // Northwest - resize from top-left
            newWidth = Math.max(150, Math.min(800, startWidth - deltaX));
            newHeight = Math.max(80, Math.min(600, startHeight - deltaY));
            newLeft = Math.max(0, Math.min(startLeft + deltaX, canvasRect.width - newWidth));
            newTop = Math.max(0, Math.min(startTop + deltaY, canvasRect.height - newHeight));
            break;
        }
        
        // Apply new dimensions
        element.style.width = newWidth + 'px';
        element.style.height = newHeight + 'px';
        element.style.left = newLeft + 'px';
        element.style.top = newTop + 'px';
        
        // Update input fields
        const widthInput = element.querySelector('.table-width-input');
        const heightInput = element.querySelector('.table-height-input');
        if (widthInput) widthInput.value = newWidth;
        if (heightInput) heightInput.value = newHeight;
      }
      
      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    // Add table row
    function addTableRow(element) {
      const table = element.querySelector('.table-element');
      if (table) {
        const newRow = table.insertRow();
        const colCount = table.rows[0] ? table.rows[0].cells.length : 2;
        
        for (let i = 0; i < colCount; i++) {
          const cell = newRow.insertCell();
          cell.contentEditable = true;
          cell.textContent = `Cell ${table.rows.length},${i + 1}`;
          cell.style.position = 'relative';
          cell.style.minWidth = '80px';
          
          cell.addEventListener('click', function(e) {
            e.stopPropagation();
            selectCell(this);
          });
          
          // Add new cell resize handles
          const isLastColumn = (i === colCount - 1);
          const isLastRow = true; // This is the new last row
          addTableCellResizeHandles(cell, isLastColumn, isLastRow);
          
          // Update resize handles for previous row (now not the last row)
          if (table.rows.length > 1) {
            const prevRowIndex = table.rows.length - 2;
            const prevRowCell = table.rows[prevRowIndex].cells[i];
            if (prevRowCell) {
              const isLastColumnPrev = (i === colCount - 1);
              const isLastRowPrev = false; // No longer the last row
              addTableCellResizeHandles(prevRowCell, isLastColumnPrev, isLastRowPrev);
            }
          }
        }
      }
    }

    // Add table column
    function addTableColumn(element) {
      const table = element.querySelector('.table-element');
      if (table) {
        for (let i = 0; i < table.rows.length; i++) {
          const cell = table.rows[i].insertCell();
          cell.contentEditable = true;
          cell.textContent = `Cell ${i + 1},${table.rows[i].cells.length}`;
          cell.style.position = 'relative';
          cell.style.minWidth = '80px';
          
          cell.addEventListener('click', function(e) {
            e.stopPropagation();
            selectCell(this);
          });
          
          // Add new cell resize handles
          const isLastColumn = true; // This is the new last column
          const isLastRow = (i === table.rows.length - 1);
          addTableCellResizeHandles(cell, isLastColumn, isLastRow);
          
          // Update resize handles for previous column (now not the last column)
          const prevColumnIndex = table.rows[i].cells.length - 2;
          if (prevColumnIndex >= 0) {
            const prevCell = table.rows[i].cells[prevColumnIndex];
            if (prevCell) {
              const isLastColumnPrev = false; // No longer the last column
              const isLastRowPrev = (i === table.rows.length - 1);
              addTableCellResizeHandles(prevCell, isLastColumnPrev, isLastRowPrev);
            }
          }
        }
      }
    }

    // Remove table row
    function removeTableRow(element) {
      const table = element.querySelector('.table-element');
      if (table && table.rows.length > 1) {
        table.deleteRow(table.rows.length - 1);
      }
    }

    // Remove table column
    function removeTableColumn(element) {
      const table = element.querySelector('.table-element');
      if (table && table.rows[0] && table.rows[0].cells.length > 1) {
        for (let i = 0; i < table.rows.length; i++) {
          table.rows[i].deleteCell(table.rows[i].cells.length - 1);
        }
      }
    }

    // Change page size
    function changePageSize(size) {
      const canvas = document.getElementById('canvas');
      if (!size) return;
      
      // Remove all existing size classes
      const sizeClasses = ['a4', 'a3', 'a5', 'letter', 'legal', 'tabloid', 
                          'business-card', 'id-card', 'badge', 'postcard', 
                          'greeting-card', 'certificate', 'mobile', 'tablet', 'desktop'];
      
      sizeClasses.forEach(cls => canvas.classList.remove(cls));
      
      // Add new size class
      canvas.classList.add(size);
      
      // Update page size info
      const pageSizeInfo = {
        'a4': { width: '210mm', height: '297mm', name: 'A4' },
        'a3': { width: '297mm', height: '420mm', name: 'A3' },
        'a5': { width: '148mm', height: '210mm', name: 'A5' },
        'letter': { width: '8.5in', height: '11in', name: 'Letter' },
        'legal': { width: '8.5in', height: '14in', name: 'Legal' },
        'tabloid': { width: '11in', height: '17in', name: 'Tabloid' },
        'business-card': { width: '3.5in', height: '2in', name: 'Business Card' },
        'id-card': { width: '3.375in', height: '2.125in', name: 'ID Card' },
        'badge': { width: '4in', height: '3in', name: 'Badge' },
        'postcard': { width: '6in', height: '4in', name: 'Postcard' },
        'greeting-card': { width: '5in', height: '7in', name: 'Greeting Card' },
        'certificate': { width: '11in', height: '8.5in', name: 'Certificate' },
        'mobile': { width: '375px', height: '812px', name: 'Mobile' },
        'tablet': { width: '768px', height: '1024px', name: 'Tablet' },
        'desktop': { width: '1920px', height: '1080px', name: 'Desktop' }
      };
      
      const info = pageSizeInfo[size];
      if (info) {
        console.log(`Canvas changed to ${info.name} (${info.width} × ${info.height})`);
      }
      
      // Reset dropdown
      document.getElementById('pageSize').value = '';
      
      // Update ruler marks if ruler is visible
      const ruler = document.getElementById('rulerOverlay');
      if (ruler.classList.contains('visible')) {
        setTimeout(() => updateRulerMarks(), 100);
      }
    }

    // Toggle orientation
    function toggleOrientation() {
      const canvas = document.getElementById('canvas');
      const orientationText = document.getElementById('orientationText');
      const orientationBtn = document.getElementById('orientationBtn');
      
      const isLandscape = canvas.classList.contains('landscape');
      
      if (isLandscape) {
        // Switch to Portrait
        canvas.classList.remove('landscape');
        orientationText.textContent = 'Portrait';
        orientationBtn.style.background = '#17a2b8';
        
        // Adjust elements for portrait
        adjustElementsForOrientation('portrait');
      } else {
        // Switch to Landscape
        canvas.classList.add('landscape');
        orientationText.textContent = 'Landscape';
        orientationBtn.style.background = '#fd7e14';
        
        // Adjust elements for landscape
        adjustElementsForOrientation('landscape');
      }
      
      // Update ruler marks if ruler is visible
      const ruler = document.getElementById('rulerOverlay');
      if (ruler.classList.contains('visible')) {
        setTimeout(() => updateRulerMarks(), 100);
      }
    }

    // Adjust elements when orientation changes
    function adjustElementsForOrientation(orientation) {
      const canvas = document.getElementById('canvas');
      const elements = canvas.querySelectorAll('.canvas-element');
      
      const canvasRect = canvas.getBoundingClientRect();
      const canvasWidth = canvasRect.width;
      const canvasHeight = canvasRect.height;
      
      elements.forEach(element => {
        const currentLeft = parseInt(element.style.left);
        const currentTop = parseInt(element.style.top);
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        
        // Ensure elements stay within bounds
        if (currentLeft + elementWidth > canvasWidth) {
          element.style.left = Math.max(0, canvasWidth - elementWidth) + 'px';
        }
        
        if (currentTop + elementHeight > canvasHeight) {
          element.style.top = Math.max(0, canvasHeight - elementHeight) + 'px';
        }
      });
    }

    // Clear canvas
    function clearCanvas() {
      if (confirm('Are you sure you want to clear the entire canvas?')) {
        const canvas = document.getElementById('canvas');
        const elements = canvas.querySelectorAll('.canvas-element');
        elements.forEach(el => el.remove());
        selectedElement = null;
      }
    }

    // Create element on canvas
    function createElement(type, content, x, y, width, height) {
      const canvas = document.getElementById('canvas');
      const element = document.createElement('div');
      element.className = 'canvas-element';
      element.style.left = x + 'px';
      element.style.top = y + 'px';

      if (type === 'placeholder') {
        const input = document.createElement('input');
        input.className = 'placeholder-element';
        input.type = 'text';
        input.value = content;
        input.addEventListener('focus', () => element.classList.add('editing'));
        input.addEventListener('blur', () => element.classList.remove('editing'));
        element.appendChild(input);
      } 
      else if (type === 'image-placeholder') {
        const imagePlaceholder = document.createElement('div');
        imagePlaceholder.className = 'image-placeholder-element';
        imagePlaceholder.textContent = content;
        imagePlaceholder.setAttribute('data-placeholder', content);
        imagePlaceholder.style.width = '120px';
        imagePlaceholder.style.height = '150px';
        
        // Add size controls
        const sizeControls = document.createElement('div');
        sizeControls.className = 'image-size-controls';
        sizeControls.innerHTML = `
          <span style="color: white; font-size: 10px;">Size:</span>
          <input type="number" class="size-input" placeholder="W" value="120" min="50" max="500" onchange="updateImageSize(this, 'width')">
          <span style="color: white;">x</span>
          <input type="number" class="size-input" placeholder="H" value="150" min="50" max="500" onchange="updateImageSize(this, 'height')">
          <span style="color: white; font-size: 10px;">px</span>
        `;
        
        imagePlaceholder.appendChild(sizeControls);
        element.appendChild(imagePlaceholder);
      } 
      else if (type === 'image') {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';
        
        // Set dimensions if provided
        if (width && height) {
          imageContainer.style.width = width + 'px';
          imageContainer.style.height = height + 'px';
        }
        
        if (content === 'url') {
          const url = prompt('Enter image URL:');
          if (url) {
            createImageFromUrl(imageContainer, url, width, height);
          } else {
            imageContainer.textContent = 'Click to add image URL';
            imageContainer.addEventListener('click', () => {
              const newUrl = prompt('Enter image URL:');
              if (newUrl) createImageFromUrl(imageContainer, newUrl, width, height);
            });
          }
        } 
        else if (content === 'upload') {
          imageContainer.textContent = 'Click to upload employee photo';
          imageContainer.addEventListener('click', () => {
            document.getElementById('employeePhotoUpload').click();
            window.currentImageContainer = imageContainer;
          });
        } 
        else {
          createImageFromUrl(imageContainer, content, width, height);
        }
        
        element.appendChild(imageContainer);
      } 
      else if (type === 'horizontal-line') {
        const lineElement = document.createElement('div');
        lineElement.className = 'horizontal-line-element';
        element.appendChild(lineElement);
        
        // Add line controls
        const lineControls = document.createElement('div');
        lineControls.className = 'line-controls';
        lineControls.innerHTML = `
          <button class="line-style-btn" onclick="changeLineStyle(this.closest('.canvas-element'), 'normal')">Normal</button>
          <button class="line-style-btn" onclick="changeLineStyle(this.closest('.canvas-element'), 'thick')">Thick</button>
          <button class="line-style-btn" onclick="changeLineStyle(this.closest('.canvas-element'), 'dashed')">Dashed</button>
          <button class="line-style-btn" onclick="changeLineStyle(this.closest('.canvas-element'), 'dotted')">Dotted</button>
          <span style="color: white; font-size: 9px; margin-left: 5px;">Width:</span>
          <input type="number" class="line-width-input" value="200" min="50" max="800" onchange="changeLineWidth(this.closest('.canvas-element'), this.value)" oninput="changeLineWidth(this.closest('.canvas-element'), this.value)" onclick="event.stopPropagation()" onmousedown="event.stopPropagation()" onfocus="event.stopPropagation()" style="width: 45px; padding: 2px; margin: 0 2px; border: 1px solid #ccc; border-radius: 3px; font-size: 9px; background: white; color: black; pointer-events: all;">
          <span style="color: white; font-size: 9px;">px</span>
        `;
        element.appendChild(lineControls);
        
        // Add resize handles for horizontal lines (left and right)
        ['left', 'right'].forEach(direction => {
          const handle = document.createElement('div');
          handle.className = `resize-handle resize-line-${direction}`;
          handle.addEventListener('mousedown', (e) => startLineResize(e, direction, 'horizontal'));
          element.appendChild(handle);
        });
      } 
      else if (type === 'vertical-line') {
        const lineElement = document.createElement('div');
        lineElement.className = 'vertical-line-element';
        element.appendChild(lineElement);
        
        // Add line controls
        const lineControls = document.createElement('div');
        lineControls.className = 'line-controls';
        lineControls.innerHTML = `
          <button class="line-style-btn" onclick="changeLineStyle(this.closest('.canvas-element'), 'normal')">Normal</button>
          <button class="line-style-btn" onclick="changeLineStyle(this.closest('.canvas-element'), 'thick')">Thick</button>
          <button class="line-style-btn" onclick="changeLineStyle(this.closest('.canvas-element'), 'dashed')">Dashed</button>
          <button class="line-style-btn" onclick="changeLineStyle(this.closest('.canvas-element'), 'dotted')">Dotted</button>
          <span style="color: white; font-size: 9px; margin-left: 5px;">Height:</span>
          <input type="number" class="line-height-input" value="100" min="50" max="600" onchange="changeLineHeight(this.closest('.canvas-element'), this.value)" oninput="changeLineHeight(this.closest('.canvas-element'), this.value)" onclick="event.stopPropagation()" onmousedown="event.stopPropagation()" onfocus="event.stopPropagation()" style="width: 45px; padding: 2px; margin: 0 2px; border: 1px solid #ccc; border-radius: 3px; font-size: 9px; background: white; color: black; pointer-events: all;">
          <span style="color: white; font-size: 9px;">px</span>
        `;
        element.appendChild(lineControls);
        
        // Add resize handles for vertical lines (top and bottom)
        ['top', 'bottom'].forEach(direction => {
          const handle = document.createElement('div');
          handle.className = `resize-handle resize-line-${direction}`;
          handle.addEventListener('mousedown', (e) => startLineResize(e, direction, 'vertical'));
          element.appendChild(handle);
        });
      } 
      else if (type === 'table') {
        const tableElement = document.createElement('table');
        tableElement.className = 'table-element';
        
        // Create initial 2x2 table
        for (let i = 0; i < 2; i++) {
          const row = tableElement.insertRow();
          for (let j = 0; j < 2; j++) {
            const cell = row.insertCell();
            cell.contentEditable = true;
            cell.textContent = `Cell ${i + 1},${j + 1}`;
            cell.style.position = 'relative';
            cell.style.minWidth = '80px';
            
            cell.addEventListener('click', function(e) {
              e.stopPropagation();
              selectCell(this);
            });
            
            // Add new cell resize handles
            const isLastColumn = (j === 1); // For 2x2 table
            const isLastRow = (i === 1); // For 2x2 table
            addTableCellResizeHandles(cell, isLastColumn, isLastRow);
          }
        }
        
        element.appendChild(tableElement);
        
        // Set initial table container size
        element.style.width = '200px';
        element.style.height = '100px';
        
        // Add table drag zone for overall table resize
        const tableDragZone = document.createElement('div');
        tableDragZone.className = 'table-drag-zone';
        tableDragZone.addEventListener('mousedown', function(e) {
          e.preventDefault();
          e.stopPropagation();
          startTableResize(e, 'se');
        });
        element.appendChild(tableDragZone);
        
        // Add table controls
        const tableControls = document.createElement('div');
        tableControls.className = 'table-controls';
        tableControls.innerHTML = `
          <button class="table-btn" onclick="addTableRow(this.closest('.canvas-element'))">+Row</button>
          <button class="table-btn" onclick="addTableColumn(this.closest('.canvas-element'))">+Col</button>
          <button class="table-btn" onclick="removeTableRow(this.closest('.canvas-element'))">-Row</button>
          <button class="table-btn" onclick="removeTableColumn(this.closest('.canvas-element'))">-Col</button>
          <button class="table-btn" onclick="alignSelectedCell('left')">⬅️</button>
          <button class="table-btn" onclick="alignSelectedCell('center')">↔️</button>
          <button class="table-btn" onclick="alignSelectedCell('right')">➡️</button>
          <span style="color: white; font-size: 9px; margin-left: 5px;">W:</span>
          <input type="number" class="table-width-input" value="200" min="150" max="800" onchange="changeTableWidth(this.closest('.canvas-element'), this.value)" oninput="changeTableWidth(this.closest('.canvas-element'), this.value)" onclick="event.stopPropagation()" onmousedown="event.stopPropagation()" onfocus="event.stopPropagation()" style="width: 45px; padding: 2px; margin: 0 2px; border: 1px solid #ccc; border-radius: 3px; font-size: 9px; background: white; color: black; pointer-events: all;">
          <span style="color: white; font-size: 9px; margin-left: 5px;">H:</span>
          <input type="number" class="table-height-input" value="100" min="80" max="600" onchange="changeTableHeight(this.closest('.canvas-element'), this.value)" oninput="changeTableHeight(this.closest('.canvas-element'), this.value)" onclick="event.stopPropagation()" onmousedown="event.stopPropagation()" onfocus="event.stopPropagation()" style="width: 45px; padding: 2px; margin: 0 2px; border: 1px solid #ccc; border-radius: 3px; font-size: 9px; background: white; color: black; pointer-events: all;">
          <span style="color: white; font-size: 9px;">px</span>
        `;
        element.appendChild(tableControls);
        
        // Add resize handles for tables
        ['nw', 'ne', 'sw', 'se'].forEach(direction => {
          const handle = document.createElement('div');
          handle.className = `resize-handle resize-${direction}`;
          handle.addEventListener('mousedown', (e) => startTableResize(e, direction));
          element.appendChild(handle);
        });
      } 
      else {
        const textDiv = document.createElement('div');
        textDiv.className = 'text-editable';
        textDiv.contentEditable = true;
        textDiv.textContent = content;
        
        textDiv.addEventListener('focus', () => {
          element.classList.add('editing');
          if (textDiv.textContent === 'Click to edit text...') {
            textDiv.textContent = '';
          }
        });
        
        textDiv.addEventListener('blur', () => {
          element.classList.remove('editing');
          if (textDiv.textContent.trim() === '') {
            textDiv.textContent = 'Click to edit text...';
          }
        });

        textDiv.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.execCommand('insertHTML', false, '<br>');
          }
        });

        element.appendChild(textDiv);
      }

      // Add delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = '×';
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        element.remove();
        if (selectedElement === element) selectedElement = null;
      };
      element.appendChild(deleteBtn);

      // Add resize handles
      ['nw', 'ne', 'sw', 'se'].forEach(direction => {
        const handle = document.createElement('div');
        handle.className = `resize-handle resize-${direction}`;
        element.appendChild(handle);
      });

      // Make element interactive
      element.addEventListener('mousedown', startDrag);
      element.addEventListener('click', (e) => {
        e.stopPropagation();
        selectElement(element, e.ctrlKey || e.metaKey);
      });

      canvas.appendChild(element);
      selectElement(element);
      
      if (type === 'text') {
        setTimeout(() => element.querySelector('.text-editable').focus(), 100);
      }
    }

    // Create image from URL
    function createImageFromUrl(container, url, width, height) {
      container.innerHTML = '';
      container.classList.add('has-image');
      
      const img = document.createElement('img');
      img.className = 'image-element';
      img.src = url;
      img.alt = 'HR Document Image';
      
      img.onload = () => {
        if (width && height) {
          // Use provided dimensions
          container.style.width = width + 'px';
          container.style.height = height + 'px';
        } else {
          // Use automatic sizing with max constraints
          const maxWidth = 300;
          const maxHeight = 300;
          const ratio = Math.min(maxWidth / img.naturalWidth, maxHeight / img.naturalHeight);
          
          container.style.width = (img.naturalWidth * ratio) + 'px';
          container.style.height = (img.naturalHeight * ratio) + 'px';
        }
        
        // Add resize handles
        addImageResizeHandles(container);
      };
      
      img.onerror = () => {
        container.innerHTML = '❌ Image failed to load';
        container.classList.remove('has-image');
      };
      
      container.appendChild(img);
    }

    // Select element
    function selectElement(element, multiSelect = false) {
      if (multiSelect) {
        // Multi-select mode (Ctrl+click)
        if (selectedElements.includes(element)) {
          // Deselect if already selected
          selectedElements = selectedElements.filter(el => el !== element);
          element.classList.remove('multi-selected');
          
          // Remove image selection styling
          const imageContainer = element.querySelector('.image-container');
          if (imageContainer) {
            imageContainer.classList.remove('selected');
          }
        } else {
          // Add to selection
          selectedElements.push(element);
          element.classList.add('multi-selected');
          
          // Add image selection styling
          const imageContainer = element.querySelector('.image-container');
          if (imageContainer) {
            imageContainer.classList.add('selected');
          }
        }
        
        // Update single selection
        if (selectedElements.length === 1) {
          selectedElement = selectedElements[0];
          selectedElement.classList.remove('multi-selected');
          selectedElement.classList.add('selected');
        } else {
          selectedElement = null;
          document.querySelectorAll('.canvas-element.selected').forEach(el => el.classList.remove('selected'));
        }
        updateSelectionCounter();
      } else {
        // Single select mode
        clearSelection();
        element.classList.add('selected');
        selectedElement = element;
        selectedElements = [element];
        
        // Add image selection styling
        const imageContainer = element.querySelector('.image-container');
        if (imageContainer) {
          imageContainer.classList.add('selected');
        }
      }
      updateSelectionCounter();
    }

    function clearSelection() {
      document.querySelectorAll('.canvas-element.selected, .canvas-element.multi-selected').forEach(el => {
        el.classList.remove('selected', 'multi-selected');
        
        // Remove image selection styling
        const imageContainer = el.querySelector('.image-container');
        if (imageContainer) {
          imageContainer.classList.remove('selected');
        }
      });
      selectedElements = [];
      selectedElement = null;
      updateSelectionCounter();
    }

    function updateSelectionCounter() {
      const counter = document.getElementById('selectionCounter');
      const count = document.getElementById('selectedCount');
      
      if (selectedElements.length > 0) {
        count.textContent = selectedElements.length;
        counter.style.display = 'block';
      } else {
        counter.style.display = 'none';
      }
    }

    // Group management functions
    function createGroup() {
      if (selectedElements.length < 2) {
        alert('Please select at least 2 elements to create a group');
        return;
      }

      const groupId = `group_${++groupCounter}`;
      const canvas = document.getElementById('canvas');
      
      // Calculate group bounds
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      selectedElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const x = rect.left - canvasRect.left;
        const y = rect.top - canvasRect.top;
        const width = rect.width;
        const height = rect.height;
        
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + width);
        maxY = Math.max(maxY, y + height);
      });

      // Create group container
      const groupContainer = document.createElement('div');
      groupContainer.className = 'group-container';
      groupContainer.id = groupId;
      groupContainer.style.left = (minX - 5) + 'px';
      groupContainer.style.top = (minY - 5) + 'px';
      groupContainer.style.width = (maxX - minX + 10) + 'px';
      groupContainer.style.height = (maxY - minY + 10) + 'px';
      groupContainer.style.zIndex = '1';

      // Add group label
      const groupLabel = document.createElement('div');
      groupLabel.className = 'group-label';
      groupLabel.textContent = `Group ${groupCounter}`;
      groupContainer.appendChild(groupLabel);

      // Store group data
      const group = {
        id: groupId,
        elements: [...selectedElements],
        container: groupContainer
      };
      groups.push(group);

      // Mark elements as grouped
      selectedElements.forEach(element => {
        element.classList.add('grouped');
        element.dataset.groupId = groupId;
      });

      canvas.appendChild(groupContainer);
      
      // Add group interaction
      groupContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        selectGroup(groupId);
      });

      // Add group drag functionality
      groupContainer.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('group-label')) return;
        startGroupDrag(e, groupId);
      });

      clearSelection();
      alert(`Created group with ${group.elements.length} elements`);
    }

    function selectGroup(groupId) {
      const group = groups.find(g => g.id === groupId);
      if (!group) return;

      clearSelection();
      selectedElements = [...group.elements];
      selectedElements.forEach(element => {
        element.classList.add('multi-selected');
      });
      
      group.container.classList.add('selected');
      document.querySelectorAll('.group-container').forEach(container => {
        if (container.id !== groupId) {
          container.classList.remove('selected');
        }
      });
    }

    function ungroupSelected() {
      if (selectedElements.length === 0) {
        alert('Please select a group to ungroup');
        return;
      }

      const groupIds = new Set();
      selectedElements.forEach(element => {
        if (element.dataset.groupId) {
          groupIds.add(element.dataset.groupId);
        }
      });

      if (groupIds.size === 0) {
        alert('Selected elements are not in a group');
        return;
      }

      groupIds.forEach(groupId => {
        const group = groups.find(g => g.id === groupId);
        if (group) {
          // Remove group styling from elements
          group.elements.forEach(element => {
            element.classList.remove('grouped');
            delete element.dataset.groupId;
          });

          // Remove group container
          group.container.remove();

          // Remove from groups array
          groups = groups.filter(g => g.id !== groupId);
        }
      });

      clearSelection();
      alert('Group(s) ungrouped successfully');
    }

    // Toggle group visibility
    function toggleGroupVisibility() {
      const groupContainers = document.querySelectorAll('.group-container');
      groupContainers.forEach(container => {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
      });
    }

    // Start group drag
    function startGroupDrag(e, groupId) {
      e.preventDefault();
      e.stopPropagation();
      
      const group = groups.find(g => g.id === groupId);
      if (!group) return;
      
      const canvas = document.getElementById('canvas');
      const canvasRect = canvas.getBoundingClientRect();
      const groupContainer = group.container;
      const groupRect = groupContainer.getBoundingClientRect();
      
      // Calculate initial offset
      const initialOffset = {
        x: e.clientX - groupRect.left,
        y: e.clientY - groupRect.top
      };
      
      // Store initial positions of all elements in the group
      const initialPositions = group.elements.map(element => ({
        element: element,
        x: parseInt(element.style.left) || 0,
        y: parseInt(element.style.top) || 0
      }));
      
      groupContainer.classList.add('dragging');
      
      function onMouseMove(e) {
        const newX = e.clientX - canvasRect.left - initialOffset.x;
        const newY = e.clientY - canvasRect.top - initialOffset.y;
        
        // Calculate the movement delta from initial group position
        const initialGroupX = parseInt(groupContainer.style.left) || 0;
        const initialGroupY = parseInt(groupContainer.style.top) || 0;
        const deltaX = newX - initialGroupX;
        const deltaY = newY - initialGroupY;
        
        // Calculate group bounds after movement using initial positions
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        initialPositions.forEach(pos => {
          const elementNewX = pos.x + deltaX;
          const elementNewY = pos.y + deltaY;
          
          minX = Math.min(minX, elementNewX);
          minY = Math.min(minY, elementNewY);
          maxX = Math.max(maxX, elementNewX + pos.element.offsetWidth);
          maxY = Math.max(maxY, elementNewY + pos.element.offsetHeight);
        });
        
        // Constrain group bounds to canvas
        const groupWidth = maxX - minX;
        const groupHeight = maxY - minY;
        const constrainedMinX = Math.max(0, Math.min(minX, canvasRect.width - groupWidth));
        const constrainedMinY = Math.max(0, Math.min(minY, canvasRect.height - groupHeight));
        
        // Calculate adjustment needed to keep group within bounds
        const adjustX = constrainedMinX - minX;
        const adjustY = constrainedMinY - minY;
        
        // Move all elements in the group with adjustment
        initialPositions.forEach(pos => {
          const elementNewX = pos.x + deltaX + adjustX;
          const elementNewY = pos.y + deltaY + adjustY;
          
          pos.element.style.left = elementNewX + 'px';
          pos.element.style.top = elementNewY + 'px';
        });
        
        // Update group container position
        updateGroupContainers();
      }
      
      function onMouseUp() {
        groupContainer.classList.remove('dragging');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    // Start dragging
    function startDrag(e) {
      if (e.target.classList.contains('resize-handle') || 
          e.target.classList.contains('text-editable') ||
          e.target.classList.contains('placeholder-element') ||
          e.target.classList.contains('line-width-input') ||
          e.target.classList.contains('line-height-input') ||
          e.target.classList.contains('table-width-input') ||
          e.target.classList.contains('table-height-input') ||
          e.target.tagName === 'INPUT' ||
          e.target.tagName === 'BUTTON' ||
          e.target.contentEditable === 'true') return;
      
      isDragging = true;
      const element = e.currentTarget;
      const rect = element.getBoundingClientRect();
      const canvasRect = document.getElementById('canvas').getBoundingClientRect();
      
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
      
      // Determine what to drag
      let elementsToDrag = [];
      if (selectedElements.length > 1 && selectedElements.includes(element)) {
        // Drag all selected elements
        elementsToDrag = selectedElements;
      } else {
        // Drag single element
        elementsToDrag = [element];
      }
      
      // Store initial positions
      const initialPositions = elementsToDrag.map(el => ({
        element: el,
        x: parseInt(el.style.left) || 0,
        y: parseInt(el.style.top) || 0
      }));
      
      elementsToDrag.forEach(el => el.classList.add('dragging'));
      
      function onMouseMove(e) {
        if (!isDragging) return;
        
        const deltaX = e.clientX - canvasRect.left - dragOffset.x - initialPositions[0].x;
        const deltaY = e.clientY - canvasRect.top - dragOffset.y - initialPositions[0].y;
        
        initialPositions.forEach(pos => {
          const newX = pos.x + deltaX;
          const newY = pos.y + deltaY;
          
          pos.element.style.left = Math.max(0, Math.min(newX, canvasRect.width - pos.element.offsetWidth)) + 'px';
          pos.element.style.top = Math.max(0, Math.min(newY, canvasRect.height - pos.element.offsetHeight)) + 'px';
        });
        
        // Update group containers if elements are grouped
        updateGroupContainers();
      }
      
      function onMouseUp() {
        isDragging = false;
        elementsToDrag.forEach(el => el.classList.remove('dragging'));
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    // Update group containers when elements move
    function updateGroupContainers() {
      groups.forEach(group => {
        const canvas = document.getElementById('canvas');
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        group.elements.forEach(element => {
          const rect = element.getBoundingClientRect();
          const canvasRect = canvas.getBoundingClientRect();
          const x = rect.left - canvasRect.left;
          const y = rect.top - canvasRect.top;
          const width = rect.width;
          const height = rect.height;
          
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x + width);
          maxY = Math.max(maxY, y + height);
        });
        
        group.container.style.left = (minX - 5) + 'px';
        group.container.style.top = (minY - 5) + 'px';
        group.container.style.width = (maxX - minX + 10) + 'px';
        group.container.style.height = (maxY - minY + 10) + 'px';
      });
    }

    // Initialize everything
    window.onload = function() {
      initializeDragAndDrop();
      
      // Set up image upload handlers
      document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
      document.getElementById('employeePhotoUpload').addEventListener('change', handleEmployeePhotoUpload);
      
      // Set up custom text input
      document.getElementById('custom-text').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          addCustomText();
        }
      });
      
      // Add sample elements
      setTimeout(() => {
        createElement('text', 'EMPLOYEE RECORD', 50, 50);
        createElement('placeholder', '{employee_name}', 50, 100);
        createElement('text', 'Employee ID:', 50, 150);
        createElement('placeholder', '{employee_id}', 150, 150);
        
        alert('💡 Tips:\n• Click any text to edit it directly\n• Select text and use formatting buttons\n• Drag elements to reposition\n• Try the 🖼️ Add Image button!\n• NEW: Ctrl+Click to select multiple elements\n• NEW: 📦 Group Selected to create groups\n• NEW: Drag groups as units!\n• Perfect for HR documents like employee records, performance reviews, job offers!');
      }, 500);
    };

    // Update image placeholder size
    function updateImageSize(input, dimension) {
      const imageElement = input.closest('.image-placeholder-element');
      if (!imageElement) return;
      
      const value = parseInt(input.value);
      if (value < 50 || value > 500) {
        alert('Size must be between 50 and 500 pixels');
        return;
      }
      
      if (dimension === 'width') {
        imageElement.style.width = value + 'px';
      } else if (dimension === 'height') {
        imageElement.style.height = value + 'px';
      }
    }

    // Formatting functions
    function formatSelected(command) {
      if (!selectedElement) {
        alert('Please select a text element first');
        return;
      }
      
      const textElement = selectedElement.querySelector('.text-editable');
      if (!textElement) {
        alert('Selected element is not editable text');
        return;
      }
      
      textElement.focus();
      document.execCommand(command, false, null);
      textElement.focus();
    }

    // Text alignment function
    function alignText(alignment) {
      if (!selectedElement) {
        alert('Please select a text element first');
        return;
      }
      
      const textElement = selectedElement.querySelector('.text-editable');
      if (!textElement) {
        alert('Selected element is not editable text');
        return;
      }
      
      textElement.style.textAlign = alignment;
    }

    // Select a table cell
    function selectCell(cell) {
      // Remove previous selection
      if (selectedCell) {
        selectedCell.classList.remove('selected-cell');
      }
      
      // Select new cell
      selectedCell = cell;
      selectedCell.classList.add('selected-cell');
    }

    // Align selected cell
    function alignSelectedCell(alignment) {
      if (!selectedCell) {
        alert('Please click on a table cell first');
        return;
      }
      
      selectedCell.style.textAlign = alignment;
    }

    // Align table cells (keep for backward compatibility)
    function alignTableCells(element, alignment) {
      const table = element.querySelector('.table-element');
      if (!table) {
        alert('Selected element is not a table');
        return;
      }
      
      // Apply alignment to all cells in the table
      for (let i = 0; i < table.rows.length; i++) {
        for (let j = 0; j < table.rows[i].cells.length; j++) {
          table.rows[i].cells[j].style.textAlign = alignment;
        }
      }
    }

    // Start column resize
    function startColumnResize(e, columnIndex, table) {
      e.preventDefault();
      e.stopPropagation();
      
      const startX = e.clientX;
      const columnCells = [];
      
      // Get all cells in this column
      for (let i = 0; i < table.rows.length; i++) {
        if (table.rows[i].cells[columnIndex]) {
          columnCells.push(table.rows[i].cells[columnIndex]);
        }
      }
      
      const startWidth = columnCells[0].offsetWidth;
      
      // Add active class to handle
      const handle = e.target;
      handle.classList.add('active');
      
      function onMouseMove(e) {
        const deltaX = e.clientX - startX;
        const newWidth = Math.max(50, startWidth + deltaX);
        
        // Apply new width to all cells in this column
        columnCells.forEach(cell => {
          cell.style.width = newWidth + 'px';
          cell.style.minWidth = newWidth + 'px';
        });
      }
      
      function onMouseUp() {
        handle.classList.remove('active');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    // Start row resize
    function startRowResize(e, rowIndex, table) {
      e.preventDefault();
      e.stopPropagation();
      
      const startY = e.clientY;
      const rowCells = [];
      
      // Get all cells in this row
      if (table.rows[rowIndex]) {
        for (let j = 0; j < table.rows[rowIndex].cells.length; j++) {
          rowCells.push(table.rows[rowIndex].cells[j]);
        }
      }
      
      const startHeight = rowCells[0].offsetHeight;
      
      // Add active class to handle
      const handle = e.target;
      handle.classList.add('active');
      
      function onMouseMove(e) {
        const deltaY = e.clientY - startY;
        const newHeight = Math.max(30, startHeight + deltaY);
        
        // Apply new height to all cells in this row
        rowCells.forEach(cell => {
          cell.style.height = newHeight + 'px';
          cell.style.minHeight = newHeight + 'px';
        });
      }
      
      function onMouseUp() {
        handle.classList.remove('active');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    // Start cell drag resize from middle
    function startCellDragResize(e, cell, columnIndex, rowIndex, table) {
      e.preventDefault();
      e.stopPropagation();
      
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = cell.offsetWidth;
      const startHeight = cell.offsetHeight;
      
      // Add active class to drag zone
      const dragZone = e.target;
      dragZone.classList.add('active');
      
      // Get all cells in the same column and row
      const columnCells = [];
      const rowCells = [];
      
      for (let i = 0; i < table.rows.length; i++) {
        if (table.rows[i].cells[columnIndex]) {
          columnCells.push(table.rows[i].cells[columnIndex]);
        }
      }
      
      if (table.rows[rowIndex]) {
        for (let j = 0; j < table.rows[rowIndex].cells.length; j++) {
          rowCells.push(table.rows[rowIndex].cells[j]);
        }
      }
      
      function onMouseMove(e) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        // Resize column width if dragging horizontally
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          const newWidth = Math.max(50, startWidth + deltaX);
          columnCells.forEach(cell => {
            cell.style.width = newWidth + 'px';
            cell.style.minWidth = newWidth + 'px';
          });
        }
        // Resize row height if dragging vertically
        else {
          const newHeight = Math.max(30, startHeight + deltaY);
          rowCells.forEach(cell => {
            cell.style.height = newHeight + 'px';
            cell.style.minHeight = newHeight + 'px';
          });
        }
      }
      
      function onMouseUp() {
        dragZone.classList.remove('active');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    // Modal Functions
    function openImageModal() {
      const modal = document.getElementById('imageUploadModal');
      modal.style.display = 'block';
      
      // Reset form
      document.querySelector('input[name="imageSource"][value="upload"]').checked = true;
      document.getElementById('urlInputGroup').style.display = 'none';
      document.getElementById('imageWidth').value = '200';
      document.getElementById('imageHeight').value = '150';
      document.getElementById('imageUrl').value = '';
      
      // Add event listeners for radio buttons
      document.querySelectorAll('input[name="imageSource"]').forEach(radio => {
        radio.addEventListener('change', function() {
          const urlGroup = document.getElementById('urlInputGroup');
          if (this.value === 'url') {
            urlGroup.style.display = 'block';
          } else {
            urlGroup.style.display = 'none';
          }
        });
      });
      
      // Close modal when clicking outside
      window.onclick = function(event) {
        if (event.target === modal) {
          closeImageModal();
        }
      };
    }

    function closeImageModal() {
      const modal = document.getElementById('imageUploadModal');
      modal.style.display = 'none';
      window.onclick = null;
    }

    function setImageSize(width, height) {
      document.getElementById('imageWidth').value = width;
      document.getElementById('imageHeight').value = height;
    }

    function confirmImageUpload() {
      const sourceType = document.querySelector('input[name="imageSource"]:checked').value;
      const width = parseInt(document.getElementById('imageWidth').value);
      const height = parseInt(document.getElementById('imageHeight').value);
      
      // Validate dimensions
      if (!width || !height || width < 50 || width > 500 || height < 50 || height > 500) {
        alert('Please enter valid dimensions between 50 and 500 pixels.');
        return;
      }
      
      const imgWidth = Math.max(50, Math.min(500, width));
      const imgHeight = Math.max(50, Math.min(500, height));
      
      if (sourceType === 'upload') {
        // Upload from computer
        document.getElementById('imageUpload').click();
        window.currentImageContainer = 'new';
        window.currentImageDimensions = { width: imgWidth, height: imgHeight };
      } else {
        // URL input
        const url = document.getElementById('imageUrl').value.trim();
        if (!url) {
          alert('Please enter a valid image URL.');
          return;
        }
        
        const canvas = document.getElementById('canvas');
        const rect = canvas.getBoundingClientRect();
        const x = Math.random() * (rect.width - imgWidth) + 50;
        const y = Math.random() * (rect.height - imgHeight) + 50;
        
        createElement('image', url, x, y, imgWidth, imgHeight);
      }
      
      closeImageModal();
    }

    // Add resize handles to table cells
    function addTableCellResizeHandles(cell, isLastColumn, isLastRow) {
      // Remove existing handles
      cell.querySelectorAll('.table-cell-resize-handle').forEach(handle => handle.remove());
      
      console.log('Adding resize handles to cell', cell, 'isLastColumn:', isLastColumn, 'isLastRow:', isLastRow);
      
      // Add width handle (except for last column)
      if (!isLastColumn) {
        const widthHandle = document.createElement('div');
        widthHandle.className = 'table-cell-resize-handle width-handle';
        widthHandle.addEventListener('mousedown', (e) => {
          console.log('Width handle clicked');
          startCellWidthResize(e, cell);
        });
        cell.appendChild(widthHandle);
        console.log('Added width handle to cell');
      }
      
      // Add height handle (except for last row)
      if (!isLastRow) {
        const heightHandle = document.createElement('div');
        heightHandle.className = 'table-cell-resize-handle height-handle';
        heightHandle.addEventListener('mousedown', (e) => startCellHeightResize(e, cell));
        cell.appendChild(heightHandle);
      }
      
      // Add corner handle (except for last column and row)
      if (!isLastColumn && !isLastRow) {
        const cornerHandle = document.createElement('div');
        cornerHandle.className = 'table-cell-resize-handle corner-handle';
        cornerHandle.addEventListener('mousedown', (e) => startCellCornerResize(e, cell));
        cell.appendChild(cornerHandle);
      }
    }

    // Start cell width resize
    function startCellWidthResize(e, cell) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Starting cell width resize');
      
      const handle = e.target;
      const table = cell.closest('.table-element');
      const cellIndex = Array.from(cell.parentNode.children).indexOf(cell);
      
      const startX = e.clientX;
      const startWidth = cell.offsetWidth;
      
      console.log('Start width:', startWidth, 'Cell index:', cellIndex);
      
      handle.classList.add('active');
      
      function onMouseMove(e) {
        const deltaX = e.clientX - startX;
        const newWidth = Math.max(50, startWidth + deltaX);
        
        // Apply width to all cells in this column
        for (let i = 0; i < table.rows.length; i++) {
          if (table.rows[i].cells[cellIndex]) {
            table.rows[i].cells[cellIndex].style.width = newWidth + 'px';
            table.rows[i].cells[cellIndex].style.minWidth = newWidth + 'px';
          }
        }
      }
      
      function onMouseUp() {
        handle.classList.remove('active');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    // Start cell height resize
    function startCellHeightResize(e, cell) {
      e.preventDefault();
      e.stopPropagation();
      
      const handle = e.target;
      const table = cell.closest('.table-element');
      const rowIndex = Array.from(table.rows).indexOf(cell.parentNode);
      
      const startY = e.clientY;
      const startHeight = cell.offsetHeight;
      
      handle.classList.add('active');
      
      function onMouseMove(e) {
        const deltaY = e.clientY - startY;
        const newHeight = Math.max(30, startHeight + deltaY);
        
        // Apply height to all cells in this row
        if (table.rows[rowIndex]) {
          for (let j = 0; j < table.rows[rowIndex].cells.length; j++) {
            table.rows[rowIndex].cells[j].style.height = newHeight + 'px';
            table.rows[rowIndex].cells[j].style.minHeight = newHeight + 'px';
          }
        }
      }
      
      function onMouseUp() {
        handle.classList.remove('active');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    // Start cell corner resize (both width and height)
    function startCellCornerResize(e, cell) {
      e.preventDefault();
      e.stopPropagation();
      
      const handle = e.target;
      const table = cell.closest('.table-element');
      const cellIndex = Array.from(cell.parentNode.children).indexOf(cell);
      const rowIndex = Array.from(table.rows).indexOf(cell.parentNode);
      
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = cell.offsetWidth;
      const startHeight = cell.offsetHeight;
      
      handle.classList.add('active');
      
      function onMouseMove(e) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const newWidth = Math.max(50, startWidth + deltaX);
        const newHeight = Math.max(30, startHeight + deltaY);
        
        // Apply width to all cells in this column
        for (let i = 0; i < table.rows.length; i++) {
          if (table.rows[i].cells[cellIndex]) {
            table.rows[i].cells[cellIndex].style.width = newWidth + 'px';
            table.rows[i].cells[cellIndex].style.minWidth = newWidth + 'px';
          }
        }
        
        // Apply height to all cells in this row
        if (table.rows[rowIndex]) {
          for (let j = 0; j < table.rows[rowIndex].cells.length; j++) {
            table.rows[rowIndex].cells[j].style.height = newHeight + 'px';
            table.rows[rowIndex].cells[j].style.minHeight = newHeight + 'px';
          }
        }
      }
      
      function onMouseUp() {
        handle.classList.remove('active');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    // Add resize handles to image containers
    function addImageResizeHandles(container) {
      // Remove existing handles
      container.querySelectorAll('.image-resize-handle').forEach(handle => handle.remove());
      
      // Add four corner handles
      ['nw', 'ne', 'sw', 'se'].forEach(direction => {
        const handle = document.createElement('div');
        handle.className = `image-resize-handle ${direction}`;
        handle.addEventListener('mousedown', (e) => startImageResize(e, container, direction));
        container.appendChild(handle);
      });
    }

    // Start image resize
    function startImageResize(e, container, direction) {
      e.preventDefault();
      e.stopPropagation();
      
      const handle = e.target;
      const canvas = document.getElementById('canvas');
      const canvasRect = canvas.getBoundingClientRect();
      const element = container.closest('.canvas-element');
      
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = container.offsetWidth;
      const startHeight = container.offsetHeight;
      const startLeft = parseInt(element.style.left) || 0;
      const startTop = parseInt(element.style.top) || 0;
      
      handle.classList.add('active');
      
      function onMouseMove(e) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        let newWidth = startWidth;
        let newHeight = startHeight;
        let newLeft = startLeft;
        let newTop = startTop;
        
        // Calculate new dimensions based on direction
        switch(direction) {
          case 'se': // Southeast - resize from bottom-right
            newWidth = Math.max(50, Math.min(500, startWidth + deltaX));
            newHeight = Math.max(50, Math.min(500, startHeight + deltaY));
            break;
          case 'sw': // Southwest - resize from bottom-left
            newWidth = Math.max(50, Math.min(500, startWidth - deltaX));
            newHeight = Math.max(50, Math.min(500, startHeight + deltaY));
            newLeft = Math.max(0, Math.min(startLeft + deltaX, canvasRect.width - newWidth));
            break;
          case 'ne': // Northeast - resize from top-right
            newWidth = Math.max(50, Math.min(500, startWidth + deltaX));
            newHeight = Math.max(50, Math.min(500, startHeight - deltaY));
            newTop = Math.max(0, Math.min(startTop + deltaY, canvasRect.height - newHeight));
            break;
          case 'nw': // Northwest - resize from top-left
            newWidth = Math.max(50, Math.min(500, startWidth - deltaX));
            newHeight = Math.max(50, Math.min(500, startHeight - deltaY));
            newLeft = Math.max(0, Math.min(startLeft + deltaX, canvasRect.width - newWidth));
            newTop = Math.max(0, Math.min(startTop + deltaY, canvasRect.height - newHeight));
            break;
        }
        
        // Apply new dimensions
        container.style.width = newWidth + 'px';
        container.style.height = newHeight + 'px';
        element.style.left = newLeft + 'px';
        element.style.top = newTop + 'px';
      }
      
      function onMouseUp() {
        handle.classList.remove('active');
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
