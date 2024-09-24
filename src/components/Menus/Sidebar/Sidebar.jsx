import Button from "../../Button";
import { ChevronLeft, ChevronRight, LayoutDashboard, FileText, Trash2, DollarSign, LogOut } from "lucide-react";
import Logo from "../../Logo/Logo";

const Sidebar = ({ isOpen, setSidebarOpen }) => {
    const toggleSidebar = () => {
        setSidebarOpen(!isOpen);
    };

    const menuItems = [
        { name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, href: "/dashboard" },
        { name: "Orders Report", icon: <FileText className="h-5 w-5" />, href: "/orders-report" },
        { name: "Waste Report", icon: <Trash2 className="h-5 w-5" />, href: "/waste-report" },
        { name: "New Price Quote", icon: <DollarSign className="h-5 w-5" />, href: "/new-price-quote" },
        { name: "Log Out", icon: <LogOut className="h-5 w-5 text-errorRed" />, href: "/logout" },
    ];

    const sideBarTransition = "transition-all duration-200 ease-in-out";
    const sidebarClasses = {
        container: "fixed mx-5 my-6",
        aside: `rounded-lg h-screen bg-secondary shadow-outer-custom ${sideBarTransition} ${isOpen ? "w-64" : "w-14"}`,
        logoContainer: `overflow-hidden ${sideBarTransition} ${isOpen ? 'w-auto' : 'w-0'}`,
        button: "z-10 p-2",
        menuList: "list-inside text-titles py-5 flex flex-col gap-5 mt-10",
        menuItem: `flex items-center gap-2 p-2 w-fit shadow-none hover:bg-base ${isOpen ? "" : "justify-center"}`,
        logout: "text-errorRed hover:text-errorRed",
        itemText: `whitespace-nowrap ${sideBarTransition} ${isOpen ? '' : 'hidden'}`,
    };

    return (
        <div className={`${sidebarClasses.container} ${isOpen ? 'pr-[300px]' : 'pr-[50px]'}`}>
            <aside className={sidebarClasses.aside}>
                <div className="flex justify-between items-center p-2">
                    <div className={sidebarClasses.logoContainer}>
                        <Logo className="text-logo-sm font-semibold text-titles p-3" />
                    </div>
                    <button
                        onClick={toggleSidebar}
                        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                        className={sidebarClasses.button}
                    >
                        {isOpen ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
                    </button>
                </div>
                <ul className={sidebarClasses.menuList}>
                    {menuItems.map((item, index) => (
                        <Button
                            key={index}
                            to={item.href}
                            className={`${sidebarClasses.menuItem} ${item.name === "Log Out" && sidebarClasses.logout}`}
                        >
                            {item.icon}
                            <span className={sidebarClasses.itemText}>{item.name}</span>
                        </Button>
                    ))}
                </ul>
            </aside>
        </div>
    );
};

export default Sidebar;
