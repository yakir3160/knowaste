// ייבוא ספריות React
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// ייבוא סגנונות
import './css/App.css';

// ייבוא Providers
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { ItemsProvider } from "./contexts/ItemsContext";

// ייבוא קומפוננטות
import AppRoutes from './AppRouts/AppRouts';
import { ScrollToTop } from './clientFunctions/UI/ScrollToTop';

const App = () => {
    return (
        <div className="App">
            <BrowserRouter>
                <AuthProvider>
                    <UserProvider>
                        <ScrollToTop />
                        <ItemsProvider>
                            <AppRoutes />
                        </ItemsProvider>
                    </UserProvider>
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
};

export default App;