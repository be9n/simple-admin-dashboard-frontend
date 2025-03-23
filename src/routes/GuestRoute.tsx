import PageLoadingSpinner from "@/components/PageLoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { JSX, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GuestRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  if (user) {
    return null;
  }

  return children;
};

export default GuestRoute;
