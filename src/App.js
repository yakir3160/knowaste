import './css/App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './components/Pages/LandingPage';
import ContactForm from './components/Forms/ContactForm';
import Auth from './components/Pages/Auth';
import Layout from "./components/Layouts/Layout";
import ScrollToTop from './components/functions/UI/ScrollToTop';
import AdminPanel from "./components/Pages/AdminPanel";

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

                        {/* <Route path="reports" element={<Reports />} /> */}
                        {/* <Route path="orders" element={<Orders />} /> */}
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
