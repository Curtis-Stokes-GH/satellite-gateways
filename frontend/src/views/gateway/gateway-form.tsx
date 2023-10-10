import { useForm } from "react-hook-form";
import { useUserContext } from "../../hooks/use-user-context";
import { fetchWithDefaults } from "../../util/fetch-wrapper";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { config } from "../../config";
import { CompanyList } from "../../components/company-list";

export function GatewayForm() {
  const URL_BASE = `${config.backendBaseUrl}/gateways`;
  const loaderData = useLoaderData() as { gateway: Required<GatewayDto> } | undefined;
  const existingGateway = loaderData?.gateway;
  const { register, handleSubmit } = useForm<Omit<GatewayDto, "id">>({
    defaultValues: loaderData?.gateway,
  });
  const { user } = useUserContext();
  const [companyId, setCompanyId] = useState<number | null>(loaderData?.gateway.company ?? null);
  const [error, setError] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't allow read only users in. Could do this at a more global level but keeping it simple
    if (user.readonly) {
      navigate("/");
    }
  }, [user, navigate]);

  const onSubmit = async (gateway: GatewayDto) => {
    try {
      const isNewGateway = !existingGateway;
      const endpoint = isNewGateway ? URL_BASE : `${URL_BASE}/${existingGateway.id}`;

      const method = isNewGateway ? "POST" : "PUT";

      const body = JSON.stringify({
        ...(isNewGateway ? {} : existingGateway), // Only include existingGateway if it's not a new gateway
        ...gateway,
        company: companyId,
      });

      const response = await fetchWithDefaults(endpoint, {
        method,
        body,
      });

      if (!response.ok) {
        throw new Error(
          `Could not ${isNewGateway ? "create" : "update"} gateway: ${await response.text()}`
        );
      }

      const responseData = isNewGateway ? await response.json() : existingGateway;
      const id = responseData.id;

      navigate(`/gateways/${id}`);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  };

  const deleteGateway = async () => {
    if (!existingGateway) {
      throw Error("Attempting to delete a non existent gateway somehow");
    }
    await fetchWithDefaults(`${URL_BASE}/${existingGateway.id}`, {
      method: "DELETE",
    });
    navigate(`/`);
  };

  return (
    <>
      {existingGateway && <button onClick={deleteGateway}>Delete</button>}
      <CompanyList onCompanyUpdated={setCompanyId} selectedId={companyId}></CompanyList>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="location_name">Location name:</label>
        <input type="text" id="location_name" required {...register("location_name")} />
        <label htmlFor="antenna_diameter">Antenna diameter:</label>
        <input
          type="number"
          step="0.001"
          id="antenna_diameter"
          required
          {...register("antenna_diameter")}
        />
        <span>m</span>
        <label htmlFor="longitude">Longitude:</label>
        <input type="number" step="0.000001" id="longitude" required {...register("longitude")} />
        <label htmlFor="latitude">Latitude:</label>
        <input type="number" step="0.000001" id="latitude" required {...register("latitude")} />
        <button type="submit">{existingGateway ? "Save" : "Create"}</button>
      </form>
      {<p data-testid="error">{error}</p>}
    </>
  );
}
