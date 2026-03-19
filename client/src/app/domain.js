function normalizeHost(value) {
  if (!value) return '';
  return String(value)
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/$/, '')
    .toLowerCase();
}

function hostWithoutPort(host) {
  return String(host || '').split(':')[0].toLowerCase();
}

const APP_HOST = normalizeHost(import.meta.env.VITE_APP_HOST);
const MARKETING_HOST = normalizeHost(import.meta.env.VITE_MARKETING_HOST);

function isCurrentHost(targetHost) {
  if (!targetHost) return false;

  const currentHost = String(window.location.host || '').toLowerCase();
  const currentHostname = String(window.location.hostname || '').toLowerCase();
  const normalizedTarget = normalizeHost(targetHost);

  return (
    currentHost === normalizedTarget ||
    currentHostname === normalizedTarget ||
    currentHostname === hostWithoutPort(normalizedTarget)
  );
}

export function isAppSubdomain() {
  return window.location.hostname.startsWith('app.') || isCurrentHost(APP_HOST);
}

export function getAppHostWithPort() {
  if (window.location.host.startsWith('app.')) return window.location.host;
  if (APP_HOST) return APP_HOST;
  return `app.${window.location.host}`;
}

export function getRootHostWithPort() {
  if (MARKETING_HOST) return MARKETING_HOST;
  return window.location.host.replace(/^app\./, '');
}

export function buildAppUrl(pathname = '/auth') {
  return `${window.location.protocol}//${getAppHostWithPort()}${pathname}`;
}

export function buildLandingUrl(pathname = '/') {
  return `${window.location.protocol}//${getRootHostWithPort()}${pathname}`;
}
