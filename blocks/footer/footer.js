import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');

  const sections = [...fragment.querySelectorAll(':scope > .section')];

  if (sections.length >= 2) {
    const navSection = document.createElement('div');
    navSection.className = 'footer-nav';
    const navInner = document.createElement('div');
    navInner.className = 'footer-nav-inner';

    const navWrappers = sections[0].querySelectorAll(':scope > .default-content-wrapper > div');
    if (navWrappers.length > 0) {
      navWrappers.forEach((w) => navInner.append(w));
    } else {
      const navDcw = sections[0].querySelector('.default-content-wrapper');
      if (navDcw) {
        while (navDcw.firstChild) navInner.append(navDcw.firstChild);
      } else {
        while (sections[0].firstChild) navInner.append(sections[0].firstChild);
      }
    }
    navSection.append(navInner);

    const bottomSection = document.createElement('div');
    bottomSection.className = 'footer-bottom';
    const bottomInner = document.createElement('div');
    bottomInner.className = 'footer-bottom-inner';

    const bottomWrappers = sections[1].querySelectorAll(':scope > .default-content-wrapper > div');
    if (bottomWrappers.length > 0) {
      bottomWrappers.forEach((w) => bottomInner.append(w));
    } else {
      const bottomDcw = sections[1].querySelector('.default-content-wrapper');
      if (bottomDcw) {
        while (bottomDcw.firstChild) bottomInner.append(bottomDcw.firstChild);
      } else {
        while (sections[1].firstChild) bottomInner.append(sections[1].firstChild);
      }
    }
    bottomSection.append(bottomInner);

    footer.append(navSection, bottomSection);
  } else {
    while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  }

  block.append(footer);
}
