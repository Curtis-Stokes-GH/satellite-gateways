import { Link, createBrowserRouter, useNavigate } from "react-router-dom";
import { gatewayLoader } from "./loaders/gateway-loader";
import { GatewayForm } from "./views/gateway/gateway-form";
import { GatewayItem } from "./views/gateway/gateway-item";
import { GatewayList } from "./views/gateway/gateway-list";

import { Outlet } from "react-router-dom";
import { AdminOptions } from "./views/admin-options/admin-options";
import { UserForm } from "./views/user/create-user";
import { useUserContext } from "./hooks/use-user-context";
import { fetchWithDefaults } from "./util/fetch-wrapper";
import { config } from "./config";

function Layout() {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();

  const logout = async () => {
    await fetchWithDefaults(`${config.backendBaseUrl}/logout`, { method: "POST" });
    setUser({ username: null, readonly: true });
    navigate("/");
  };

  return (
    <>
      {/* inconsistent styling, would address mostly in CSS */}
      <Link to="/">Go home</Link>
      <button onClick={logout}>Logout</button>
      {!user.readonly && <AdminOptions />}
      <Outlet />
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <GatewayList />,
      },
      {
        path: "/create-user",
        element: <UserForm />,
      },
      {
        path: "/create-gateway",
        element: <GatewayForm />,
      },
      {
        path: "/gateways/:id",
        loader: gatewayLoader,
        element: <GatewayItem />,
      },
      {
        path: "/gateways/:id/edit",
        loader: gatewayLoader,
        element: <GatewayForm />,
      },
    ],
  },
]);
