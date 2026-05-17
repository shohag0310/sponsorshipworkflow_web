import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type User = {
  email: string;
  role: string;
  name?: string;
};

// Role claim namespace used by ASP.NET Core
const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const EMAIL_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
const NAME_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";

function extractUserFromToken(token: string): User | null {
  try {
    const decoded = jwtDecode<Record<string, unknown>>(token);

    const role = (decoded["role"] as string) || (decoded[ROLE_CLAIM] as string);
    const email = (decoded[EMAIL_CLAIM] as string) || (decoded["email"] as string);
    const name = (decoded[NAME_CLAIM] as string) || (decoded["name"] as string);

    if (!email || !role) return null;

    return { email, role, name };
  } catch {
    return null;
  }
}

type AuthContextType = {
  user: User | null;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const extractedUser = extractUserFromToken(token);
      if (extractedUser) {
        setUser(extractedUser);
      } else {
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const extractedUser = extractUserFromToken(token);
    if (extractedUser) {
      setUser(extractedUser);
    } else {
      setUser({ email: "user@test.com", role: "Requestor" });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);