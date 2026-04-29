/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards variant.
 * Outputs one row per card with 2 cells: [image, body]
 * EDS cards.js then creates: li > .cards-card-image + .cards-card-body
 */
export default function parse(element, { document }) {
  const cells = [];

  const hasHalfGridItems = element.querySelector('.grid-item--half');
  const isServicesGrid = element.classList.contains('grid-item--seventy');
  const isSpotlightCards = element.classList.contains('spotlight--cards');
  const isRelatedContent = element.classList.contains('section--related-content');

  let cardItems = [];

  if (hasHalfGridItems) {
    cardItems = Array.from(element.querySelectorAll('.grid-item--half'));
  } else if (isServicesGrid) {
    cardItems = Array.from(element.querySelectorAll('.grid-item:not(.grid-item--seventy):not(.grid-item--thirty)'));
  } else if (isSpotlightCards) {
    cardItems = Array.from(element.querySelectorAll('.card--spotlight'));
  } else if (isRelatedContent) {
    cardItems = Array.from(element.querySelectorAll('.card--spotlight'));
  } else {
    cardItems = Array.from(
      element.querySelectorAll('.grid-item--half, .card--spotlight, .grid-item')
    );
  }

  cardItems.forEach((item) => {
    const image = item.querySelector('img');
    const title = item.querySelector('h2, h3, h4, h5');
    const descParagraphs = Array.from(item.querySelectorAll('p')).filter(
      (p) => !p.querySelector('a') && p.textContent.trim()
    );
    const ctaLinks = Array.from(item.querySelectorAll('a')).filter(
      (a) => a.textContent.trim()
    );

    const imageCell = document.createElement('div');
    if (image) imageCell.append(image);

    const bodyCell = document.createElement('div');
    if (title) {
      const h = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      h.append(strong);
      bodyCell.append(h);
    }
    descParagraphs.forEach((p) => {
      const para = document.createElement('p');
      para.textContent = p.textContent.trim();
      bodyCell.append(para);
    });
    ctaLinks.forEach((link) => {
      const a = document.createElement('a');
      a.href = link.getAttribute('href') || '';
      a.textContent = link.textContent.trim();
      const p = document.createElement('p');
      p.append(a);
      bodyCell.append(p);
    });

    cells.push([imageCell, bodyCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
