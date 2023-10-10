import { render, fireEvent, waitFor } from "@testing-library/react";
import * as Fetchwrapper from "../../util/fetch-wrapper";
import { GatewayForm } from "./gateway-form";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

const navigateSpy = jest.fn();
const defaultLoaderData = {
  gateway: {
    id: 1,
    location_name: "Test Location",
    antenna_diameter: 2.5,
    longitude: 123.456,
    latitude: 45.678,
    company: 2,
  },
};
let mockLoaderData: { gateway: GatewayDto } | undefined = defaultLoaderData;

jest.mock("react-router-dom", () => ({
  useNavigate: () => navigateSpy,
  useLoaderData: () => mockLoaderData,
}));

jest.mock("../../hooks/use-user-context", () => ({
  useUserContext: () => ({ user: { readonly: false } }),
}));

describe("GatewayForm", () => {
  let mockFetchWithDefaults: jest.SpyInstance<Promise<Response>>;

  beforeEach(() => {
    mockLoaderData = defaultLoaderData;
    mockFetchWithDefaults = jest
      .spyOn(Fetchwrapper, "fetchWithDefaults")
      .mockResolvedValue({} as Response);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should render the form with existing gateway data", async () => {
    const { getByText, getByLabelText } = render(<GatewayForm />);
    await waitFor(() => {
      expect(getByLabelText("Location name:")).toHaveValue("Test Location");
      expect(getByLabelText("Antenna diameter:")).toHaveValue(2.5);
      expect(getByLabelText("Longitude:")).toHaveValue(123.456);
      expect(getByLabelText("Latitude:")).toHaveValue(45.678);
      expect(getByText("Save")).toBeInTheDocument();
    });
  });

  it("should submit the form and create a new gateway", async () => {
    mockLoaderData = undefined;
    mockFetchWithDefaults.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 2 }),
    } as Response);
    const entryData = {
      location_name: "new gateway",
      antenna_diameter: "2.223",
      longitude: "50.234",
      latitude: "42.234",
      company: null,
    };

    const { getByRole, getByLabelText } = render(<GatewayForm />);

    await userEvent.type(getByLabelText("Location name:"), entryData.location_name);
    await userEvent.type(
      getByLabelText("Antenna diameter:"),
      entryData.antenna_diameter.toString()
    );
    await userEvent.type(getByLabelText("Latitude:"), entryData.latitude.toString());
    await userEvent.type(getByLabelText("Longitude:"), entryData.longitude.toString());

    const submitButton = getByRole("button", { name: "Create" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetchWithDefaults).toHaveBeenCalledWith(expect.stringContaining("/gateways"), {
        method: "POST",
        body: JSON.stringify(entryData),
      });
      expect(navigateSpy).toHaveBeenCalledWith("/gateways/2");
    });
  });

  it("should submit the form and update an existing gateway", async () => {
    mockFetchWithDefaults.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 2 }),
    } as Response);
    const { getByText } = render(<GatewayForm />);
    const submitButton = getByText("Save");

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetchWithDefaults).toHaveBeenCalledWith(
        expect.stringContaining("/gateways/1"),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(mockLoaderData?.gateway),
        })
      );
      expect(navigateSpy).toHaveBeenCalledWith("/gateways/1");
    });
  });

  it("should display an error message if form submission fails", async () => {
    mockFetchWithDefaults.mockResolvedValue({
      ok: false,
      text: () => Promise.resolve("Submission failed"),
    } as Response);

    const { getByRole, getByTestId } = render(<GatewayForm />);
    const submitButton = getByRole("button", { name: "Save" });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getByTestId("error")).toBeInTheDocument();
      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });
});
