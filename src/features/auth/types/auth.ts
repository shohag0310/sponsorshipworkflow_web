export type User = {
  email: string;
  role: string;
  name?: string;
};

export type AuthContextType = {
  user: User | null;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  name: string;
  email: string;
  role: string;
};