import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Menus/Website/Navbar";
import Footer from "./Footer";
import AdminMenu from "../Menus/Admin/AdminMenu";

const Layout = ({ children, pageType }) => {
    const [isOpen, setIsOpen] = useState(true);
    const isAdminPanel = pageType === 'admin-panel';

    const mainContentClass = isAdminPanel ? '' : 'pt-[100px] pb-5 px-4 sm:px-6 lg:px-8';

    const sidebarPadding = isOpen ? 'pl-0 md:pl-[300px] lg:pr-10' : 'pl-0 md:pl-[100px] lg:pr-10';

    return (
        <div className="min-h-screen flex flex-col">
            {isAdminPanel ? (
                <AdminMenu isOpen={isOpen} setIsOpen={setIsOpen} />
            ) : (
                <Navbar />
            )}
            <main className={`flex-1 flex flex-col  h-[100svh] items-center w-full ${mainContentClass} ${isAdminPanel ? `${sidebarPadding} mb-10` : ''}`}>
                {children}
                <Outlet />
            </main>
            {!isAdminPanel && <Footer />}
        </div>
    );
};

export default Layout;