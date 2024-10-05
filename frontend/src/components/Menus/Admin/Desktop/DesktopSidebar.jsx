import Button from "../../../Common/Button/Button";
import { ChevronLeft, ChevronRight, LayoutDashboard, FileText, Trash2,Warehouse, DollarSign, LogOut } from "lucide-react";
import Logo from "../../../Common/Logo/Logo";
import {useLocation} from "react-router-dom";

const DesktopSidebar = ({ isOpen, setIsOpen }) => {
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    const location = useLocation();
    const menuItems = [
        {
            id: "home",
            name: "Home",
            icon: <LayoutDashboard className="h-5 w-5" />,
            href: "/admin-panel",
        },
        {
            id: "DailySalesReport",
            name: " Daily Sales Report",
            icon: <FileText className="h-5 w-5" />,
            href: "/admin-panel/sales-report",
        },
        {
            id: "leftoverReport",
            name: "Leftover Report",
            icon: <Trash2 className="h-5 w-5" />,
            href: "/admin-panel/leftover-report",
        },
        {
            id: "inventory",
            name: "Inventory Management",
            icon: <Warehouse className="h-5 w-5" />,
            href: "/admin-panel/inventory-management",
        },
        {
            id: "priceRequest",
            name: "Request Price Quote",
            icon: <DollarSign className="h-5 w-5" />,
            href: "/admin-panel/request-quote",
        },
        {
            id: "signOut",
            name: "Sign Out",
            icon: <LogOut className="h-5 w-5 text-errorRed" />,
            href: "/",
            action: "logout",
        },
    ];

    const sideBarTransition = "transition-all duration-200 ease-in-out";
    const sidebarClasses = {
        container: "fixed mx-6 my-5",
        aside: ` flex flex-col rounded-lg h-[95vh] bg-secondary shadow-outer-custom ${sideBarTransition} ${isOpen ? "w-64" : "w-14"} animate-fadeIn`,
        logoContainer: `overflow-hidden ${sideBarTransition} ${isOpen ? 'w-auto' : 'w-0'}`,
        button: "z-10 p-2 ",
        menuList: " flex-grow list-inside text-titles py-5 flex flex-col gap-5 mt-10",
        menuItem: `flex items-center gap-2 p-2 w-full shadow-none  hover:bg-base ${isOpen ? "" : "justify-center"}`,
        logout: "text-errorRed hover:text-errorRed hover:bg-errorLightRed hover:border-errorRed",
        itemText: `whitespace-nowrap ${sideBarTransition} ${isOpen ? '' : 'hidden'}`,
        footer: "flex justify-center items-center bg-baseLight h-[10vh] rounded-b-lg",
    };

    return (
        <div className={`${sidebarClasses.container} ${isOpen ? 'pr-[300px]' : 'pr-[50px]'}`}>
            <aside className={sidebarClasses.aside}>
                <div className="flex justify-between items-center p-2">
                    <div className={sidebarClasses.logoContainer}>
                        <Logo className="text-logo-sm font-semibold text-titles p-5"/>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                        className={sidebarClasses.button}
                    >
                        {isOpen ? <ChevronLeft className="h-6 w-6"/> : <ChevronRight className="h-6 w-6"/>}
                    </button>
                </div>
                <ul className={sidebarClasses.menuList}>
                    {menuItems.map((item, index) => (
                        <Button
                            key={index}
                            to={item.href}
                            className={`p-2  ${sidebarClasses.menuItem} ${item.name === "Sign Out" && sidebarClasses.logout}
                            ${location.pathname === item.href ? "bg-base border-2 border-lime text-buttons pl-2" : "border-2 border-[transparent]"}`}
                        >
                            {item.icon}
                            <span className={sidebarClasses.itemText}>{item.name}</span>
                        </Button>
                    ))}
                </ul>
                <div className={sidebarClasses.footer}>
                        <p  className=" text-center text-xl text-titles" >Hello user</p>
                </div>
            </aside>

        </div>
    );
};

export default DesktopSidebar;
