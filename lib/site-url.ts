const LOCAL_URL = "http://localhost:3000";

function trimTrailingSlash(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function getConfiguredUrl() {
  const configured =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL;

  return configured ? trimTrailingSlash(configured) : null;
}

export function getBaseUrl(headers?: Headers) {
  if (headers) {
    const forwardedHost = headers.get("x-forwarded-host");
    const forwardedProto = headers.get("x-forwarded-proto") ?? "https";
    const host = headers.get("host");

    if (forwardedHost) {
      return `${forwardedProto}://${forwardedHost}`;
    }

    if (host) {
      const isLocalHost = host.startsWith("localhost") || host.startsWith("127.0.0.1");
      return `${isLocalHost ? "http" : "https"}://${host}`;
    }
  }

  const configuredUrl = getConfiguredUrl();
  if (configuredUrl) return configuredUrl;

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return LOCAL_URL;
}

export function getAuthCallbackUrl(headers?: Headers) {
  return `${getBaseUrl(headers)}/auth/callback`;
}
