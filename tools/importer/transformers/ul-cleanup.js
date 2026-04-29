/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: UL.com site-wide cleanup.
 * Removes non-authorable content (header, footer, nav, widgets, consent, chat, Drupal chrome).
 * All selectors verified from captured DOM (migration-work/cleaned.html).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent overlay (blocks parsing) - found at #consent_wrap > #consent_blackbar > #truste-consent-track
    WebImporter.DOMUtils.remove(element, [
      '#consent_wrap',
    ]);

    // Remove accessibility widget overlays (blocks parsing) - found as <access-widget-ui class="notranslate">
    WebImporter.DOMUtils.remove(element, [
      'access-widget-ui',
    ]);

    // Remove accessibility screen-reader alert span - found as span.acsb-sr-alert.acsb-sr-only
    WebImporter.DOMUtils.remove(element, [
      '.acsb-sr-alert',
    ]);

    // Remove accessibility screen-reader-only link - found as a.acsb-sr-only
    WebImporter.DOMUtils.remove(element, [
      'a.acsb-sr-only',
    ]);

    // Remove Salesforce embedded messaging chat widget - found as div#embedded-messaging.embedded-messaging
    WebImporter.DOMUtils.remove(element, [
      '#embedded-messaging',
    ]);

    // Remove embedded messaging iframe - found as iframe.embeddedMessagingSiteContextFrame
    WebImporter.DOMUtils.remove(element, [
      '.embeddedMessagingSiteContextFrame',
    ]);

    // Remove accessibility trigger widget - found as div.acsb-trigger.acsb-widget
    WebImporter.DOMUtils.remove(element, [
      '.acsb-trigger',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove global header (non-authorable navigation) - found as header.global-header.loaded
    // and its fix container div.global-header--fix.auto-hide-header
    WebImporter.DOMUtils.remove(element, [
      'header.global-header',
      '.global-header--fix',
    ]);

    // Remove header regions - found as div.region.region-header-before and div.region.region-header-after
    WebImporter.DOMUtils.remove(element, [
      '.region-header-before',
      '.region-header-after',
    ]);

    // Remove WROT referrer block - found as div.wrot-link inside #block-wrotrefererblock
    WebImporter.DOMUtils.remove(element, [
      '.wrot-link',
    ]);

    // Remove footer (non-authorable) - found as footer.footer
    WebImporter.DOMUtils.remove(element, [
      'footer.footer',
    ]);

    // Remove bottom region containing consent - found as div.region.region-bottom
    WebImporter.DOMUtils.remove(element, [
      '.region-bottom',
    ]);

    // Remove skip-to-content link - found as a#skip-to-content.sr-only.sr-only-focusable
    WebImporter.DOMUtils.remove(element, [
      '#skip-to-content',
    ]);

    // Remove Drupal external link dialog - found as div#extlink_dialog
    WebImporter.DOMUtils.remove(element, [
      '#extlink_dialog',
    ]);

    // Remove AddToAny sharing widget - found as div#addtoany
    WebImporter.DOMUtils.remove(element, [
      '#addtoany',
    ]);

    // Remove Drupal live announce and modal regions
    // found as div#drupal-live-announce.visually-hidden and div#drupal-modal.ui-front
    WebImporter.DOMUtils.remove(element, [
      '#drupal-live-announce',
      '#drupal-modal',
    ]);

    // Remove stray iframes, noscript, and link elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'noscript',
      'link',
    ]);
  }
}
