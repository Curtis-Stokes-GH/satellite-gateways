import { LoaderFunction } from "react-router-dom";
import { fetchWithDefaults } from "../util/fetch-wrapper";
import { config } from "../config";

export const gatewayLoader: LoaderFunction<GatewayDto> = async ({ params }) => {
  const response = await fetchWithDefaults(`${config.backendBaseUrl}/gateways/${params.id}`);
  const gateway = await response.json();
  return { gateway };
};
