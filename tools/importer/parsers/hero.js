/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero variant.
 * Base block: hero
 * Source: https://www.ul.com/
 * Selector: section.hero.hero--default
 * Generated: 2026-04-29
 * Validated: selectors verified against source.html via jsdom (live validation unavailable due to networkidle timeout)
 *
 * Source structure:
 *   section.hero.hero--default
 *     > .swiper-container > .swiper-wrapper > .hero--default-slide > .wrapper
 *       > div > picture > img.hero_img_offerings  (background image)
 *       > div.content-container.hero-content--background
 *         > h1                                     (heading)
 *         > p.description                          (description)
 *         > a                                      (CTA link)
 *
 * Target table (from library-example.md):
 *   | Hero |
 *   | ![image](hero.png) |
 *   | # Heading |
 *   | Description text |
 *   | [CTA Link](url) |
 */
export default function parse(element, { document }) {
  // Extract background image from hero slide
  // Primary: img.hero_img_offerings; Fallback: any img inside picture
  const bgImage = element.querySelector('img.hero_img_offerings')
    || element.querySelector('picture img')
    || element.querySelector('img');

  // Extract heading - primary h1, fallback to h2/h3
  const heading = element.querySelector('.content-container h1, .hero-content--background h1')
    || element.querySelector('h1')
    || element.querySelector('h2, h3');

  // Extract description paragraph
  const description = element.querySelector('p.description')
    || element.querySelector('.content-container p, .hero-content--background p')
    || element.querySelector('p');

  // Extract CTA link(s)
  const ctaLink = element.querySelector('.content-container a, .hero-content--background a')
    || element.querySelector('a[href]');

  // Build cells array matching the block library example structure:
  // Row 1: background image
  // Row 2: heading
  // Row 3: description
  // Row 4: CTA link
  const cells = [];

  // Row 1: background image (optional - only add if present)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: heading
  if (heading) {
    cells.push([heading]);
  }

  // Row 3: description text
  if (description) {
    cells.push([description]);
  }

  // Row 4: CTA link
  if (ctaLink) {
    cells.push([ctaLink]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
