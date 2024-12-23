import React from 'react';
import { Route } from 'react-router-dom';
import Layout from "../components/Layouts/Layout";
import { ItemsProvider } from "../contexts/ItemsContext"
import Dashboard from "../components/AdminPanel/Dashboard/Dashboard";
import DailySalesReport from "../components/AdminPanel/DailySalesReport/dailySalesReport";
import InventoryManagement from "../components/AdminPanel/InventoryManagement/InventoryManagement";
import Account from "../components/AdminPanel/Account/Account";
import ProtectedRoute from "./ConditionalRouts/ProtectedRoute";
import WasteReport from "../components/AdminPanel//WasteReport/WasteReport";

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
        <Route path="waste-report" element={<WasteReport/>} />
        <Route path="inventory-management" element={<InventoryManagement />} />
        <Route path="account-settings" element={<Account />} />
    </Route>
);
