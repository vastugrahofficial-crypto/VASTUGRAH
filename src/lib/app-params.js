// App URL parameter helpers
export function getAppParam(key, defaultValue = null) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key) ?? defaultValue;
}

export function setAppParams(params) {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([k, v]) => {
    if (v === null || v === undefined) {
      url.searchParams.delete(k);
    } else {
      url.searchParams.set(k, v);
    }
  });
  window.history.replaceState({}, '', url.toString());
}
