import { LayoutDashboard, FileText, Trash2, Warehouse, DollarSign, LogOut, CircleChevronDown, CircleChevronUp } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {useAuthContext} from "../../../../Contexts/AuthContext";

const MobileBottomNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {logout} = useAuthContext();
    const [isVisible, setIsVisible] = useState(false);

    const toggleBottomMenu = () => setIsVisible(!isVisible);
    useEffect(() => {
        const handleRouteChange = () => {
            setIsVisible(false);
        };
        handleRouteChange();
    }, [location]);

    const handleNavigation = (path) => {
        navigate(path);
    };
    const iconSize = "h-7 w-7";
    const buttonClass = (path) => `
        flex flex-col items-center text-center font-bold bg-[transparent] shadow-none
        p-3 rounded-2xl w-full 
        ${location.pathname === path ? "bg-secondary border-2 border-lime" : "border-2 border-[transparent]"}
    `;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[transparent] z-50">
            <div className="flex flex-col items-center justify-center text-titles">
                <button
                    className="flex items-center bg-secondary rounded-t-2xl justify-center px-4 py-2 w-fit"
                    onClick={toggleBottomMenu}
                    aria-expanded={isVisible}
                    aria-controls="mobile-menu"
                >
                    {isVisible ? <CircleChevronDown className="h-6 w-6" /> : <CircleChevronUp className="h-6 w-6" />}
                    <span className="text-lg font-semibold mx-2">Menu</span>
                </button>
            </div>
            <div
                id="mobile-menu"
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isVisible ? 'max-h-[500px]' : 'max-h-0'
                }`}
            >
                <div className="flex flex-col bg-white justify-center">
                    <button
                        onClick={() => handleNavigation("/admin-panel")}
                        className={buttonClass("/admin-panel")}
                    >
                        <LayoutDashboard className={`${iconSize} text-titles`} />
                        <span className="text-sm text-titles ">Home</span>
                    </button>
                    <button
                        onClick={() => handleNavigation("/admin-panel/sales-report")}
                        className={buttonClass("/admin-panel/sales-report")}
                    >
                        <FileText className={`${iconSize} text-titles`} />
                        <span className="text-sm text-titles">Daily Sales Report</span>
                    </button>
                    <button
                        onClick={() => handleNavigation("/admin-panel/leftover-report")}
                        className={buttonClass("/admin-panel/leftover-report")}
                    >
                        <Trash2 className={`${iconSize} text-titles`} />
                        <span className="text-sm text-titles">Leftover Report</span>
                    </button>
                    <button
                        onClick={() => handleNavigation("/admin-panel/inventory-management")}
                        className={buttonClass("/admin-panel/inventory-management")}
                    >
                        <Warehouse className={`${iconSize} text-titles`} />
                        <span className="text-sm text-titles">Inventory Management</span>
                    </button>
                    <button
                        onClick={() => handleNavigation("/admin-panel/request-quote")}
                        className={buttonClass("/admin-panel/request-quote")}
                    >
                        <DollarSign className={`${iconSize} text-titles`} />
                        <span className="text-sm text-titles">Request Price Quote</span>
                    </button>
                    <button
                        onClick={logout}
                        className={buttonClass("/")}
                    >
                        <LogOut className={`${iconSize} text-errorRed`} />
                        <span className="text-sm text-errorRed">Sign Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileBottomNav;