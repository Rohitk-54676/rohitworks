const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

let cachedData = null;
let cachedAt = 0;

const getCachedIntegrations = () => {
  if (!cachedData) {
    return null;
  }

  const isExpired =
    Date.now() - cachedAt >= CACHE_TTL_MS;

  if (isExpired) {
    cachedData = null;
    cachedAt = 0;

    return null;
  }

  return cachedData;
};

const setCachedIntegrations = (data) => {
  cachedData = data;
  cachedAt = Date.now();
};

const clearIntegrationsCache = () => {
  cachedData = null;
  cachedAt = 0;
};

export default {
  getCachedIntegrations,
  setCachedIntegrations,
  clearIntegrationsCache,
};