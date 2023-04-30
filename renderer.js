const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

let imagePathList = [];
let currentImageIndex = 0;

document.getElementById('start-test').addEventListener('click', async () => {
  const directoryPath = await ipcRenderer.invoke('select-directory');
  if (!directoryPath) return;

  const aDir = path.join(directoryPath, 'A');
  const bDir = path.join(directoryPath, 'B');

  if (!fs.existsSync(aDir)) {
    fs.mkdirSync(aDir);
  }
  if (!fs.existsSync(bDir)) {
    fs.mkdirSync(bDir);
  }

  // imagePathList = fs.readdirSync(directoryPath).filter(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'));
  imagePathList = fs.readdirSync(directoryPath).filter(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')).map(file => path.join(directoryPath, file));

  currentImageIndex = 0;

  if (imagePathList.length > 0) {
    displayImage(directoryPath, imagePathList[currentImageIndex]);
    document.getElementById('image-counter').innerText = `画像 ${currentImageIndex + 1} / ${imagePathList.length}`;
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    const directoryPath = path.dirname(imagePathList[currentImageIndex]);
    const targetDir = event.key === 'ArrowRight' ? 'A' : 'B';
    const src = imagePathList[currentImageIndex];
    const dest = path.join(directoryPath, targetDir, path.basename(imagePathList[currentImageIndex]));

    ipcRenderer.invoke('move-file', { src, dest });

    currentImageIndex++;

    if (currentImageIndex < imagePathList.length) {
      displayImage(directoryPath, imagePathList[currentImageIndex]);
      document.getElementById('image-counter').innerText = `画像 ${currentImageIndex + 1} / ${imagePathList.length}`;
    } else {
      document.getElementById('image-display').src = '';
      document.getElementById('image-counter').innerText = 'ABテストが終了しました';
    }
  }
});

function displayImage(directoryPath, imagePath) {
  document.getElementById('image-display').src = imagePath;
}
