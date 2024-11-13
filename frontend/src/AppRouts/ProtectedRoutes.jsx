import React from 'react';
import { Route } from 'react-router-dom';
import Layout from "../components/Layouts/Layout";
import { ItemsProvider } from "../contexts/ItemsContext"
import Dashboard from "../components/AdminPanel/Shared/Dashboard/Dashboard";
import DailySalesReport from "../components/AdminPanel/RestaurantManager/DailySalesReport/dailySalesReport";
import LeftoverReport from "../components/AdminPanel/RestaurantManager/LeftoverReport/LeftoverReport";
import RequestPriceQuote from "../components/AdminPanel/RestaurantManager/RequestPriceQuote/PriceQuote";
import SendPriceQuote from "../components/AdminPanel/supplier/SendPriceQuote/SendPriceQuote";
import InventoryManagement from "../components/AdminPanel/Shared/InventoryManagement/InventoryManagement";
import AccountSettings from "../components/AdminPanel/Shared/AccountSettings/AccountSettings";
import ProtectedRoute from "./ConditionalRouts/ProtectedRoute";

export const ProtectedRoutes = (
    <Route
        path="admin-panel"
        element={
            <ProtectedRoute
                allowGuest={false}
                element={
                    <ItemsProvider>
                        <Layout pageType="admin-panel" />
                    </ItemsProvider>
                }
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
);
