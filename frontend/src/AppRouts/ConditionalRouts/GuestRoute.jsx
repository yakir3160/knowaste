import {Navigate,Outlet} from "react-router-dom";
import {useAuthContext} from "../../contexts/AuthContext";

export const GuestRoute = () => {
    const {user} = useAuthContext();
    return user ? <Navigate to="/admin-panel" /> : <Outlet />

}