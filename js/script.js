const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let img = new Image();

document.getElementById('load-image').addEventListener('click', function() {
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
      img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        document.getElementById('image-info').innerText = `Image Size: ${img.width} x ${img.height} pixels`;
      }
      img.src = e.target.result;
    }
    
    reader.readAsDataURL(file);
  } else {
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      document.getElementById('image-info').innerText = `Image Size: ${img.width} x ${img.height} pixels`;
    }
    img.src = urlInput.value;
  }
});

document.getElementById('reset-image').addEventListener('click', function() {
  img.src = '';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById('file-input').value = '';
  document.getElementById('url-input').value = '';
  document.getElementById('image-info').innerText = '';
});

canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  document.getElementById('coordinates-info').innerText = `Coordinates: (${x}, ${y})`;
});

canvas.addEventListener('click', function(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const imageData = ctx.getImageData(x, y, 1, 1).data;

  const colorInfo = `Color: RGB(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
  
  const colorCircle = document.createElement('div');
  colorCircle.className = 'color-circle';
  colorCircle.style.backgroundColor = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;

  document.getElementById('color-info').innerText = colorInfo;
  document.getElementById('coordinates-info').innerText = `Coordinates: (${x}, ${y})`;
  const colorCircleContainer = document.getElementById('color-circle-container');
  colorCircleContainer.innerHTML = '';
  colorCircleContainer.appendChild(colorCircle);
});