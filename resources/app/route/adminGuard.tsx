import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

export default function RequireAdmin({ children }: { children: JSX.Element }) {
  let location = useLocation();

  const isAdmin = useAppSelector(
    (state) => state.auth.authUser && state.auth.authUser.role === "admin"
  );

  if (!isAdmin) {
    return <Navigate to="/user" state={{ from: location }} replace />;
  }

  return children;
}
