/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards variant.
 * Base block: cards
 * Source: https://www.ul.com/
 * Generated: 2026-04-29T00:00:00Z
 *
 * Handles 4 card layout instances on UL.com homepage:
 * 1. Innovation cards (.editor-template.flex-grid with .grid-item--half) - image + h3 + desc + CTA
 * 2. Services grid (.grid-item--seventy) - icon + h3 + desc + link
 * 3. Certification spotlight (.spotlight--cards) - icon + h3/h4 + desc + CTA button
 * 4. Inside UL (.section--related-content) - image + h4 + desc + CTA button
 *
 * Target structure per library example (each card = 3 rows):
 *   Row 1: [image/icon]
 *   Row 2: [bold title]
 *   Row 3: [description text + link]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Determine which card layout pattern we are dealing with based on selectors
  // validated against source HTML and page-templates.json instances[]
  const hasHalfGridItems = element.querySelector('.grid-item--half');
  const isServicesGrid = element.classList.contains('grid-item--seventy');
  const isSpotlightCards = element.classList.contains('spotlight--cards');
  const isRelatedContent = element.classList.contains('section--related-content');

  let cardItems = [];

  if (hasHalfGridItems) {
    // Instance 1: Innovation cards - .editor-template.flex-grid:has(.grid-item--half)
    // Structure: .grid-item--half > .editor-template.flex-grid > .grid-item > .editor-template.row
    //   > .span-4-d (image) + .span-8-d (h3 + p + a)
    cardItems = Array.from(element.querySelectorAll('.grid-item--half'));
  } else if (isServicesGrid) {
    // Instance 2: Services grid - .grid-item--seventy
    // Contains nested .editor-template.flex-grid > .grid-item children
    cardItems = Array.from(element.querySelectorAll('.grid-item:not(.grid-item--seventy):not(.grid-item--thirty)'));
  } else if (isSpotlightCards) {
    // Instance 3: Certification spotlight - .spotlight--cards
    // Contains .card--spotlight children with icon + title + desc + button
    cardItems = Array.from(element.querySelectorAll('.card--spotlight'));
  } else if (isRelatedContent) {
    // Instance 4: Inside UL - .section--related-content
    // Contains .card--spotlight children with image + h4 + desc + button
    cardItems = Array.from(element.querySelectorAll('.card--spotlight'));
  } else {
    // Fallback for unexpected structures
    cardItems = Array.from(
      element.querySelectorAll('.grid-item--half, .card--spotlight, .grid-item')
    );
  }

  cardItems.forEach((item) => {
    // Extract image or icon - first img found in card item
    const image = item.querySelector('img');

    // Extract title heading - validated selectors from source: h3, h4, h2
    const title = item.querySelector('h2, h3, h4, h5');

    // Extract description - paragraphs that do not wrap a link (CTA paragraphs excluded)
    const descParagraphs = Array.from(item.querySelectorAll('p')).filter(
      (p) => !p.querySelector('a') && p.textContent.trim()
    );

    // Extract CTA links - anchor elements used as calls-to-action
    const ctaLinks = Array.from(item.querySelectorAll('a')).filter(
      (a) => a.textContent.trim()
    );

    // Build rows for this card following library example:
    // Row 1: image/icon
    if (image) {
      cells.push([image]);
    }

    // Row 2: title as bold text
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      cells.push([strong]);
    }

    // Row 3: description text + link(s)
    const contentCell = [];
    descParagraphs.forEach((p) => {
      const descP = document.createElement('p');
      descP.textContent = p.textContent.trim();
      contentCell.push(descP);
    });
    ctaLinks.forEach((link) => {
      const a = document.createElement('a');
      a.href = link.getAttribute('href') || '';
      a.textContent = link.textContent.trim();
      contentCell.push(a);
    });
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
