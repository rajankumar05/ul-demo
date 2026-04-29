/* eslint-disable */
/* global WebImporter */

/**
 * Parser for video-text block.
 * Outputs: <hr> (section break) + video-text block + section-metadata(light-gray)
 */
export default function parse(element, { document }) {
  const cells = [];

  const videoSide = element.querySelector('.span-12.span-6-t, .span-6-t');
  const textSide = element.querySelector('.section__content, .section__description');

  const videoCell = document.createElement('div');
  const textCell = document.createElement('div');

  if (videoSide) {
    const wistiaDiv = element.querySelector('.wistia_embed[class*="wistia_async_"]');
    const videoSource = element.querySelector('video source[src]');
    const videoEl = element.querySelector('video[src]');

    let videoUrl = '';
    if (wistiaDiv) {
      const classList = wistiaDiv.getAttribute('class') || '';
      const match = classList.match(/wistia_async_([a-z0-9]+)/);
      if (match) videoUrl = 'https://fast.wistia.net/embed/iframe/' + match[1];
    } else if (videoSource) {
      videoUrl = videoSource.getAttribute('src');
    } else if (videoEl) {
      videoUrl = videoEl.getAttribute('src');
    }

    if (videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.textContent = videoUrl;
      videoCell.append(a);
    }
  }

  if (textSide) {
    const editorContent = textSide.querySelector('.editor-content');
    const source = editorContent || textSide;

    const headings = source.querySelectorAll('h1, h2, h3, h4');
    headings.forEach((h) => {
      if (h.textContent.trim()) {
        const heading = document.createElement('h2');
        heading.textContent = h.textContent.trim();
        textCell.append(heading);
      }
    });

    const paragraphs = source.querySelectorAll('p');
    paragraphs.forEach((p) => {
      const text = p.textContent.trim();
      if (text && text !== ' ') {
        const para = document.createElement('p');
        para.textContent = text;
        textCell.append(para);
      }
    });
  }

  cells.push([videoCell, textCell]);

  const hr = document.createElement('hr');
  const block = WebImporter.Blocks.createBlock(document, { name: 'video-text', cells });
  const sectionMeta = WebImporter.Blocks.createBlock(document, {
    name: 'Section Metadata',
    cells: { style: 'light-gray' },
  });

  const wrapper = document.createElement('div');
  wrapper.append(hr, block, sectionMeta);
  element.replaceWith(wrapper);
}
