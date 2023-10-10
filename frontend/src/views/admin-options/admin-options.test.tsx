import { render, fireEvent, waitFor } from "@testing-library/react";
import { AdminOptions } from "./admin-options";
import "@testing-library/jest-dom";
const navigateSpy = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => navigateSpy,
}));

describe("AdminOptions", () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should render the component", async () => {
    const { getByTestId } = render(<AdminOptions />);
    await waitFor(() => {
      const adminOptions = getByTestId("admin-options");
      const createGatewayButton = getByTestId("create-gateway");
      const createUserButton = getByTestId("create-user");

      expect(adminOptions).toBeInTheDocument();
      expect(createGatewayButton).toBeInTheDocument();
      expect(createUserButton).toBeInTheDocument();
    });
  });

  it('should navigate to /create-gateway when "Create Gateway" button is clicked', async () => {
    const { getByTestId } = render(<AdminOptions />);
    const createGatewayButton = getByTestId("create-gateway");

    fireEvent.click(createGatewayButton);
    await waitFor(() => {
      expect(navigateSpy).toHaveBeenCalledWith("/create-gateway");
    });
  });

  it('should navigate to /create-user when "Create User" button is clicked', async () => {
    const { getByTestId } = render(<AdminOptions />);
    const createUserButton = getByTestId("create-user");

    fireEvent.click(createUserButton);

    await waitFor(() => {
      expect(navigateSpy).toHaveBeenCalledWith("/create-user");
    });
  });
});
