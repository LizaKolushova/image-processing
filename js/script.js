const canvas = document.getElementById('canvas');
const canvasSave = document.getElementById('canvas-none');
const ctx = canvas.getContext('2d');
const ctxSave = canvasSave.getContext('2d');
let img = new Image();
const modalDownload = document.querySelector(".modalDownload");
const modalBackdrop = document.querySelector(".modalBackdrop");
const trigger = document.querySelector(".trigger");
const ResiseFileModal = document.querySelector(".openResiseFileModal");
const closeBackdrop = document.querySelector(".close-Backdrop");
const closeDownload = document.querySelector(".close-Download");
let colorPickerActive = false;
const scaleDropdown = document.getElementById('scale-dropdown');

function toggleModal() {
  modalDownload.classList.toggle("show-modal");
}
function toggleModalBackdrop() {
  modalBackdrop.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

function windowOnClickBackdrop(event) {
  if (event.target === modal) {
    toggleModalBackdrop();
  }
}

trigger.addEventListener("click", toggleModal);
ResiseFileModal.addEventListener("click", toggleModalBackdrop);
closeDownload.addEventListener("click", toggleModal);
closeBackdrop.addEventListener("click", toggleModalBackdrop);
window.addEventListener("click", windowOnClick);
window.addEventListener("click", windowOnClickBackdrop);


function calculateScale(width, height) {
  let maxWidth = window.innerWidth - 100;
  let maxHeight = window.innerHeight - 100;
  let scale = Math.min(maxWidth / width, maxHeight / height);
  return scale;
}

// Получаем ссылки на элементы модального окна
const percentageMethod = document.getElementById('percentageMethod');
const pixelsMethod = document.getElementById('pixelsMethod');

// Получаем ссылку на выпадающий список выбора способа изменения размера
const resizeMethodDropdown = document.getElementById('resizeMethod');

// Добавляем обработчик события для изменений в выпадающем списке
resizeMethodDropdown.addEventListener('change', function() {
    // Получаем значение выбранного элемента
    const selectedMethod = this.value;

    // Скрываем все элементы
    percentageMethod.style.display = 'none';
    pixelsMethod.style.display = 'none';

    // Показываем только выбранный элемент
    if (selectedMethod === 'percentage') {
        percentageMethod.style.display = 'block';
    } else {
        pixelsMethod.style.display = 'block';
    }
});
// Получаем ссылки на элементы tooltip
const tooltip = document.getElementById('tooltip');
const tooltipText = document.getElementById('tooltipText');

// Добавляем обработчики событий для показа и скрытия текста подсказки
tooltip.addEventListener('mouseover', function() {
    tooltipText.style.visibility = 'visible';
});

tooltip.addEventListener('mouseout', function() {
    tooltipText.style.visibility = 'hidden';
});

document.getElementById('load-image').addEventListener('click', function(e) {
  e.preventDefault();
  const fileInput = document.getElementById('file-input');
  const urlInput = document.getElementById('url-input');
  
  if (fileInput.files.length === 0 && urlInput.value === '') {
    alert('Please select an image file or enter an image URL.');
    return;
  }
  
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
      fetch(e.target.result)
        .then(res => res.blob())
        .then(blob => {
          img.onload = function() {
            let scale = calculateScale(img.width, img.height);
            canvas.width = window.innerWidth - 100;
            canvas.height = window.innerHeight - 100;
            let imageWidth = img.width * scale;
            let imageHeight = img.height * scale;
            let x = (canvas.width - imageWidth) / 2;
            let y = (canvas.height - imageHeight) / 2;
            ctx.drawImage(img, x, y, imageWidth, imageHeight);
            // canvas.width = img.width;
            // canvas.height = img.height;
            // ctx.drawImage(img, 0, 0);
            document.getElementById('width').value = img.width;
            document.getElementById('height').value = img.height;
            document.getElementById('resizePercentageWidth').value = 100;
            document.getElementById('resizePercentageHeight').value = 100;
            document.getElementById('image-info').innerText = `Image Size: ${img.width} x ${img.height}`;
          }
          img.src = URL.createObjectURL(blob);
        });
    }
    
    reader.readAsDataURL(file);
  } else {
    fetch(urlInput.value)
      .then(res => res.blob())
      .then(blob => {
        img.onload = function() {
          let scale = calculateScale(img.width, img.height);
          canvas.width = window.innerWidth - 100;
          canvas.height = window.innerHeight - 100;
          let imageWidth = img.width * scale;
          let imageHeight = img.height * scale;
          let x = (canvas.width - imageWidth) / 2;
          let y = (canvas.height - imageHeight) / 2;
          ctx.drawImage(img, x, y, imageWidth, imageHeight);
          // canvas.width = img.width;
          // canvas.height = img.height;
          // ctx.drawImage(img, 0, 0);
          document.getElementById('width').value = img.width;
          document.getElementById('height').value = img.height;
          document.getElementById('resizePercentageWidth').value = 100;
          document.getElementById('resizePercentageHeight').value = 100;
          document.getElementById('image-info').innerText = `Image Size: ${img.width} x ${img.height}`;
        }
        img.src = URL.createObjectURL(blob);
      });
      
  }
  toggleModal();
});


document.getElementById('reset-image').addEventListener('click', function() {
  loadedImage.src = '';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById('file-input').value = '';
  document.getElementById('url-input').value = '';
  document.getElementById('image-info').innerText = '';
});

canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.round(e.clientX - rect.left);
  const y = Math.round(e.clientY - rect.top);
  
  document.getElementById('coordinates-info').innerText = `Coordinates: (${x}, ${y})`;
});

canvas.addEventListener('click', function(e) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.round(e.clientX - rect.left);
  const y = Math.round(e.clientY - rect.top);

  const imageData = ctx.getImageData(x, y, 1, 1).data;

  const colorInfo = `Color: RGB (${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
  
  const colorCircle = document.createElement('div');
  colorCircle.className = 'color-circle';
  colorCircle.style.backgroundColor = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;

  document.getElementById('color-info').innerText = colorInfo;
  document.getElementById('coordinates-info').innerText = `Coordinates: (${x}, ${y})`;
  const colorCircleContainer = document.getElementById('color-circle-container');
  colorCircleContainer.innerHTML = '';
  colorCircleContainer.appendChild(colorCircle);
});

// Функция для масштабирования изображения
function scaleImage(scalePercentage) {
  const scaleFactor = scalePercentage / 100;
  const newWidth = img.width * scaleFactor;
  const newHeight = img.height * scaleFactor;
  
  canvas.width = newWidth;
  canvas.height = newHeight;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, newWidth, newHeight);
}

// Обработчик изменения значения в выпадающем списке масштаба
scaleDropdown.addEventListener('change', function() {
  const scalePercentage = parseInt(this.value);
  scaleImage(scalePercentage);
});


// Обработчик события для кнопки сохранения
document.getElementById('save-button').addEventListener('click', function() {
  const link = document.createElement('a');
  link.href = canvasSave.toDataURL("image/png");
  link.download = 'scaled_image.png';
  link.click();
});

// document.getElementById('color-picker').addEventListener('click', function () {
//   colorPickerActive = !colorPickerActive;
//   if (colorPickerActive) {
//       // Add logic to enable color picker (you can implement color picking functionality here)
//       alert('Color Picker Activated!');
//   } else {
//       // Add logic to disable color picker
//       alert('Color Picker Deactivated!');
//   }
// });

document.getElementById('applyChanges').addEventListener('click', function() {
  const method = document.getElementById('resizeMethod').value;
  let newWidth, newHeight;

  if (method === 'percentage') {
      const widthPercentage = parseInt(document.getElementById('resizePercentageWidth').value);
      const heightPercentage = parseInt(document.getElementById('resizePercentageHeight').value);
      if (widthPercentage <= 0 || heightPercentage <= 0) {
          alert('Введите корректные значения процента');
          return;
      }
      newWidth = img.width * widthPercentage / 100;
      newHeight = img.height * heightPercentage / 100;
  } else {
      const width = parseInt(document.getElementById('width').value);
      const height = parseInt(document.getElementById('height').value);
      if (width <= 0 || height <= 0) {
          alert('Введите корректные значения ширины и высоты');
          return;
      }
      newWidth = width;
      newHeight = height;
  }

  // Проверяем, была ли выбрана опция "Сохранить пропорции"
  const maintainAspectRatio = document.getElementById('maintainAspectRatio').checked;
  if (maintainAspectRatio) {
      // Рассчитываем новые размеры с сохранением пропорций
      const aspectRatio = img.width / img.height;
      const newAspectRatio = newWidth / newHeight;
      if (newAspectRatio > aspectRatio) {
          newWidth = newHeight * aspectRatio;
      } else {
          newHeight = newWidth / aspectRatio;
      }
  }

  // Изменяем размер изображения
  resizeImage(newWidth, newHeight);

  // Закрываем модальное окно
  toggleModalBackdrop();
});
//Функция для изменения размера изображения
function resizeImage(newWidth, newHeight) {
  canvas.width = newWidth;
  canvas.height = newHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, newWidth, newHeight);
  canvasSave.width = newWidth;
  canvasSave.height = newHeight;
  ctxSave.clearRect(0, 0, canvasSave.width, canvasSave.height);
  ctxSave.drawImage(img, 0, 0, newWidth, newHeight);
  document.getElementById('width').value = newWidth;
  document.getElementById('height').value = newHeight;
  WidthS = Math.round(newWidth);
  HeightS = Math.round(newHeight);
  document.getElementById('image-info').innerText = `Image Size: ${WidthS} x ${HeightS}`;

  // Выводим информацию об измененном размере
  const originalPixels = img.width * img.height;
  const newPixels = newWidth * newHeight;
  alert(`Изменение размера:\n\nИсходное количество пикселей: ${originalPixels}\nНовое количество пикселей: ${newPixels}`);
  img.src = canvas.toDataURL()
}
