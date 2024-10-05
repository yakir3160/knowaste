import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Menus/Website/Navbar";
import Footer from "./Footer";
import DesktopSidebar from "../Menus/Admin/Desktop/DesktopSidebar";

const Layout = ({ children, pageType }) => {
    const [isOpen, setIsOpen] = useState(true);
    const isAdminPanel = pageType === 'admin-panel';

    // Define main content class based on the admin panel state
    const mainContentClass = isAdminPanel ? '' : 'pt-[150px] px-4 sm:px-6 lg:px-8';

    const sidebarPadding = isAdminPanel && isOpen ? 'pl-72' : 'pl-20';

    return (
        <div className="min-h-screen flex flex-col">
            {isAdminPanel ? (
                <DesktopSidebar isOpen={isOpen} setSidebarOpen={setIsOpen} />
            ) : (
                <Navbar />
            )}
            <main className={`flex-1 flex flex-col items-center w-full ${mainContentClass} ${isAdminPanel ? sidebarPadding : ''}`}>
                {children}
                <Outlet />
            </main>
            {!isAdminPanel && <Footer />}
        </div>
    );
};

export default Layout;