import { render, fireEvent, waitFor } from "@testing-library/react";
import * as useFetchModule from "../hooks/use-fetch";
import * as fetchWrapperModule from "../util/fetch-wrapper";
import { CompanyList } from "./company-list";
import "@testing-library/jest-dom";

const mockCompanies = [
  { id: 1, name: "Company A" },
  { id: 2, name: "Company B" },
];

describe("CompanyList", () => {
  let useFetchSpy: jest.SpyInstance<
    ReturnType<typeof useFetchModule.useFetch>,
    [string, RequestInit?]
  >;
  let fetchWithDefaultsSpy: jest.SpyInstance<Promise<Response>>;

  beforeEach(() => {
    useFetchSpy = jest.spyOn(useFetchModule, "useFetch");
    fetchWithDefaultsSpy = jest.spyOn(fetchWrapperModule, "fetchWithDefaults");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders loading message when data is loading", () => {
    useFetchSpy.mockReturnValue({ response: null, error: null });
    const { getByText } = render(<CompanyList onCompanyUpdated={() => {}} selectedId={null} />);
    expect(getByText("Loading ...")).toBeInTheDocument();
  });

  it("renders error message when there is an error", () => {
    useFetchSpy.mockReturnValue({ response: null, error: "Some error" });
    const { getByText } = render(<CompanyList onCompanyUpdated={() => {}} selectedId={null} />);
    expect(getByText("Error when loading companies")).toBeInTheDocument();
  });

  it("renders select options when companies are loaded", async () => {
    useFetchSpy.mockReturnValue({ response: mockCompanies, error: null });

    const { getByText, getByTestId } = render(
      <CompanyList onCompanyUpdated={() => {}} selectedId={1} />
    );

    await waitFor(() => {
      expect(getByText("Company A")).toBeInTheDocument();
      expect(getByText("Company B")).toBeInTheDocument();
    });

    const selectElement = getByTestId("company-select") as HTMLSelectElement;
    expect(selectElement.value).toBe("1");
  });

  it("handles company selection", async () => {
    useFetchSpy.mockReturnValue({ response: mockCompanies, error: null });
    const onCompanyUpdatedMock = jest.fn();

    const { getByTestId } = render(
      <CompanyList onCompanyUpdated={onCompanyUpdatedMock} selectedId={null} />
    );

    await waitFor(() => {
      const selectElement = getByTestId("company-select");
      fireEvent.change(selectElement, { target: { value: "2" } });
    });

    expect(onCompanyUpdatedMock).toHaveBeenCalledWith(2);
  });

  it("handles adding a new company", async () => {
    useFetchSpy.mockReturnValue({ response: mockCompanies, error: null });
    const mockResponse: Response = {
      ok: true,
      json: () => Promise.resolve({ id: 3, name: "Company C" }),
    } as Response;
    fetchWithDefaultsSpy.mockResolvedValue(mockResponse);

    const onCompanyUpdatedMock = jest.fn();
    const { getByText, getByTestId } = render(
      <CompanyList onCompanyUpdated={onCompanyUpdatedMock} selectedId={null} />
    );

    const inputElement = getByTestId("new-company-input");
    fireEvent.change(inputElement, { target: { value: "Company C" } });

    await waitFor(() => {
      const createButton = getByText("Create company");
      fireEvent.click(createButton);
    });

    await waitFor(() => {
      expect(onCompanyUpdatedMock).toHaveBeenCalledWith(3);
      const selectElement = getByTestId("company-select");
      expect(selectElement).toHaveTextContent("Company C");
    });
  });
});
