import { useFetch } from "./use-fetch";
import { renderHook, waitFor } from "@testing-library/react";
import * as FetchWrapper from "../util/fetch-wrapper";

describe("useFetch custom hook", () => {
  let fetchSpy: jest.SpyInstance<Promise<Response>>;
  const mockResponseData = { message: "example-response" };
  const url = "/api/data";

  beforeEach(() => {
    jest.resetAllMocks();
    const mockResponse: Response = {
      json: () => Promise.resolve(mockResponseData),
    } as Response;
    fetchSpy = jest.spyOn(FetchWrapper, "fetchWithDefaults").mockResolvedValue(mockResponse);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should fetch data and return response", async () => {
    const options = { cache: "default" as RequestCache };
    const { result } = renderHook(() => useFetch(url, options));

    // check we start as null
    expect(result.current.response).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      // then that fetch is called and the data is stored
      expect(fetchSpy).toHaveBeenCalledWith(url, options);
      expect(result.current.response).toEqual(mockResponseData);
      expect(result.current.error).toBeNull();
    });
  });

  it("should handle fetch error and return error", async () => {
    4;
    fetchSpy.mockRejectedValueOnce(new Error("Fetch error"));
    const { result } = renderHook(() => useFetch(url));

    await waitFor(() => {
      expect(result.current.error).toEqual(new Error("Fetch error"));
    });
  });
});
