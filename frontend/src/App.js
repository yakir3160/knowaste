import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import './css/App.css';

import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { ScrollToTop } from './clientFunctions/UI/ScrollToTop';

import { PublicRoutes } from './AppRouts/PublicRoutes';
import { ProtectedRoutes } from './AppRouts/ProtectedRoutes';

const App = () => {
    return (
        <div className="App">
            <BrowserRouter>
                <AuthProvider>
                    <UserProvider>
                        <ScrollToTop />
                        <Routes>
                            {PublicRoutes}
                            {ProtectedRoutes}
                        </Routes>
                    </UserProvider>
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
};


export default App;
