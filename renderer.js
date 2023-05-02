const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

let imagePathList = [];
let currentImageIndex = 0;

document.getElementById('start-test').addEventListener('click', async () => {
  const directoryPath = await ipcRenderer.invoke('select-directory');
  if (!directoryPath) return;

  const ngDir = path.join(directoryPath, 'ng');
  if (!fs.existsSync(ngDir)) {
    fs.mkdirSync(ngDir);
  }

  imagePathList = fs.readdirSync(directoryPath).filter(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')).map(file => path.join(directoryPath, file));

  currentImageIndex = 0;

  if (imagePathList.length > 0) {
    displayImage(directoryPath, imagePathList[currentImageIndex]);
    document.getElementById('image-counter').innerText = `Images: ${currentImageIndex + 1} / ${imagePathList.length}`;
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    const directoryPath = path.dirname(imagePathList[currentImageIndex]);
    const targetDir = event.key === 'ArrowRight' ? 'ok' : 'ng';
    const src = imagePathList[currentImageIndex];
    const dest = path.join(directoryPath, targetDir, path.basename(imagePathList[currentImageIndex]));

    if (targetDir === 'ng') {
      ipcRenderer.invoke('move-file', { src, dest });
    }

    currentImageIndex++;

    if (currentImageIndex < imagePathList.length) {
      displayImage(directoryPath, imagePathList[currentImageIndex]);
      document.getElementById('image-counter').innerText = `Images: ${currentImageIndex + 1} / ${imagePathList.length}`;
    } else {
      document.getElementById('image-display').src = '';
      document.getElementById('image-counter').innerText = 'Done';
    }
  }
});

function displayImage(directoryPath, imagePath) {
  document.getElementById('image-display').src = imagePath;
}
