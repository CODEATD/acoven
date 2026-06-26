export function buildShareUrl(id: string): string {
  return `${window.location.origin}${window.location.pathname}?id=${id}`;
}

export function parseIdFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get('id');
}
