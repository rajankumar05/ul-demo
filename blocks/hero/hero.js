export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  let pictureRow = null;
  const contentRows = [];

  rows.forEach((row) => {
    const pic = row.querySelector('picture, img');
    if (pic && !pictureRow) {
      pictureRow = row;
    } else {
      contentRows.push(row);
    }
  });

  if (!pictureRow) return;

  const picture = pictureRow.querySelector('picture') || pictureRow.querySelector('img')?.parentElement;
  const img = pictureRow.querySelector('img');

  const imageLayer = document.createElement('div');
  imageLayer.className = 'hero-image';
  if (img) {
    img.setAttribute('loading', 'eager');
    img.setAttribute('fetchpriority', 'high');
    if (!img.getAttribute('width')) img.setAttribute('width', '1920');
    if (!img.getAttribute('height')) img.setAttribute('height', '380');
  }
  if (picture && picture.tagName === 'PICTURE') {
    imageLayer.append(picture);
  } else if (img) {
    imageLayer.append(img);
  }

  const contentBox = document.createElement('div');
  contentBox.className = 'hero-content';

  contentRows.forEach((row) => {
    const inner = row.querySelector('div');
    if (inner) {
      [...inner.childNodes].forEach((child) => contentBox.append(child));
    } else {
      [...row.childNodes].forEach((child) => contentBox.append(child));
    }
    row.remove();
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'hero-inner';
  wrapper.append(contentBox);

  block.textContent = '';
  block.append(imageLayer, wrapper);
}
