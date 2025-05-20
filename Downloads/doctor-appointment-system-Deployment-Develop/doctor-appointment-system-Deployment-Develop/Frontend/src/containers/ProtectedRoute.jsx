import { Navigate } from "react-router-dom";
import { useUserRole } from "@/Contexts/UserContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { role, loading } = useUserRole();
    console.log(role);

    if (loading) return <div>Loading...</div>; // or a spinner

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/" replace />; // Redirect to home if not allowed
    }

    return children;
};

export default ProtectedRoute;
