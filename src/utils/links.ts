/** Classify CMS links without treating absolute n3xmar.space URLs as external. */
export function resolveSiteLink(input?: string) {
  const raw = input?.trim() ?? '';
  if (!raw) return { href: '', external: false, valid: false };
  if (/^mailto:/i.test(raw)) return { href: raw, external: true, valid: true };
  if (raw.startsWith('/') && !raw.startsWith('//')) {
    return { href: raw, external: false, valid: true };
  }
  if (!/^https?:\/\//i.test(raw)) return { href: '', external: false, valid: false };
  try {
    const url = new URL(raw);
    if (url.hostname === 'n3xmar.space' || url.hostname === 'www.n3xmar.space') {
      return { href: url.pathname + url.search + url.hash, external: false, valid: true };
    }
    return { href: raw, external: true, valid: true };
  } catch {
    return { href: '', external: false, valid: false };
  }
}
