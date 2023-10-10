import { useNavigate } from "react-router-dom";

export function AdminOptions() {
  const navigate = useNavigate();

  return (
    <div className="admin-options" data-testid="admin-options">
      <button data-testid="create-gateway" onClick={() => navigate("/create-gateway")}>
        Create Gateway
      </button>
      <button data-testid="create-user" onClick={() => navigate("/create-user")}>
        Create User
      </button>
    </div>
  );
}
