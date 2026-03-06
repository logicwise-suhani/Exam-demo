import { Navigate } from "react-router-dom";

function PrivateRoute({ children, allowedRoles }) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" />
    }

    return children;
}

export default PrivateRoute;