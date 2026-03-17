export function isAppSubdomain() {
  return window.location.hostname.startsWith('app.');
}

export function getAppHostWithPort() {
  if (window.location.host.startsWith('app.')) return window.location.host;
  return `app.${window.location.host}`;
}

export function getRootHostWithPort() {
  return window.location.host.replace(/^app\./, '');
}

export function buildAppUrl(pathname = '/auth') {
  return `${window.location.protocol}//${getAppHostWithPort()}${pathname}`;
}

export function buildLandingUrl(pathname = '/') {
  return `${window.location.protocol}//${getRootHostWithPort()}${pathname}`;
}
