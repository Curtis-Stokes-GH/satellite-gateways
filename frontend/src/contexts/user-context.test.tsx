import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { UserContext, UserContextProvider } from "./user-context";

describe("UserContext and UserContextProvider", () => {
  it("should provide a default context value", () => {
    render(
      <UserContextProvider>
        <UserContext.Consumer>
          {(contextValue) => <div data-testid="context-value">{JSON.stringify(contextValue)}</div>}
        </UserContext.Consumer>
      </UserContextProvider>
    );

    const contextElement = screen.getByTestId("context-value");
    const value = contextElement?.textContent ?? "";

    // Assert that the default context value is provided. Note that functions do not persist
    expect(JSON.parse(value)).toEqual({ user: { username: "", readonly: true } });
  });

  it("should allow setting and reading the context value", async () => {
    render(
      <UserContextProvider>
        <UserContext.Consumer>
          {(contextValue) => (
            <div>
              <button
                onClick={() => contextValue.setUser({ username: "testUser", readonly: true })}
              >
                Set Username
              </button>
              <div data-testid="username">{contextValue.user.username}</div>
            </div>
          )}
        </UserContext.Consumer>
      </UserContextProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: "Set Username" }));

    await waitFor(() => {
      const usernameElement = screen.getByTestId("username");
      // Assert that the username is set and can be read from the context
      expect(usernameElement?.textContent).toBe("testUser");
    });
  });
});
