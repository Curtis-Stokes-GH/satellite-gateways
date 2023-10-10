import { render, screen, waitFor } from "@testing-library/react";
import * as FetchWrapper from "./util/fetch-wrapper";
import { UserContextProvider } from "./contexts/user-context";
import * as UseUserContext from "./hooks/use-user-context";
import { App } from "./app";
import "@testing-library/jest-dom";

jest.mock("./views/gateway/gateway-list", () => ({
  GatewayList: () => <div data-testid="gateway-list"></div>,
}));

describe("App component", () => {
  let fetchSpy: jest.SpyInstance<Promise<Response>>;
  const responseData = { username: "apiUser" };
  const renderInContext = () =>
    render(
      <UserContextProvider>
        <App />
      </UserContextProvider>
    );

  beforeEach(() => {
    jest.resetAllMocks();
    const mockResponse: Response = {
      json: () => Promise.resolve(responseData),
    } as Response;
    fetchSpy = jest.spyOn(FetchWrapper, "fetchWithDefaults").mockResolvedValue(mockResponse);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders login page when no user is set", async () => {
    renderInContext();
    await waitFor(() => {
      const loginPage = screen.getByTestId("login-page");
      expect(loginPage).toBeInTheDocument();
    });
  });

  it("sets the user from the api call if no user in context", async () => {
    // Mock sure the context has no user
    const setUser = jest.fn();
    jest
      .spyOn(UseUserContext, "useUserContext")
      .mockReturnValueOnce({ user: { username: "", readonly: true }, setUser });
    renderInContext();
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining("/session"));
      expect(setUser).toHaveBeenCalledWith(responseData);
    });
  });

  it("renders gateway list when a user is already in context", async () => {
    // Mock the useContext hook to return a username
    const setUser = jest.fn();
    jest.spyOn(UseUserContext, "useUserContext").mockReturnValueOnce({
      user: { username: "contextUser", readonly: true },
      setUser,
    });

    renderInContext();

    await waitFor(() => {
      const gatewayList = screen.getByTestId("gateway-list");
      expect(gatewayList).toBeInTheDocument();
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });
});
