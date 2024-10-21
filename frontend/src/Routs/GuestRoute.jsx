import {Navigate,Outlet} from "react-router-dom";
import {useAuthContext} from "../Contexts/AuthContext";

export const GuestRoute = () => {
    const {user} = useAuthContext();
    return user ? <Navigate to="/admin-panel" /> : <Outlet />

}