import Cookie from "js-cookie";

/**
 * Merges both headers and options with some defaults for the application. All options can be overriden explicitly
 * @param options Fetch options
 * @returns Fetch options with defaults for this application
 */
export const optionsWithDefaults = (options: RequestInit): RequestInit => {
  const defaultOptions: RequestInit = {
    credentials: "include", // Make sure the credentials are included for session auth
  };

  const headers: RequestInit["headers"] = {
    "Content-Type": "application/json",
  };

  const csrfToken = Cookie.get("csrftoken");
  if (csrfToken) {
    headers["X-CSRFToken"] = csrfToken;
  }

  return {
    ...defaultOptions,
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };
};

/**
 *
 * @param url
 * @param options
 * @returns
 */
export const fetchWithDefaults = async (url: string, options: RequestInit = {}) => {
  return await fetch(url, optionsWithDefaults(options));
};
