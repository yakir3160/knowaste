import {Navigate,Outlet} from "react-router-dom";
import {useAuthContext} from "../../contexts/AuthContext";
import Loading from "../../components/Common/Loading/Loading";

export const GuestRoute = () => {
    const {user,loading} = useAuthContext();
    if(loading)
        return <Loading/>;

    return user ? <Navigate to="/admin-panel" /> : <Outlet />

}