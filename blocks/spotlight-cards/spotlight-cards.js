export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 1) return;

  const grid = document.createElement('div');
  grid.className = 'spotlight-cards-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;

    const card = document.createElement('div');
    card.className = 'spotlight-card';

    const iconCell = cells[0];
    const bodyCell = cells[1];

    const icon = iconCell.querySelector('img');
    if (icon) {
      const iconWrap = document.createElement('div');
      iconWrap.className = 'spotlight-card-icon';
      iconWrap.append(icon);
      card.append(iconWrap);
    }

    const body = document.createElement('div');
    body.className = 'spotlight-card-body';
    [...bodyCell.childNodes].forEach((node) => body.append(node));

    const links = body.querySelectorAll('a');
    links.forEach((a) => {
      if (!a.closest('p') || a.parentElement.children.length === 1) {
        a.classList.add('spotlight-cta');
      }
    });

    card.append(body);
    grid.append(card);
    row.remove();
  });

  block.textContent = '';
  block.append(grid);
}
