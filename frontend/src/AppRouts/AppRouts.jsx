import React from 'react';
import { Routes, Route } from 'react-router-dom';

// ייבוא קומפוננטות דפים
import Layout from "../components/Layouts/Layout";
import LandingPage from '../components/Pages/LandingPage';
import ContactForm from '../components/Forms/ContactForm';
import Auth from '../components/Pages/Auth';
import PasswordResetForm from "../components/Forms/PasswordResetForm";

// ייבוא קומפוננטות פאנל ניהול
import Dashboard from "../components/AdminPanel/Shared/Dashboard/Dashboard";
import DailySalesReport from "../components/AdminPanel/RestaurantManager/DailySalesReport/dailySalesReport";
import LeftoverReport from "../components/AdminPanel/RestaurantManager/LeftoverReport/LeftoverReport";
import RequestPriceQuote from "../components/AdminPanel/RestaurantManager/RequestPriceQuote/PriceQuote";
import SendPriceQuote from "../components/AdminPanel/supplier/SendPriceQuote/SendPriceQuote";
import InventoryManagement from "../components/AdminPanel/Shared/InventoryManagement/InventoryManagement";
import AccountSettings from "../components/AdminPanel/Shared/AccountSettings/AccountSettings";

// ייבוא קומפוננטות הגנה על נתיבים
import ProtectedRoute from "./ConditionalRouts/ProtectedRoute";
import { GuestRoute } from "./ConditionalRouts/GuestRoute"

const AppRoutes = () => {
    return (
        <Routes>
            {/* נתיבים ציבוריים */}
            <Route path="/" element={<Layout pageType="default" />}>
                <Route index element={<LandingPage />} />
                <Route path="contact" element={<ContactForm />} />

                {/* נתיבי אורחים בלבד */}
                <Route element={<GuestRoute />}>
                    <Route path="auth" element={<Auth />} />
                    <Route path="auth/password-reset-form" element={<PasswordResetForm />} />
                </Route>
            </Route>

            {/* נתיבי פאנל ניהול - מוגנים */}
            <Route
                path="admin-panel"
                element={
                    <ProtectedRoute
                        allowGuest={false}
                        element={<Layout pageType="admin-panel" />}
                    />
                }
            >
                <Route index element={<Dashboard />} />
                <Route path="sales-report" element={<DailySalesReport />} />
                <Route path="leftover-report" element={<LeftoverReport />} />
                <Route path="inventory-management" element={<InventoryManagement />} />
                <Route path="request-quote" element={<RequestPriceQuote />} />
                <Route path="send-quote" element={<SendPriceQuote />} />
                <Route path="account-settings" element={<AccountSettings />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;