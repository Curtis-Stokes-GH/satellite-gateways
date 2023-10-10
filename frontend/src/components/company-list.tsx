import { useEffect, useState } from "react";
import { useFetch } from "../hooks/use-fetch";
import { config } from "../config";
import { fetchWithDefaults } from "../util/fetch-wrapper";

type CompanyListProps = {
  onCompanyUpdated: (companyId: number) => void;
  selectedId: number | null;
  disabled?: boolean;
};

export function CompanyList({ selectedId, disabled, onCompanyUpdated }: CompanyListProps) {
  const { response, error } = useFetch<CompanyDto[]>(`${config.backendBaseUrl}/companies`);
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [newCompanyInput, setNewCompanyInput] = useState<string>("");

  useEffect(() => {
    if (response?.length) {
      setCompanies(response);
      if (!selectedId) {
        onCompanyUpdated(response[0].id);
      }
    }
    // Due to time pressure do not want to be wrapping useCallback etc above. Calls too often
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  if (error) {
    return <p>Error when loading companies</p>;
  }

  if (!response) {
    return <p>Loading ...</p>;
  }

  const handleNewCompanyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCompanyInput(e.target.value);
  };

  const handleAddNewCompany = async () => {
    const response = await fetchWithDefaults(`${config.backendBaseUrl}/companies`, {
      method: "POST",
      body: JSON.stringify({ name: newCompanyInput }),
    });
    if (response.ok) {
      const data = await response.json();
      setNewCompanyInput("");
      setCompanies([...companies, data]);
      onCompanyUpdated(data.id);
    }
  };

  return (
    <>
      <select
        disabled={disabled}
        onChange={(e) => onCompanyUpdated(Number.parseInt(e.target.value))}
        data-testid="company-select"
        value={selectedId ?? ''}
      >
        {companies.length === 0 && (
          <option value="" disabled>
            Please create at least one company
          </option>
        )}
        {companies.map(({ id, name }) => (
          <option value={id} key={id}>
            {name}
          </option>
        ))}
      </select>
      {!disabled && (
        <span>
          <input
            type="text"
            placeholder="Create a new company"
            data-testid="new-company-input"
            value={newCompanyInput}
            onChange={handleNewCompanyInputChange}
          />
          <button onClick={handleAddNewCompany} type="button">
            Create company
          </button>
        </span>
      )}
    </>
  );
}
