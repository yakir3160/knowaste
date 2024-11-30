import React from 'react';
import { Navigate } from 'react-router-dom';
import {useAuthContext} from "../../contexts/AuthContext";
import Loading from "../../components/Common/Loading/Loading";
import {useUserContext} from "../../contexts/UserContext";
import {useItemsContext} from "../../contexts/ItemsContext";


const ProtectedRoute = ({ element }) => {
    const { user,loading } = useAuthContext();
    if(loading )
        return <Loading />;

    if (!user)
        return <Navigate to="/auth" />;

    return element;
};

export default ProtectedRoute;
