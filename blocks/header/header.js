import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

function createStickyCta(navWrapper) {
  const stickyBar = document.createElement('div');
  stickyBar.className = 'sticky-cta-bar';

  const inner = document.createElement('div');
  inner.className = 'sticky-cta-inner';

  const title = document.createElement('h3');
  title.className = 'sticky-cta-title';
  title.textContent = document.title.split('|')[0].trim() || 'UL Solutions';

  const btnWrap = document.createElement('div');
  btnWrap.className = 'sticky-cta-button';

  const heroLink = document.querySelector('.hero a');
  if (heroLink) {
    const ctaBtn = document.createElement('a');
    ctaBtn.href = heroLink.href;
    ctaBtn.textContent = heroLink.textContent;
    ctaBtn.className = 'sticky-cta-link';
    btnWrap.append(ctaBtn);
  }

  inner.append(title, btnWrap);
  stickyBar.append(inner);
  navWrapper.after(stickyBar);

  return stickyBar;
}

function initAutoHideHeader(navWrapper) {
  let previousTop = 0;
  let scrolling = false;
  const headerHeight = 61;
  const scrollOffset = 150;
  let stickyBar = null;

  function getThreshold() {
    const hero = document.querySelector('.hero');
    if (hero) return hero.offsetTop + hero.offsetHeight - headerHeight;
    return 300;
  }

  function onScroll() {
    if (scrolling) return;
    scrolling = true;

    requestAnimationFrame(() => {
      const currentTop = window.scrollY;
      const threshold = getThreshold();
      const scrollingDown = currentTop > previousTop;

      if (!stickyBar) {
        stickyBar = navWrapper.parentElement.querySelector('.sticky-cta-bar');
      }

      if (currentTop > threshold) {
        if (scrollingDown && currentTop > threshold + scrollOffset) {
          navWrapper.classList.add('is-hidden');
          if (stickyBar) {
            stickyBar.classList.add('fixed');
            stickyBar.classList.add('slide-up');
          }
        } else {
          navWrapper.classList.remove('is-hidden');
          if (stickyBar) {
            stickyBar.classList.add('fixed');
            stickyBar.classList.remove('slide-up');
          }
        }
      } else {
        navWrapper.classList.remove('is-hidden');
        if (stickyBar) {
          stickyBar.classList.remove('fixed');
          stickyBar.classList.remove('slide-up');
        }
      }

      previousTop = currentTop;
      scrolling = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll('.button').forEach((button) => {
      button.className = '';
      const buttonContainer = button.closest('.button-container');
      if (buttonContainer) buttonContainer.className = '';
    });

    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  createStickyCta(navWrapper);
  initAutoHideHeader(navWrapper);
}
