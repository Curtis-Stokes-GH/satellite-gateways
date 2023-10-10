import { useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/use-fetch";
import { config } from "../../config";
export function GatewayList() {
  const navigate = useNavigate();
  const { response: gateways, error } = useFetch<GatewayDto[]>(`${config.backendBaseUrl}/gateways`);
  if (error) {
    return <p>Error loading gateways</p>;
  }

  if (!gateways) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h2>Gateways</h2>
      <div className="gateway-list">
        {gateways.map((gateway) => (
          <div
            onClick={() => navigate(`/gateways/${gateway.id}`)}
            className="gateway-card"
            key={gateway.id}
          >
            <h2>{gateway.location_name}</h2>
            <dl>
              <dt>Antenna Diameter</dt>
              <dd>{gateway.antenna_diameter}m</dd>
              <dt>Longitude</dt>
              <dd>{gateway.longitude}</dd>
              <dt>Latitude</dt>
              <dd>{gateway.latitude}</dd>
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}
