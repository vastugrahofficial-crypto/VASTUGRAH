// Store and retrieve the URL to return to after auth
const KEY = 'vastugrah_auth_return_to';

export function setAuthReturnTo(path) {
  if (path && path !== '/login' && path !== '/register') {
    sessionStorage.setItem(KEY, path);
  }
}

export function getAuthReturnTo(fallback = '/') {
  const stored = sessionStorage.getItem(KEY);
  if (stored) {
    sessionStorage.removeItem(KEY);
    return stored;
  }
  return fallback;
}

export function safeReturnTo(fallback = '/') {
  try {
    const params = new URLSearchParams(window.location.search);
    const target = params.get('returnTo');
    if (target && target.startsWith('/') && !target.startsWith('//')) {
      return target;
    }
  } catch (_) {}
  return getAuthReturnTo(fallback);
}

export default { setAuthReturnTo, getAuthReturnTo, safeReturnTo };
