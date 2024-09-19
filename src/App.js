import './css/App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ContactForm from './pages/ContactForm';
import Auth from './pages/Auth';
import Layout from "./components/Layout";
import ScrollToTop from './components/ScrollToTop';
import Dashboard from "./pages/Dashboard";

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
                    <Route path="dashboard" element={<Layout pageType="dashboard" />}>
                        <Route index element={<Dashboard />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
