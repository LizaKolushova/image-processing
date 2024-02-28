const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let img = new Image();
const modal = document.querySelector(".modal");
const trigger = document.querySelector(".trigger");
const closeButton = document.querySelector(".close-button");
let colorPickerActive = false;

function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);

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
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
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
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
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