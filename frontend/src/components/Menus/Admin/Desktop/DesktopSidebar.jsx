import Button from "../../../Common/Button/Button";
import { ChevronLeft, ChevronRight, LayoutDashboard, FileText, Trash2, Warehouse, DollarSign, LogOut,UserRoundCog } from "lucide-react";
import Logo from "../../../Common/Logo/Logo";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuthContext } from "../../../../contexts/AuthContext";
import { useUserContext } from "../../../../contexts/UserContext";

const DesktopSidebar = ({ isOpen, setIsOpen }) => {
    const toggleSidebar = () => setIsOpen(!isOpen);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuthContext();
    const { userBaseData: user } = useUserContext();
    const accountType = user?.accountType;

    const isActive = (path) => location.pathname === path;

    const sideBarTransition = "transition-all duration-200 ease-in-out";
    const sidebarClasses = {
        container: "fixed",
        aside: `flex flex-col rounded-r-lg h-[95vh] mb-6 mt-6 bg-secondary shadow-outer-custom ${sideBarTransition} ${isOpen ? "w-64" : "w-14"} animate-fadeIn`,
        logoContainer: `overflow-hidden ${sideBarTransition} ${isOpen ? 'w-auto' : 'w-0'}`,
        button: "z-10",
        menuList: "flex-grow list-inside text-titles py-5 flex flex-col gap-5 mt-10",
        menuItem: `flex items-center gap-2 rounded-r-md p-3 px-4 w-full shadow-none hover:bg-base `,
        menuItemSelected: "bg-base border border-lime text-buttons",
        logout: "text-errorRed border border-transparent text-buttons px-4 hover:text-errorRed hover:bg-errorLightRed hover:border-errorRed",
        itemText: `whitespace-nowrap ${sideBarTransition} ${isOpen ? '' : 'hidden'}`,
        footer: "flex justify-center items-center bg-baseLight h-[10vh] rounded-b-lg",
    };

    const getMenuItemClasses = (path) => `p-2 ${sidebarClasses.menuItem} ${isActive(path) ? sidebarClasses.menuItemSelected : 'border border-transparent'}`;

    return (
        <div className={sidebarClasses.container}>
            <aside className={sidebarClasses.aside}>
                <div className="flex justify-between items-center p-2">
                    <div className={sidebarClasses.logoContainer}>
                        <Logo className="text-logo-sm font-semibold text-titles p-5" to="/" />
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
                    <Button
                        onClick={() => navigate("/admin-panel")}
                        className={getMenuItemClasses("/admin-panel")}
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        <span className={sidebarClasses.itemText}>Home</span>
                    </Button>
                    <Button
                        onClick={() => navigate("/admin-panel/inventory-management")}
                        className={getMenuItemClasses("/admin-panel/inventory-management")}
                    >
                        <Warehouse className="h-5 w-5" />
                        <span className={sidebarClasses.itemText}>Inventory Management</span>
                    </Button>

                    {accountType === 'restaurant-manager' && (
                        <>
                            <Button
                                onClick={() => navigate("/admin-panel/sales-report")}
                                className={getMenuItemClasses("/admin-panel/sales-report")}
                            >
                                <FileText className="h-5 w-5" />
                                <span className={sidebarClasses.itemText}>Daily Sales Report</span>
                            </Button>
                            <Button
                                onClick={() => navigate("/admin-panel/leftover-report")}
                                className={getMenuItemClasses("/admin-panel/leftover-report")}
                            >
                                <Trash2 className="h-5 w-5" />
                                <span className={sidebarClasses.itemText}>Leftover Report</span>
                            </Button>
                            <Button
                                onClick={() => navigate("/admin-panel/request-quote")}
                                className={getMenuItemClasses("/admin-panel/request-quote")}
                            >
                                <DollarSign className="h-5 w-5" />
                                <span className={sidebarClasses.itemText}>Request Price Quote</span>
                            </Button>
                        </>
                    )}

                    {accountType === 'supplier' && (
                        <Button
                            onClick={() => navigate("/admin-panel/send-quote")}
                            className={getMenuItemClasses("/admin-panel/send-quote")}
                        >
                            <DollarSign className="h-5 w-5" />
                            <span className={sidebarClasses.itemText}>Send Price Quote</span>
                        </Button>
                    )}

                    <Button
                        className={getMenuItemClasses("/admin-panel/account-settings")}
                        onClick={() => navigate("/admin-panel/account-settings")}
                    >
                        <UserRoundCog className="h-5 w-5" />
                        <span className={sidebarClasses.itemText}>Account Settings</span>
                    </Button>

                    <Button
                        onClick={logout}
                        className={`p-2 ${sidebarClasses.menuItem} ${sidebarClasses.logout}`}
                    >
                        <LogOut className="h-5 w-5 text-errorRed" />
                        <span className={sidebarClasses.itemText}>Sign Out</span>
                    </Button>
                </ul>
                <div className={sidebarClasses.footer}>
                    <p className="text-center text-xl text-titles">Hello {user?.contactName}</p>
                </div>
            </aside>
        </div>
    );
};

export default DesktopSidebar;