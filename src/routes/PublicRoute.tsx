import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { RouteProps } from "./RouteProps";

function PublicRoute({ children }: RouteProps) {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext debe estar dentro del UserProvider");
  }

  const { token } = userContext;
  return !token ? children : <Navigate to="/profile" />;
}

export default PublicRoute;
