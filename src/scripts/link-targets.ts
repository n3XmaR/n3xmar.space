// Use one navigation policy, including links rendered from Markdown.
function applyLinkTargets() {
  for (const link of document.querySelectorAll<HTMLAnchorElement>('a[href]')) {
    const href = link.getAttribute('href')?.trim() ?? '';
    if (!href || href.startsWith('#')) continue;
    if (/^mailto:/i.test(href)) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      continue;
    }
    let destination: URL;
    try { destination = new URL(href, window.location.href); }
    catch { continue; }
    if (destination.protocol !== 'https:' && destination.protocol !== 'http:') continue;
    const internal = destination.origin === window.location.origin ||
      destination.hostname === 'n3xmar.space' ||
      destination.hostname === 'www.n3xmar.space';
    if (internal) {
      if (destination.origin !== window.location.origin)
        link.href = destination.pathname + destination.search + destination.hash;
      link.removeAttribute('target');
      if (link.rel === 'noopener noreferrer') link.removeAttribute('rel');
    } else {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyLinkTargets, { once: true });
} else {
  applyLinkTargets();
}
