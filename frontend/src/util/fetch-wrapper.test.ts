import { optionsWithDefaults, fetchWithDefaults } from "./fetch-wrapper";

describe("fetch-wrapper tests", () => {
  describe("fetchWithDefaults", () => {
    let responseBody: { message: string };
    let fetchStatus: number;
    const url = "https://example.com/api";

    beforeEach(() => {
      responseBody = { message: "default" };
      fetchStatus = 200;
      globalThis.fetch = jest.fn().mockResolvedValue({
        status: fetchStatus,
        json: () => Promise.resolve(responseBody),
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it("should make a fetch request with default options", async () => {
      responseBody = { message: "Success" };
      fetchStatus = 200;

      const response = await fetchWithDefaults(url);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(responseBody);

      // verify that fetch was called with default options
      expect(globalThis.fetch).toHaveBeenCalledWith(url, optionsWithDefaults({}));
    });

    it("should allow overriding default options", async () => {
      const customOptions = {
        method: "POST",
        headers: {
          Authorization: "Bearer token",
        },
      };

      await fetchWithDefaults(url, customOptions);
      // verify that fetch was called with custom options merged with defaults
      expect(globalThis.fetch).toHaveBeenCalledWith(url, optionsWithDefaults(customOptions));
    });
  });

  describe("optionsWithDefaults", () => {
    it("should merge default options with provided options", () => {
      const providedOptions = {
        method: "POST",
        headers: {
          Authorization: "Bearer token",
        },
      };

      const mergedOptions = optionsWithDefaults(providedOptions);

      // verify that default options are merged with provided options
      expect(mergedOptions).toEqual({
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
      });
    });

    it("should not override provided headers with default headers", () => {
      const providedOptions = {
        headers: {
          Authorization: "Bearer token",
          "Custom-Header": "Custom Value",
        },
      };

      const mergedOptions = optionsWithDefaults(providedOptions);

      // verify that provided headers are preserved and not overridden
      expect(mergedOptions.headers).toEqual({
        "Content-Type": "application/json",
        Authorization: "Bearer token",
        "Custom-Header": "Custom Value",
      });
    });
  });
});
