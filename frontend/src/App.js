import './css/App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './components/Pages/LandingPage';
import ContactForm from './components/Forms/ContactForm';
import Auth from './components/Pages/Auth';
import Layout from "./components/Layouts/Layout";
import ScrollToTop from './components/functions/UI/ScrollToTop';
import Dashboard from "./components/AdminPanel/Dashboard/Dashboard";
import DailySalesReport from "./components/AdminPanel/DailySalesReport/dailySalesReport";
import LeftoverReport from "./components/AdminPanel/LeftoverReport/LeftoverReport";
import PriceQuote from "./components/AdminPanel/PriceQuote/PriceQuote";
import InventoryManagement from "./components/AdminPanel/InventoryManagement/InventoryManagement";

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
                        {/* Default route (dashboard) */}
                        <Route index element={<Dashboard />} />

                        {/* Other routes inside admin panel */}
                        <Route path="sales-report" element={<DailySalesReport />} />
                        <Route path="leftover-report" element={<LeftoverReport />} />
                        <Route path="inventory-management" element={<InventoryManagement />} />
                        <Route path="request-quote" element={<PriceQuote />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
