import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const Protected = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // You can replace this with a loading spinner or skeleton component
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default Protected;
