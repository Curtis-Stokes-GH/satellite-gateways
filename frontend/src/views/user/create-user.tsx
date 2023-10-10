import { useForm } from "react-hook-form";
import { useUserContext } from "../../hooks/use-user-context";
import { fetchWithDefaults } from "../../util/fetch-wrapper";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { config } from "../../config";
import { CompanyList } from "../../components/company-list";

type CreateUserForm = Omit<UserDto, "id"> & { password: string };
export function UserForm() {
  const { register, handleSubmit, watch, getValues } = useForm<CreateUserForm>();
  // re-render when this field changes due to dynamic form.
  watch("is_superuser");
  const { user: sessionUser } = useUserContext();
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [error, setError] = useState<unknown>();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't allow read only users in
    if (sessionUser.readonly) {
      navigate("/");
    }
  }, [sessionUser, navigate]);

  const onSubmit = async (user: CreateUserForm) => {
    try {
      const body = {
        ...user,
      };

      if (!user.is_superuser) {
        body.company = companyId;
      }

      const response = await fetchWithDefaults(`${config.backendBaseUrl}/register`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Could not create user: ${await response.text()}`);
      }

      navigate(`/`);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  };

  return (
    <>
      {
        // Super users are not associated with a company, remove element to prevent confusion
        !getValues("is_superuser") && (
          <CompanyList onCompanyUpdated={setCompanyId} selectedId={companyId}></CompanyList>
        )
      }
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" required {...register("username")} />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" required {...register("password")} />
        <label htmlFor="is_superuser">Admin rights:</label>
        <input type="checkbox" {...register("is_superuser")} />
        <button type="submit">Create</button>
      </form>
      {error}
    </>
  );
}
