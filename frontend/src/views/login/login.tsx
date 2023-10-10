import { useState } from "react";
import { useForm } from "react-hook-form";
import { config } from "../../config";
import { fetchWithDefaults } from "../../util/fetch-wrapper";
import { useUserContext } from "../../hooks/use-user-context";

type LoginFormData = {
  username: string;
  password: string;
};

export function LoginPage() {
  /**
   * reviewer note: This uses https://react-hook-form.com/ which cuts down on boiler plate heavily.
   * It was also of course possible to do this manually using a pattern with useState with the
   * onChange and value attributes.
   */
  const [loginError, setLoginError] = useState<string | undefined>();
  const { setUser } = useUserContext();
  const { register, handleSubmit } = useForm<LoginFormData>();

  const onSubmit = async (loginData: LoginFormData) => {
    try {
      const response = await fetchWithDefaults(`${config.backendBaseUrl}/login`, {
        body: JSON.stringify(loginData),
        method: "POST",
      });
      const data = await response.json();

      // Could be more specific in the check here, keeping it simple
      if (data["non_field_errors"]) {
        setLoginError("Invalid username or password.");
      } else {
        setUser(data);
      }
    } catch (e: unknown) {
      // Again, could do better error handling here to make sure it is this concrete error case, omitted for simplicity
      setLoginError("Unexpected error occured. Please contact support at support@example.com.");
    }
  };

  return (
    <div className="login-page" data-testid="login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" {...register("username")} />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" {...register("password")} />
        {/* conditionally display login error if it occurs */}
        {loginError && <div className="alert">{loginError}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
