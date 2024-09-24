import React, { useState } from "react";
import Button from "../../Button";
import { ChevronLeft, ChevronRight, LayoutDashboard, FileText, Trash2, DollarSign, LogOut } from "lucide-react";
import Logo from "../../Logo/Logo";

const Sidebar = ({ setSidebarOpen }) => {
    const [isOpen, setIsOpen] = useState(true);
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
        setSidebarOpen(!isOpen);
    };

    const menuItems = [
        { name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, href: "/dashboard" },
        { name: "Orders Report", icon: <FileText className="h-5 w-5" />, href: "/orders-report" },
        { name: "Waste Report", icon: <Trash2 className="h-5 w-5" />, href: "/waste-report" },
        { name: "New Price Quote", icon: <DollarSign className="h-5 w-5" />, href: "/new-price-quote" },
        { name: "Log Out", icon: <LogOut className="h-5 w-5 text-errorRed" />, href: "/logout" },
    ];

    return (
        <div className={`fixed animate-fadeIn mx-5  my-6 ${isOpen ? 'pr-[300px]' : 'pr-[50px]'}`}>
            <aside className={`rounded-lg h-screen bg-secondary shadow-outer-custom transition-all duration-300 ease-in-out ${isOpen ? "w-64" : "w-14"}`}>
                <div className="flex justify-between items-center p-2">
                    <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ width: isOpen ? 'auto' : '0' }}>
                        <Logo className="text-logo-sm font-semibold text-titles p-3">
                            Hello user
                        </Logo>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                        className="z-10 p-2"
                    >
                        {isOpen ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
                    </button>
                </div>
                <ul className="list-inside text-titles py-5 flex flex-col gap-5 mt-10">
                    {menuItems.map((item, index) => (
                        <Button
                            key={index}
                            to={item.href}
                            className={`flex items-center gap-2 p-2 transition-all duration-300 shadow-none hover:bg-base ${!isOpen && "justify-center"}  ${item.name === "Log Out" && "text-errorRed hover:text-errorRed"}`}
                        >
                            {isOpen ? (
                                <>
                                    {item.icon}
                                    <span className="transition-opacity duration-300">{item.name}</span>
                                </>
                            ) : (
                                item.icon
                            )}
                        </Button>
                    ))}
                </ul>
            </aside>
        </div>
    );
};

export default Sidebar;
