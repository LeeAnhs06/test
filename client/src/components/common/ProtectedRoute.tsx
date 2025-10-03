import { useSelector } from "react-redux";
import { RootState } from "../../stores";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}