import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GatewayItem } from "./gateway-item";

/*
These mocks are getting a little messy, would prefer to make some consistent
re-usable patterns with more time
*/
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

const mockUserContext = { user: { readonly: false } };
jest.mock("../../hooks/use-user-context", () => ({
  useUserContext: () => mockUserContext,
}));

describe("GatewayItem", () => {
  beforeEach(() => {
    mockLoaderData = defaultLoaderData;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should render gateway information for a non-read-only user", () => {
    mockUserContext.user.readonly = false;
    const { getByText } = render(<GatewayItem />);

    // check data
    expect(getByText("Location Name:")).toBeInTheDocument();
    expect(getByText("Test Location")).toBeInTheDocument();
    expect(getByText("Antenna Diameter:")).toBeInTheDocument();
    expect(getByText("2.5 meters")).toBeInTheDocument();
    expect(getByText("Longitude:")).toBeInTheDocument();
    expect(getByText("123.456")).toBeInTheDocument();
    expect(getByText("Latitude:")).toBeInTheDocument();
    expect(getByText("45.678")).toBeInTheDocument();
  });

  it("should render edit button for !readonly user", () => {
    mockUserContext.user.readonly = false;
    const { queryByRole } = render(<GatewayItem />);
    const editButton = queryByRole("button", { name: "Edit" });
    expect(editButton).toBeInTheDocument();
  });

  it("should not render edit button for a readonly user", () => {
    mockUserContext.user.readonly = true;
    const { queryByRole } = render(<GatewayItem />);

    const editButton = queryByRole("button", { name: "Edit" });
    expect(editButton).not.toBeInTheDocument();
  });
});
