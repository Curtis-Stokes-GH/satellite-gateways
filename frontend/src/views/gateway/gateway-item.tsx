import { useLoaderData, useNavigate } from "react-router-dom";
import { useUserContext } from "../../hooks/use-user-context";

export function GatewayItem() {
  const { user } = useUserContext();
  const { gateway } = useLoaderData() as { gateway: Required<GatewayDto> };
  const navigate = useNavigate();

  return (
    <div className="gateway-read-only">
      {!user.readonly && <button onClick={() => navigate("edit")}>Edit</button>}
      <div>
        <strong>Location Name:</strong>
        <span>{gateway.location_name}</span>
      </div>
      <div>
        <strong>Antenna Diameter:</strong>
        <span>{gateway.antenna_diameter} meters</span>
      </div>
      <div>
        <strong>Longitude:</strong>
        <span>{gateway.longitude}</span>
      </div>
      <div>
        <strong>Latitude:</strong>
        <span>{gateway.latitude}</span>
      </div>
    </div>
  );
}
