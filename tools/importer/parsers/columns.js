/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns variant.
 * Base block: columns
 * Source: https://www.ul.com/
 * Generated: 2026-04-29
 * All selectors validated against migration-work/block-context/columns/source.html and cleaned.html
 *
 * Handles three column layout patterns from UL.com:
 * 1. Experts CTA: .editor-template.row with .span-7-d (heading) + .span-3-d (CTA button)
 * 2. Video section: section.section--video--two-column with video left + text right
 * 3. Customer Resources: .editor-template.row with multiple .span-4-d children (title + desc + link each)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Pattern 1: Experts CTA — .editor-template.row with .span-7-d and .span-3-d
  const span7 = element.querySelector('.span-7-d');
  const span3 = element.querySelector('.span-3-d');
  if (span7 && span3) {
    const col1Content = [];
    const heading = span7.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) col1Content.push(heading);
    const span7Text = span7.querySelector('p');
    if (span7Text) col1Content.push(span7Text);

    const col2Content = [];
    const ctaLink = span3.querySelector('a');
    if (ctaLink) col2Content.push(ctaLink);
    const span3Text = span3.querySelector('p');
    if (span3Text && !ctaLink) col2Content.push(span3Text);

    cells.push(col1Content.length === 1 ? col1Content : col1Content);
    cells.push(col2Content.length === 1 ? col2Content : col2Content);

    const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells: [cells] });
    element.replaceWith(block);
    return;
  }

  // Pattern 2: Video section — section.section--video--two-column
  const videoEmbed = element.querySelector('.wistia_embed, .wistia_responsive_padding, .paragraph--video');
  const sectionContent = element.querySelector('.section__content, .section__description');
  if (videoEmbed && sectionContent) {
    // Extract video — prefer the video source URL for a clean link
    const col1Content = [];
    const videoSource = element.querySelector('video source[src]');
    const videoEl = element.querySelector('video[src]');
    const wistiaDiv = element.querySelector('.wistia_embed[class*="wistia_async_"]');

    if (videoSource) {
      const videoLink = document.createElement('a');
      videoLink.href = videoSource.getAttribute('src');
      videoLink.textContent = videoSource.getAttribute('src');
      col1Content.push(videoLink);
    } else if (wistiaDiv) {
      // Extract Wistia video ID from class like "wistia_async_1hlg5eyj20"
      const classList = wistiaDiv.getAttribute('class') || '';
      const wistiaMatch = classList.match(/wistia_async_([a-z0-9]+)/);
      if (wistiaMatch) {
        const videoLink = document.createElement('a');
        videoLink.href = `https://fast.wistia.com/embed/medias/${wistiaMatch[1]}`;
        videoLink.textContent = videoLink.href;
        col1Content.push(videoLink);
      }
    } else if (videoEl) {
      const videoLink = document.createElement('a');
      videoLink.href = videoEl.getAttribute('src');
      videoLink.textContent = videoEl.getAttribute('src');
      col1Content.push(videoLink);
    }

    // Fallback: use video thumbnail image if no video URL found
    if (col1Content.length === 0) {
      const thumbnail = element.querySelector('.wistia_responsive_wrapper img[alt="Video Thumbnail"]');
      if (thumbnail) col1Content.push(thumbnail);
    }

    // Extract text content from the right column
    const col2Content = [];
    // Prefer heading inside .editor-content (the .section__title h2 may be empty)
    const editorContentHeading = sectionContent.querySelector('.editor-content h1, .editor-content h2, .editor-content h3, .editor-content h4');
    const fallbackHeading = sectionContent.querySelector('h1, h2, h3, h4, h5, h6');
    const textHeading = editorContentHeading
      || (fallbackHeading && fallbackHeading.textContent && fallbackHeading.textContent.trim() ? fallbackHeading : null);
    if (textHeading) col2Content.push(textHeading);
    const textParagraphs = sectionContent.querySelectorAll('.editor-content > p');
    textParagraphs.forEach((p) => {
      const text = p.textContent.trim();
      if (text && text !== ' ') col2Content.push(p);
    });
    // Fallback: if no paragraphs found via .editor-content, try direct p children
    if (col2Content.length <= 1) {
      const fallbackParagraphs = sectionContent.querySelectorAll('p');
      fallbackParagraphs.forEach((p) => {
        const text = p.textContent.trim();
        if (text && text !== ' ' && !col2Content.includes(p)) col2Content.push(p);
      });
    }

    cells.push(col1Content);
    cells.push(col2Content);

    const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells: [cells] });
    element.replaceWith(block);
    return;
  }

  // Pattern 3: Multi-column with .span-4-d children (e.g. Customer Resources)
  const span4Columns = element.querySelectorAll(':scope > .span-4-d');
  if (span4Columns.length > 0) {
    const row = [];
    span4Columns.forEach((col) => {
      const colContent = [];
      const colHeading = col.querySelector('h1, h2, h3, h4, h5, h6');
      if (colHeading) colContent.push(colHeading);

      const paragraphs = col.querySelectorAll('p');
      paragraphs.forEach((p) => {
        const text = p.textContent.trim();
        // Skip empty paragraphs, include those with real text
        if (text && text !== ' ') colContent.push(p);
      });

      const links = col.querySelectorAll('p > a');
      // Links inside <p> are already included via the paragraph above,
      // but if there are standalone <a> elements outside <p>, grab them
      const standaloneLinks = col.querySelectorAll(':scope > a');
      standaloneLinks.forEach((link) => colContent.push(link));

      row.push(colContent);
    });

    const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells: [row] });
    element.replaceWith(block);
    return;
  }

  // Generic fallback: treat direct children as columns
  const directChildren = element.querySelectorAll(':scope > div:not(.offset-1):not(.hash-target)');
  if (directChildren.length > 0) {
    const row = [];
    directChildren.forEach((child) => {
      const colContent = [];
      const headings = child.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((h) => colContent.push(h));

      const paragraphs = child.querySelectorAll('p');
      paragraphs.forEach((p) => {
        const text = p.textContent.trim();
        if (text && text !== ' ') colContent.push(p);
      });

      const links = child.querySelectorAll('a');
      links.forEach((link) => {
        // Avoid duplicating links already inside paragraphs
        if (!link.closest('p') || !colContent.includes(link.closest('p'))) {
          colContent.push(link);
        }
      });

      if (colContent.length > 0) row.push(colContent);
    });

    if (row.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells: [row] });
      element.replaceWith(block);
      return;
    }
  }

  // Last resort: just wrap the element content as a single column
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells: [[element.innerHTML]] });
  element.replaceWith(block);
}
