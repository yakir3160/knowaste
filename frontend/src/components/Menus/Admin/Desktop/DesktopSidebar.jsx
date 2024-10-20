import Button from "../../../Common/Button/Button";
import { ChevronLeft, ChevronRight, LayoutDashboard, FileText, Trash2, Warehouse, DollarSign, LogOut } from "lucide-react";
import Logo from "../../../Common/Logo/Logo";
import { useLocation } from "react-router-dom";
import { useUserContext } from "../../../../Contexts/UserContext";

const DesktopSidebar = ({ isOpen, setIsOpen }) => {
    const toggleSidebar = () => setIsOpen(!isOpen);
    const location = useLocation();
    const { user,logout } = useUserContext(); // Ensure you're correctly destructuring logout from the context

    const sideBarTransition = "transition-all duration-200 ease-in-out";
    const sidebarClasses = {
        container: "fixed mx-6 my-5",
        aside: `flex flex-col rounded-lg h-[95vh] bg-secondary shadow-outer-custom ${sideBarTransition} ${isOpen ? "w-64" : "w-14"} animate-fadeIn`,
        logoContainer: `overflow-hidden ${sideBarTransition} ${isOpen ? 'w-auto' : 'w-0'}`,
        button: "z-10 p-2",
        menuList: "flex-grow list-inside text-titles py-5 flex flex-col gap-5 mt-10",
        menuItem: `flex items-center gap-2 p-2 w-full shadow-none hover:bg-base ${isOpen ? "" : "justify-center"}`,
        logout: "text-errorRed hover:text-errorRed hover:bg-errorLightRed hover:border-errorRed",
        itemText: `whitespace-nowrap ${sideBarTransition} ${isOpen ? '' : 'hidden'}`,
        footer: "flex justify-center items-center bg-baseLight h-[10vh] rounded-b-lg",
    };

    return (
        <div className={`${sidebarClasses.container} ${isOpen ? 'pr-[300px]' : 'pr-[50px]'}`}>
            <aside className={sidebarClasses.aside}>
                <div className="flex justify-between items-center p-2">
                    <div className={sidebarClasses.logoContainer}>
                        <Logo className="text-logo-sm font-semibold text-titles p-5" to="/admin-panel"/>
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
                    <Button
                        to="/admin-panel"
                        className={`p-2 ${sidebarClasses.menuItem} ${location.pathname === "/admin-panel" ? "bg-base border-2 border-lime text-buttons pl-2" : "border-2 border-[transparent]"}`}
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        <span className={sidebarClasses.itemText}>Home</span>
                    </Button>
                    <Button
                        to="/admin-panel/sales-report"
                        className={`p-2 ${sidebarClasses.menuItem} ${location.pathname === "/admin-panel/sales-report" ? "bg-base border-2 border-lime text-buttons pl-2" : "border-2 border-[transparent]"}`}
                    >
                        <FileText className="h-5 w-5" />
                        <span className={sidebarClasses.itemText}>Daily Sales Report</span>
                    </Button>
                    <Button
                        to="/admin-panel/leftover-report"
                        className={`p-2 ${sidebarClasses.menuItem} ${location.pathname === "/admin-panel/leftover-report" ? "bg-base border-2 border-lime text-buttons pl-2" : "border-2 border-[transparent]"}`}
                    >
                        <Trash2 className="h-5 w-5" />
                        <span className={sidebarClasses.itemText}>Leftover Report</span>
                    </Button>
                    <Button
                        to="/admin-panel/inventory-management"
                        className={`p-2 ${sidebarClasses.menuItem} ${location.pathname === "/admin-panel/inventory-management" ? "bg-base border-2 border-lime text-buttons pl-2" : "border-2 border-[transparent]"}`}
                    >
                        <Warehouse className="h-5 w-5" />
                        <span className={sidebarClasses.itemText}>Inventory Management</span>
                    </Button>
                    <Button
                        to="/admin-panel/request-quote"
                        className={`p-2 ${sidebarClasses.menuItem} ${location.pathname === "/admin-panel/request-quote" ? "bg-base border-2 border-lime text-buttons pl-2" : "border-2 border-[transparent]"}`}
                    >
                        <DollarSign className="h-5 w-5" />
                        <span className={sidebarClasses.itemText}>Request Price Quote</span>
                    </Button>
                    <Button
                        onClick={logout} // Call logout function directly
                        className={`p-2 ${sidebarClasses.menuItem} ${sidebarClasses.logout}`}
                    >
                        <LogOut className="h-5 w-5 text-errorRed" />
                        <span className={sidebarClasses.itemText}>Sign Out</span>
                    </Button>
                </ul>

                <div className={sidebarClasses.footer}>
                    <p className="text-center text-xl text-titles">Hello {user.email}</p>
                </div>
            </aside>
        </div>
    );
};

export default DesktopSidebar;
