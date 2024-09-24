import './css/App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ContactForm from './pages/ContactForm';
import Auth from './pages/Auth';
import Layout from "./components/Layout";
import ScrollToTop from './components/ScrollToTop';
import AdminPanel from "./pages/AdminPanel";

const App = () => {
    return (
        <div className="App">
            <BrowserRouter>
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<Layout pageType="default" />}>
                        <Route index element={<LandingPage />} />
                        <Route path="contact" element={<ContactForm />} />
                        <Route path="auth" element={<Auth />} />
                    </Route>
                    <Route path="admin-panel" element={<Layout pageType="admin-panel" />}>
                        <Route index element={<AdminPanel />} />
                        {/* You can add sub-routes for dashboard, reports, and orders here */}
                        {/* <Route path="dashboard" element={<Dashboard />} /> */}
                        {/* <Route path="reports" element={<Reports />} /> */}
                        {/* <Route path="orders" element={<Orders />} /> */}
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
