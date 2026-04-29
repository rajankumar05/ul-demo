export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const introRow = rows[0];
  const serviceRows = rows.slice(1);

  const wrapper = document.createElement('div');
  wrapper.className = 'service-grid-layout';

  const left = document.createElement('div');
  left.className = 'service-grid-intro';
  [...introRow.children].forEach((cell) => {
    [...cell.childNodes].forEach((node) => left.append(node));
  });
  introRow.remove();

  const right = document.createElement('div');
  right.className = 'service-grid-items';

  serviceRows.forEach((row) => {
    const item = document.createElement('div');
    item.className = 'service-grid-item';

    const cells = [...row.children];
    if (cells.length >= 2) {
      const iconCell = cells[0];
      const bodyCell = cells[1];

      const iconWrap = document.createElement('div');
      iconWrap.className = 'service-grid-icon';
      const img = iconCell.querySelector('img');
      if (img) iconWrap.append(img);

      const bodyWrap = document.createElement('div');
      bodyWrap.className = 'service-grid-body';
      [...bodyCell.childNodes].forEach((node) => bodyWrap.append(node));

      item.append(iconWrap, bodyWrap);
    }
    row.remove();
    right.append(item);
  });

  wrapper.append(left, right);
  block.textContent = '';
  block.append(wrapper);
}
