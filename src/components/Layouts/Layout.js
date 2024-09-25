import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Menus/Navbar/Navbar";
import Footer from "./Footer";
import Sidebar from "../Menus/Sidebar/Sidebar";

const Layout = ({ children, pageType }) => {
    const [isOpen, setIsOpen] = useState(true);
    const isAdminPanel = pageType === 'admin-panel';
    const mainContentClass = isAdminPanel ? '' : 'pt-[150px] px-4 sm:px-6 lg:px-8';

    return (
        <div className="min-h-screen flex flex-col">
            {isAdminPanel ? <Sidebar isOpen={isOpen} setSidebarOpen={setIsOpen} /> : <Navbar />}
            <main className={`flex-1 flex flex-col items-center w-full ${mainContentClass} ${isOpen ? 'pl-72' : 'pl-20'}`}>
                {children}
                <Outlet />
            </main>
            {isAdminPanel ? '' : <Footer />}
        </div>
    );
};

export default Layout;
