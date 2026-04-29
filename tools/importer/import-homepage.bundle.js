var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const bgImage = element.querySelector("img.hero_img_offerings") || element.querySelector("picture img") || element.querySelector("img");
    const heading = element.querySelector(".content-container h1, .hero-content--background h1") || element.querySelector("h1") || element.querySelector("h2, h3");
    const description = element.querySelector("p.description") || element.querySelector(".content-container p, .hero-content--background p") || element.querySelector("p");
    const ctaLink = element.querySelector(".content-container a, .hero-content--background a") || element.querySelector("a[href]");
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    if (heading) {
      cells.push([heading]);
    }
    if (description) {
      cells.push([description]);
    }
    if (ctaLink) {
      cells.push([ctaLink]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse2(element, { document }) {
    const cells = [];
    const hasHalfGridItems = element.querySelector(".grid-item--half");
    const isServicesGrid = element.classList.contains("grid-item--seventy");
    const isSpotlightCards = element.classList.contains("spotlight--cards");
    const isRelatedContent = element.classList.contains("section--related-content");
    let cardItems = [];
    if (hasHalfGridItems) {
      cardItems = Array.from(element.querySelectorAll(".grid-item--half"));
    } else if (isServicesGrid) {
      cardItems = Array.from(element.querySelectorAll(".grid-item:not(.grid-item--seventy):not(.grid-item--thirty)"));
    } else if (isSpotlightCards) {
      cardItems = Array.from(element.querySelectorAll(".card--spotlight"));
    } else if (isRelatedContent) {
      cardItems = Array.from(element.querySelectorAll(".card--spotlight"));
    } else {
      cardItems = Array.from(
        element.querySelectorAll(".grid-item--half, .card--spotlight, .grid-item")
      );
    }
    cardItems.forEach((item) => {
      const image = item.querySelector("img");
      const title = item.querySelector("h2, h3, h4, h5");
      const descParagraphs = Array.from(item.querySelectorAll("p")).filter(
        (p) => !p.querySelector("a") && p.textContent.trim()
      );
      const ctaLinks = Array.from(item.querySelectorAll("a")).filter(
        (a) => a.textContent.trim()
      );
      const imageCell = document.createElement("div");
      if (image) imageCell.append(image);
      const bodyCell = document.createElement("div");
      if (title) {
        const h = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = title.textContent.trim();
        h.append(strong);
        bodyCell.append(h);
      }
      descParagraphs.forEach((p) => {
        const para = document.createElement("p");
        para.textContent = p.textContent.trim();
        bodyCell.append(para);
      });
      ctaLinks.forEach((link) => {
        const a = document.createElement("a");
        a.href = link.getAttribute("href") || "";
        a.textContent = link.textContent.trim();
        const p = document.createElement("p");
        p.append(a);
        bodyCell.append(p);
      });
      cells.push([imageCell, bodyCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse3(element, { document }) {
    const cells = [];
    const span7 = element.querySelector(".span-7-d");
    const span3 = element.querySelector(".span-3-d");
    if (span7 && span3) {
      const col1Content = [];
      const heading = span7.querySelector("h1, h2, h3, h4, h5, h6");
      if (heading) col1Content.push(heading);
      const span7Text = span7.querySelector("p");
      if (span7Text) col1Content.push(span7Text);
      const col2Content = [];
      const ctaLink = span3.querySelector("a");
      if (ctaLink) col2Content.push(ctaLink);
      const span3Text = span3.querySelector("p");
      if (span3Text && !ctaLink) col2Content.push(span3Text);
      cells.push(col1Content.length === 1 ? col1Content : col1Content);
      cells.push(col2Content.length === 1 ? col2Content : col2Content);
      const block2 = WebImporter.Blocks.createBlock(document, { name: "columns", cells: [cells] });
      element.replaceWith(block2);
      return;
    }
    const videoEmbed = element.querySelector(".wistia_embed, .wistia_responsive_padding, .paragraph--video");
    const sectionContent = element.querySelector(".section__content, .section__description");
    if (videoEmbed && sectionContent) {
      const col1Content = [];
      const videoSource = element.querySelector("video source[src]");
      const videoEl = element.querySelector("video[src]");
      const wistiaDiv = element.querySelector('.wistia_embed[class*="wistia_async_"]');
      if (videoSource) {
        const videoLink = document.createElement("a");
        videoLink.href = videoSource.getAttribute("src");
        videoLink.textContent = videoSource.getAttribute("src");
        col1Content.push(videoLink);
      } else if (wistiaDiv) {
        const classList = wistiaDiv.getAttribute("class") || "";
        const wistiaMatch = classList.match(/wistia_async_([a-z0-9]+)/);
        if (wistiaMatch) {
          const videoLink = document.createElement("a");
          videoLink.href = `https://fast.wistia.com/embed/medias/${wistiaMatch[1]}`;
          videoLink.textContent = videoLink.href;
          col1Content.push(videoLink);
        }
      } else if (videoEl) {
        const videoLink = document.createElement("a");
        videoLink.href = videoEl.getAttribute("src");
        videoLink.textContent = videoEl.getAttribute("src");
        col1Content.push(videoLink);
      }
      if (col1Content.length === 0) {
        const thumbnail = element.querySelector('.wistia_responsive_wrapper img[alt="Video Thumbnail"]');
        if (thumbnail) col1Content.push(thumbnail);
      }
      const col2Content = [];
      const editorContentHeading = sectionContent.querySelector(".editor-content h1, .editor-content h2, .editor-content h3, .editor-content h4");
      const fallbackHeading = sectionContent.querySelector("h1, h2, h3, h4, h5, h6");
      const textHeading = editorContentHeading || (fallbackHeading && fallbackHeading.textContent && fallbackHeading.textContent.trim() ? fallbackHeading : null);
      if (textHeading) col2Content.push(textHeading);
      const textParagraphs = sectionContent.querySelectorAll(".editor-content > p");
      textParagraphs.forEach((p) => {
        const text = p.textContent.trim();
        if (text && text !== "\xA0") col2Content.push(p);
      });
      if (col2Content.length <= 1) {
        const fallbackParagraphs = sectionContent.querySelectorAll("p");
        fallbackParagraphs.forEach((p) => {
          const text = p.textContent.trim();
          if (text && text !== "\xA0" && !col2Content.includes(p)) col2Content.push(p);
        });
      }
      cells.push(col1Content);
      cells.push(col2Content);
      const block2 = WebImporter.Blocks.createBlock(document, { name: "columns", cells: [cells] });
      element.replaceWith(block2);
      return;
    }
    const span4Columns = element.querySelectorAll(":scope > .span-4-d");
    if (span4Columns.length > 0) {
      const row = [];
      span4Columns.forEach((col) => {
        const colContent = [];
        const colHeading = col.querySelector("h1, h2, h3, h4, h5, h6");
        if (colHeading) colContent.push(colHeading);
        const paragraphs = col.querySelectorAll("p");
        paragraphs.forEach((p) => {
          const text = p.textContent.trim();
          if (text && text !== "\xA0") colContent.push(p);
        });
        const links = col.querySelectorAll("p > a");
        const standaloneLinks = col.querySelectorAll(":scope > a");
        standaloneLinks.forEach((link) => colContent.push(link));
        row.push(colContent);
      });
      const block2 = WebImporter.Blocks.createBlock(document, { name: "columns", cells: [row] });
      element.replaceWith(block2);
      return;
    }
    const directChildren = element.querySelectorAll(":scope > div:not(.offset-1):not(.hash-target)");
    if (directChildren.length > 0) {
      const row = [];
      directChildren.forEach((child) => {
        const colContent = [];
        const headings = child.querySelectorAll("h1, h2, h3, h4, h5, h6");
        headings.forEach((h) => colContent.push(h));
        const paragraphs = child.querySelectorAll("p");
        paragraphs.forEach((p) => {
          const text = p.textContent.trim();
          if (text && text !== "\xA0") colContent.push(p);
        });
        const links = child.querySelectorAll("a");
        links.forEach((link) => {
          if (!link.closest("p") || !colContent.includes(link.closest("p"))) {
            colContent.push(link);
          }
        });
        if (colContent.length > 0) row.push(colContent);
      });
      if (row.length > 0) {
        const block2 = WebImporter.Blocks.createBlock(document, { name: "columns", cells: [row] });
        element.replaceWith(block2);
        return;
      }
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells: [[element.innerHTML]] });
    element.replaceWith(block);
  }

  // tools/importer/parsers/service-grid.js
  function parse4(element, { document }) {
    const cells = [];
    const headingEl = element.querySelector(".grid-item--thirty");
    const servicesEl = element.querySelector(".grid-item--seventy");
    if (!headingEl || !servicesEl) return;
    const introCell = document.createElement("div");
    const h2 = headingEl.querySelector("h2");
    if (h2) {
      const heading = document.createElement("h2");
      heading.textContent = h2.textContent.trim();
      introCell.append(heading);
    }
    const desc = headingEl.querySelector("p");
    if (desc) {
      const p = document.createElement("p");
      p.textContent = desc.textContent.trim();
      introCell.append(p);
    }
    cells.push([introCell]);
    const serviceItems = servicesEl.querySelectorAll(".grid-item:not(.grid-item--seventy):not(.grid-item--thirty)");
    serviceItems.forEach((item) => {
      const img = item.querySelector("img");
      const title = item.querySelector("h2, h3, h4, h5");
      const descPs = Array.from(item.querySelectorAll("p")).filter(
        (p) => !p.querySelector("a") && p.textContent.trim()
      );
      const links = Array.from(item.querySelectorAll("a")).filter(
        (a) => a.textContent.trim()
      );
      const iconCell = document.createElement("div");
      if (img) iconCell.append(img);
      const bodyCell = document.createElement("div");
      if (title) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = title.textContent.trim();
        p.append(strong);
        bodyCell.append(p);
      }
      descPs.forEach((dp) => {
        const p = document.createElement("p");
        p.textContent = dp.textContent.trim();
        bodyCell.append(p);
      });
      links.forEach((link) => {
        const a = document.createElement("a");
        a.href = link.getAttribute("href") || "";
        a.textContent = link.textContent.trim();
        const p = document.createElement("p");
        p.append(a);
        bodyCell.append(p);
      });
      cells.push([iconCell, bodyCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "service-grid", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/video-text.js
  function parse5(element, { document }) {
    const cells = [];
    const videoSide = element.querySelector(".span-12.span-6-t, .span-6-t");
    const textSide = element.querySelector(".section__content, .section__description");
    const videoCell = document.createElement("div");
    const textCell = document.createElement("div");
    if (videoSide) {
      const wistiaDiv = element.querySelector('.wistia_embed[class*="wistia_async_"]');
      const videoSource = element.querySelector("video source[src]");
      const videoEl = element.querySelector("video[src]");
      let videoUrl = "";
      if (wistiaDiv) {
        const classList = wistiaDiv.getAttribute("class") || "";
        const match = classList.match(/wistia_async_([a-z0-9]+)/);
        if (match) videoUrl = "https://fast.wistia.net/embed/iframe/" + match[1];
      } else if (videoSource) {
        videoUrl = videoSource.getAttribute("src");
      } else if (videoEl) {
        videoUrl = videoEl.getAttribute("src");
      }
      if (videoUrl) {
        const a = document.createElement("a");
        a.href = videoUrl;
        a.textContent = videoUrl;
        videoCell.append(a);
      }
    }
    if (textSide) {
      const editorContent = textSide.querySelector(".editor-content");
      const source = editorContent || textSide;
      const headings = source.querySelectorAll("h1, h2, h3, h4");
      headings.forEach((h) => {
        if (h.textContent.trim()) {
          const heading = document.createElement("h2");
          heading.textContent = h.textContent.trim();
          textCell.append(heading);
        }
      });
      const paragraphs = source.querySelectorAll("p");
      paragraphs.forEach((p) => {
        const text = p.textContent.trim();
        if (text && text !== " ") {
          const para = document.createElement("p");
          para.textContent = text;
          textCell.append(para);
        }
      });
    }
    cells.push([videoCell, textCell]);
    const hr = document.createElement("hr");
    const block = WebImporter.Blocks.createBlock(document, { name: "video-text", cells });
    const sectionMeta = WebImporter.Blocks.createBlock(document, {
      name: "Section Metadata",
      cells: { style: "light-gray" }
    });
    const wrapper = document.createElement("div");
    wrapper.append(hr, block, sectionMeta);
    element.replaceWith(wrapper);
  }

  // tools/importer/parsers/spotlight-cards.js
  function parse6(element, { document }) {
    const cells = [];
    const cards = element.querySelectorAll(".card--spotlight");
    cards.forEach((card) => {
      const img = card.querySelector("img");
      const title = card.querySelector("h2, h3, h4, h5");
      const descPs = Array.from(card.querySelectorAll("p")).filter(
        (p) => !p.querySelector("a") && p.textContent.trim()
      );
      const ctaLink = card.querySelector("a");
      const iconCell = document.createElement("div");
      if (img) iconCell.append(img);
      const bodyCell = document.createElement("div");
      if (title) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = title.textContent.trim();
        p.append(strong);
        bodyCell.append(p);
      }
      descPs.forEach((dp) => {
        const p = document.createElement("p");
        p.textContent = dp.textContent.trim();
        bodyCell.append(p);
      });
      if (ctaLink) {
        const a = document.createElement("a");
        a.href = ctaLink.getAttribute("href") || "";
        a.textContent = ctaLink.textContent.trim();
        const p = document.createElement("p");
        p.append(a);
        bodyCell.append(p);
      }
      cells.push([iconCell, bodyCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "spotlight-cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/feature-cards.js
  function parse7(element, { document }) {
    const cells = [];
    const cards = element.querySelectorAll(".card--spotlight");
    cards.forEach((card) => {
      const img = card.querySelector(".image-container img, article img");
      const title = card.querySelector(".content-container h2, .content-container h3, .content-container h4, .content-container h5");
      const contentContainer = card.querySelector(".content-container");
      const descPs = contentContainer ? Array.from(contentContainer.querySelectorAll("p")).filter(
        (p) => !p.querySelector("a") && p.textContent.trim()
      ) : [];
      const ctaLinks = contentContainer ? Array.from(contentContainer.querySelectorAll("a")).filter(
        (a) => a.textContent.trim()
      ) : [];
      const imgCell = document.createElement("div");
      if (img) imgCell.append(img);
      const bodyCell = document.createElement("div");
      if (title) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = title.textContent.trim();
        p.append(strong);
        bodyCell.append(p);
      }
      descPs.forEach((dp) => {
        const p = document.createElement("p");
        p.textContent = dp.textContent.trim();
        bodyCell.append(p);
      });
      if (ctaLinks.length > 0) {
        const link = ctaLinks[ctaLinks.length - 1];
        const a = document.createElement("a");
        a.href = link.getAttribute("href") || "";
        a.textContent = link.textContent.trim();
        const p = document.createElement("p");
        p.append(a);
        bodyCell.append(p);
      }
      cells.push([imgCell, bodyCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "feature-cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/ul-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#consent_wrap"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "access-widget-ui"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".acsb-sr-alert"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "a.acsb-sr-only"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#embedded-messaging"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".embeddedMessagingSiteContextFrame"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".acsb-trigger"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.global-header",
        ".global-header--fix"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".region-header-before",
        ".region-header-after"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".wrot-link"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "footer.footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".region-bottom"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#skip-to-content"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#extlink_dialog"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#addtoany"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#drupal-live-announce",
        "#drupal-modal"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "noscript",
        "link"
      ]);
    }
  }

  // tools/importer/transformers/ul-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload.template.sections;
      if (!sections || !Array.isArray(sections) || sections.length < 2) {
        return;
      }
      const { document } = payload;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (!section.selector) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: {
              style: section.style
            }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero": parse,
    "cards": parse2,
    "columns": parse3,
    "service-grid": parse4,
    "video-text": parse5,
    "spotlight-cards": parse6,
    "feature-cards": parse7
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "UL.com homepage with hero banner, service offerings, industry solutions, news, and call-to-action sections",
    urls: [
      "https://www.ul.com/"
    ],
    blocks: [
      {
        name: "hero",
        instances: [
          "section.hero.hero--default"
        ]
      },
      {
        name: "service-grid",
        instances: [
          ".editor-template.flex-grid:has(.grid-item--thirty)"
        ]
      },
      {
        name: "spotlight-cards",
        instances: [
          ".spotlight--cards"
        ]
      },
      {
        name: "feature-cards",
        instances: [
          ".section--related-content"
        ]
      },
      {
        name: "cards",
        instances: [
          ".editor-template.flex-grid:has(.grid-item--half)"
        ]
      },
      {
        name: "video-text",
        instances: [
          "section.section--video--two-column"
        ]
      },
      {
        name: "columns",
        instances: [
          "section.section--bgcolor-light-gray .editor-template.row:has(.span-7-d)",
          "section.section--bgcolor-light-gray .editor-template.row:has(.span-4-d)"
        ]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero Banner",
        selector: "section.hero.hero--default",
        style: null,
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-2-innovation",
        name: "Future-proofed Innovation",
        selector: "#block-ul-com-theme-mainpagecontent > section:nth-child(1)",
        style: null,
        blocks: ["cards"],
        defaultContent: ["h2.text-align-center", "p.text-align-center"]
      },
      {
        id: "section-3-experts",
        name: "Experts CTA Banner",
        selector: "#block-ul-com-theme-mainpagecontent > section:nth-child(2)",
        style: "light-gray",
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-4-services",
        name: "Services Grid",
        selector: "#block-ul-com-theme-mainpagecontent > section:nth-child(3)",
        style: null,
        blocks: ["service-grid"],
        defaultContent: []
      },
      {
        id: "section-5-video",
        name: "Video and Text",
        selector: "#block-ul-com-theme-mainpagecontent > section:nth-child(4)",
        style: "light-gray",
        blocks: ["video-text"],
        defaultContent: []
      },
      {
        id: "section-6-certification",
        name: "Certification Information",
        selector: "#block-ul-com-theme-mainpagecontent > section:nth-child(5)",
        style: "light-gray",
        blocks: ["spotlight-cards"],
        defaultContent: ["h2"]
      },
      {
        id: "section-7-resources",
        name: "Customer Resources",
        selector: "#block-ul-com-theme-mainpagecontent > section:nth-child(6)",
        style: "light-gray",
        blocks: ["columns"],
        defaultContent: ["h2"]
      },
      {
        id: "section-8-inside-ul",
        name: "Inside UL Solutions",
        selector: "#block-ul-com-theme-mainpagecontent > section:nth-child(7)",
        style: null,
        blocks: ["feature-cards"],
        defaultContent: ["h2"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
