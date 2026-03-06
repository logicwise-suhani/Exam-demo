import { Navigate } from "react-router-dom";

export function PublicRoute({ children }) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        return <Navigate to="/selectSubject" replace />
    }

    return children;
}