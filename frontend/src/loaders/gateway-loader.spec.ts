import * as FetchWrapper from "../util/fetch-wrapper";
import { config } from "../config";
import { gatewayLoader } from "./gateway-loader";
import { LoaderFunctionArgs } from "react-router";

describe("gatewayLoader", () => {
  let fetchWithDefaultsSpy: jest.SpyInstance<Promise<Response>>;
  const params = { id: "1" }; // sample id for the params

  beforeEach(() => {
    fetchWithDefaultsSpy = jest.spyOn(FetchWrapper, "fetchWithDefaults");
  });

  afterEach(() => {
    fetchWithDefaultsSpy.mockRestore();
  });

  it("loads gateway data successfully", async () => {
    const mockGatewayData = { id: 1, name: "Gateway A" };
    const mockResponse: Response = {
      json: () => Promise.resolve(mockGatewayData),
    } as Response;

    fetchWithDefaultsSpy.mockResolvedValue(mockResponse);
    const result = await gatewayLoader({ params } as unknown as LoaderFunctionArgs);
    // check the url matches the params
    expect(fetchWithDefaultsSpy).toHaveBeenCalledWith(`${config.backendBaseUrl}/gateways/1`);
    expect(result).toEqual({ gateway: mockGatewayData });
  });

  it("handles loading failure", async () => {
    const mockResponse = {
      json: () => Promise.reject("Not Found"),
    } as Response;
    fetchWithDefaultsSpy.mockResolvedValue(mockResponse);

    expect(
      async () => await gatewayLoader({ params } as unknown as LoaderFunctionArgs)
    ).rejects.toMatch("Not Found");
  });
});
