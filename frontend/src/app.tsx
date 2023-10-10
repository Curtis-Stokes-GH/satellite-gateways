import { useEffect, useMemo } from "react";
import { LoginPage } from "./views/login/login";
import { useUserContext } from "./hooks/use-user-context.ts";
import { config } from "./config.ts";
import { fetchWithDefaults } from "./util/fetch-wrapper.ts";
import "./app.css";
import { RouterProvider } from "react-router";
import { router } from "./router.tsx";

export function App() {
  const { user, setUser } = useUserContext();
  const checkSession = useMemo(
    () => async () => {
      if (user.username === "") {
        const response = await fetchWithDefaults(`${config.backendBaseUrl}/session`);
        const data = await response.json();
        if (data) {
          setUser(data);
        }
      }
    },
    [user.username, setUser]
  );

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Simple router setup, if no user is set show login page which sets user on login
  return user.username ? <RouterProvider router={router} /> : <LoginPage />;
}
