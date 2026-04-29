/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: UL.com section breaks and section metadata.
 * Inserts <hr> section breaks and Section Metadata blocks based on payload.template.sections.
 * Runs only in afterTransform. Processes sections in reverse order.
 * Selectors from page-templates.json, verified against captured DOM.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = payload.template.sections;
    if (!sections || !Array.isArray(sections) || sections.length < 2) {
      return;
    }

    const { document } = payload;

    // Process sections in reverse order to preserve DOM positions
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (!section.selector) continue;

      // Find the section element using the template selector
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Add Section Metadata block after the section element if it has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: {
            style: section.style,
          },
        });
        sectionEl.after(sectionMetadata);
      }

      // Insert <hr> before the section element if not the first section
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
