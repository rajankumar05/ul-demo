/* eslint-disable */
/* global WebImporter */

/**
 * Parser for service-grid variant.
 * Handles the "What do we do for our customers?" section.
 * 30/70 split: left = heading + description, right = 2-col grid of service items.
 * Row 1: intro (heading + description)
 * Row 2+: each service item (icon | title + desc + link)
 */
export default function parse(element, { document }) {
  const cells = [];

  const headingEl = element.querySelector('.grid-item--thirty');
  const servicesEl = element.querySelector('.grid-item--seventy');

  if (!headingEl || !servicesEl) return;

  const introCell = document.createElement('div');
  const h2 = headingEl.querySelector('h2');
  if (h2) {
    const heading = document.createElement('h2');
    heading.textContent = h2.textContent.trim();
    introCell.append(heading);
  }
  const desc = headingEl.querySelector('p');
  if (desc) {
    const p = document.createElement('p');
    p.textContent = desc.textContent.trim();
    introCell.append(p);
  }
  cells.push([introCell]);

  const serviceItems = servicesEl.querySelectorAll('.grid-item:not(.grid-item--seventy):not(.grid-item--thirty)');
  serviceItems.forEach((item) => {
    const img = item.querySelector('img');
    const title = item.querySelector('h2, h3, h4, h5');
    const descPs = Array.from(item.querySelectorAll('p')).filter(
      (p) => !p.querySelector('a') && p.textContent.trim()
    );
    const links = Array.from(item.querySelectorAll('a')).filter(
      (a) => a.textContent.trim()
    );

    const iconCell = document.createElement('div');
    if (img) iconCell.append(img);

    const bodyCell = document.createElement('div');
    if (title) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      p.append(strong);
      bodyCell.append(p);
    }
    descPs.forEach((dp) => {
      const p = document.createElement('p');
      p.textContent = dp.textContent.trim();
      bodyCell.append(p);
    });
    links.forEach((link) => {
      const a = document.createElement('a');
      a.href = link.getAttribute('href') || '';
      a.textContent = link.textContent.trim();
      const p = document.createElement('p');
      p.append(a);
      bodyCell.append(p);
    });

    cells.push([iconCell, bodyCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'service-grid', cells });
  element.replaceWith(block);
}
