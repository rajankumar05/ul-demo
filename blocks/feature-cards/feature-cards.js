export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  const grid = document.createElement('div');
  grid.className = 'feature-cards-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;

    const card = document.createElement('div');
    card.className = 'feature-card';

    const imgCell = cells[0];
    const bodyCell = cells[1];

    const img = imgCell.querySelector('img');
    if (img) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'feature-card-image';
      imgWrap.append(img);
      card.append(imgWrap);
    }

    const body = document.createElement('div');
    body.className = 'feature-card-body';
    [...bodyCell.childNodes].forEach((node) => body.append(node));
    card.append(body);

    grid.append(card);
    row.remove();
  });

  block.textContent = '';
  block.append(grid);
}
