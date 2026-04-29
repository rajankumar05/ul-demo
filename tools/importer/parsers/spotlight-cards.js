/* eslint-disable */
/* global WebImporter */

/**
 * Parser for spotlight-cards block.
 * Handles the "Can we help you find certification information?" section.
 * Each card: icon (80x80) | title + description + CTA button
 */
export default function parse(element, { document }) {
  const cells = [];

  const cards = element.querySelectorAll('.card--spotlight');

  cards.forEach((card) => {
    const img = card.querySelector('img');
    const title = card.querySelector('h2, h3, h4, h5');
    const descPs = Array.from(card.querySelectorAll('p')).filter(
      (p) => !p.querySelector('a') && p.textContent.trim()
    );
    const ctaLink = card.querySelector('a');

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
    if (ctaLink) {
      const a = document.createElement('a');
      a.href = ctaLink.getAttribute('href') || '';
      a.textContent = ctaLink.textContent.trim();
      const p = document.createElement('p');
      p.append(a);
      bodyCell.append(p);
    }

    cells.push([iconCell, bodyCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'spotlight-cards', cells });
  element.replaceWith(block);
}
