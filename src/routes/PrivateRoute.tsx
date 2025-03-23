import PageLoadingSpinner from "@/components/PageLoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return children;
};

export default PrivateRoute;
