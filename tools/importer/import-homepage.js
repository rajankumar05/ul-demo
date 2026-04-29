/* eslint-disable */
/* global WebImporter */

import heroParser from './parsers/hero.js';
import cardsParser from './parsers/cards.js';
import columnsParser from './parsers/columns.js';
import serviceGridParser from './parsers/service-grid.js';

import ulCleanupTransformer from './transformers/ul-cleanup.js';
import ulSectionsTransformer from './transformers/ul-sections.js';

const parsers = {
  'hero': heroParser,
  'cards': cardsParser,
  'columns': columnsParser,
  'service-grid': serviceGridParser,
};

const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'UL.com homepage with hero banner, service offerings, industry solutions, news, and call-to-action sections',
  urls: [
    'https://www.ul.com/'
  ],
  blocks: [
    {
      name: 'hero',
      instances: [
        'section.hero.hero--default'
      ]
    },
    {
      name: 'service-grid',
      instances: [
        '.editor-template.flex-grid:has(.grid-item--thirty)'
      ]
    },
    {
      name: 'cards',
      instances: [
        '.editor-template.flex-grid:has(.grid-item--half)',
        '.spotlight--cards',
        '.section--related-content'
      ]
    },
    {
      name: 'columns',
      instances: [
        'section.section--bgcolor-light-gray .editor-template.row:has(.span-7-d)',
        'section.section--video--two-column',
        'section.section--bgcolor-light-gray .editor-template.row:has(.span-4-d)'
      ]
    }
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero Banner',
      selector: 'section.hero.hero--default',
      style: null,
      blocks: ['hero'],
      defaultContent: []
    },
    {
      id: 'section-2-innovation',
      name: 'Future-proofed Innovation',
      selector: '#block-ul-com-theme-mainpagecontent > section:nth-child(1)',
      style: null,
      blocks: ['cards'],
      defaultContent: ['h2.text-align-center', 'p.text-align-center']
    },
    {
      id: 'section-3-experts',
      name: 'Experts CTA Banner',
      selector: '#block-ul-com-theme-mainpagecontent > section:nth-child(2)',
      style: 'light-gray',
      blocks: ['columns'],
      defaultContent: []
    },
    {
      id: 'section-4-services',
      name: 'Services Grid',
      selector: '#block-ul-com-theme-mainpagecontent > section:nth-child(3)',
      style: null,
      blocks: ['service-grid'],
      defaultContent: []
    },
    {
      id: 'section-5-video',
      name: 'Video and Text',
      selector: '#block-ul-com-theme-mainpagecontent > section:nth-child(4)',
      style: 'light-gray',
      blocks: ['columns'],
      defaultContent: []
    },
    {
      id: 'section-6-certification',
      name: 'Certification Information',
      selector: '#block-ul-com-theme-mainpagecontent > section:nth-child(5)',
      style: 'light-gray',
      blocks: ['cards'],
      defaultContent: ['h2']
    },
    {
      id: 'section-7-resources',
      name: 'Customer Resources',
      selector: '#block-ul-com-theme-mainpagecontent > section:nth-child(6)',
      style: 'light-gray',
      blocks: ['columns'],
      defaultContent: ['h2']
    },
    {
      id: 'section-8-inside-ul',
      name: 'Inside UL Solutions',
      selector: '#block-ul-com-theme-mainpagecontent > section:nth-child(7)',
      style: null,
      blocks: ['cards'],
      defaultContent: ['h2']
    }
  ]
};

const transformers = [
  ulCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [ulSectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((el) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element: el,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
