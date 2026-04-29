/* eslint-disable */
/* global WebImporter */

/**
 * Parser for feature-cards block.
 * Handles "Inside UL Solutions" section — 4 vertical cards with image + title + desc + CTA link.
 * Each card: image | title + description + CTA link
 */
export default function parse(element, { document }) {
  const cells = [];

  const cards = element.querySelectorAll('.card--spotlight');

  cards.forEach((card) => {
    const img = card.querySelector('.image-container img, article img');
    const title = card.querySelector('.content-container h2, .content-container h3, .content-container h4, .content-container h5');
    const contentContainer = card.querySelector('.content-container');
    const descPs = contentContainer
      ? Array.from(contentContainer.querySelectorAll('p')).filter(
          (p) => !p.querySelector('a') && p.textContent.trim()
        )
      : [];

    const ctaLinks = contentContainer
      ? Array.from(contentContainer.querySelectorAll('a')).filter(
          (a) => a.textContent.trim()
        )
      : [];

    const imgCell = document.createElement('div');
    if (img) imgCell.append(img);

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
    if (ctaLinks.length > 0) {
      const link = ctaLinks[ctaLinks.length - 1];
      const a = document.createElement('a');
      a.href = link.getAttribute('href') || '';
      a.textContent = link.textContent.trim();
      const p = document.createElement('p');
      p.append(a);
      bodyCell.append(p);
    }

    cells.push([imgCell, bodyCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'feature-cards', cells });
  element.replaceWith(block);
}
