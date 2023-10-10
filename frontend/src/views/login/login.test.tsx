import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserContextProvider } from "../../contexts/user-context";
import userEvent from "@testing-library/user-event";
import * as UseUserContext from "../../hooks/use-user-context";
import * as FetchWrapper from "../../util/fetch-wrapper"; // Import the real fetchWithDefaults
import { LoginPage } from "./login";
import "@testing-library/jest-dom";

/**
 * Fill in and submit form. Credentials dont matter as the api determins anyway
 * @param screen React testing screen
 */
const submitForm = async () => {
  await userEvent.type(screen.getByLabelText("Username"), "testuser");
  await userEvent.type(screen.getByLabelText("Password"), "password");
  fireEvent.click(screen.getByRole("button", { name: "Login" }));
};

describe("LoginPage component", () => {
  let fetchSpy: jest.SpyInstance<Promise<Response>>;
  const renderInContext = () =>
    render(
      <UserContextProvider>
        <LoginPage />
      </UserContextProvider>
    );

  beforeEach(() => {
    jest.resetAllMocks();
    const mockResponse: Response = {
      json: () => Promise.resolve({ username: "apiUser" }),
    } as Response;
    fetchSpy = jest.spyOn(FetchWrapper, "fetchWithDefaults").mockResolvedValue(mockResponse);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the login form", () => {
    renderInContext();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("calls the login endpoint with provided values", async () => {
    renderInContext();
    await submitForm();

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("/login"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ username: "testuser", password: "password" }),
        })
      );
    });
  });

  it("sets the user for successful login calls", async () => {
    const setUsername = jest.fn();
    jest
      .spyOn(UseUserContext, "useUserContext")
      .mockReturnValueOnce({ user: { username: "", readonly: true }, setUser: setUsername });

    renderInContext();
    await submitForm();

    await waitFor(() => {
      expect(setUsername).toHaveBeenCalledWith({ "username": "apiUser" });
    });
  });

  it("displays an error message for invalid data", async () => {
    const mockResponse = {
      json: () => Promise.resolve({ non_field_errors: ["Invalid username or password."] }),
    } as Response;
    fetchSpy.mockResolvedValueOnce(mockResponse);

    renderInContext();
    await submitForm();

    await waitFor(() => {
      expect(screen.getByText("Invalid username or password.")).toBeInTheDocument();
    });
  });
});
