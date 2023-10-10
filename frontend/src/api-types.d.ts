// Basic types for expected API models
type GatewayDto = {
  id?: number;
  location_name: string;
  antenna_diameter: number;
  longitude: number;
  latitude: number;
  company: number;
};

type CompanyDto = {
  id: number;
  name: string;
};

type UserDto = {
  username: string;
  is_superuser: boolean;
  // Not on session user
  company: number | null;
};
