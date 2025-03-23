import { User } from "@/types";
import API from "@/utils/api";
import setupInterceptor from "@/utils/apiAuthInterceptor";
import Cookies from "js-cookie";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

type AuthContextState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, accessToken: string) => void;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextState | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setupInterceptor(resetAndRedirect); // Set up the interceptor with navigate
  }, [navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get("/me");
        setUser(data.data.user);
      } catch (error) {
        resetAndRedirect()
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (user: User, accessToken: string) => {
    Cookies.set("accessToken", accessToken, { secure: true });
    setUser(user);
    navigate("/");
  };

  const logout = async () => {
    setIsLoading(true);
    await API.post("/logout");
    setIsLoading(false);
    resetAndRedirect();
  };

  const resetAndRedirect = () => {
    Cookies.remove("accessToken");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");

  return context;
};
