import { LayoutDashboard, FileText, Trash2, Warehouse, DollarSign, LogOut, CircleChevronDown, CircleChevronUp ,SquareMenu} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../../../Common/Button/Button";

const MobileBottomNav = () => {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);
    const toggleBottomMenu = () => setIsVisible(!isVisible);
    const iconSize = "h-7 w-7";
    const menuItems = [
        { id: "home", name: "Home", icon: <LayoutDashboard className={`${iconSize} text-titles`} />, href: "/admin-panel" },
        { id: "dailySalesReport", name: "Daily Sales Report", icon: <FileText className={`${iconSize} text-titles`} />, href: "/admin-panel/sales-report" },
        { id: "leftoverReport", name: "Leftover Report", icon: <Trash2 className={`${iconSize} text-titles`} />, href: "/admin-panel/leftover-report" },
        { id: "inventory", name: "Inventory Management", icon: <Warehouse className={`${iconSize} text-titles`} />, href: "/admin-panel/inventory-management" },
        { id: "priceRequest", name: "Request Price Quote", icon: <DollarSign className={`${iconSize} text-titles`} />, href: "/admin-panel/request-quote" },
        { id: "signOut", name: "Sign Out", icon: <LogOut className={`${iconSize} text-errorRed`} />, href: "/", action: "logout" },
    ];

    useEffect(() => {
        const handleRouteChange = () => {
            setIsVisible(false);
        };
        handleRouteChange();
    }, [location]);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[transparent] z-50">
            <div className="flex flex-col  items-center justify-center text-titles">
                <button
                    className="flex  items-center bg-secondary rounded-t-2xl  justify-center px-4 py-2 w-fit"
                    onClick={toggleBottomMenu}
                    aria-expanded={isVisible}
                    aria-controls="mobile-menu"
                >
                    {isVisible ? <CircleChevronDown className="h-6 w-6 "/> : <CircleChevronUp className="  h-6 w-6"/>}
                    <span className="text-lg font-semibold mx-2">Menu</span>
                </button>
            </div>
            <div
                id="mobile-menu"
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isVisible ? 'max-h-[500px]' : 'max-h-0'
                }`}
            >
                <div className="flex flex-col gap-2  bg-base  justify-center p-2">
                    {menuItems.map((item, index) => (
                        <Button
                            key={index}
                            to={item.href}
                            className={`flex flex-col items-center text-center shadow-none ${
                                location.pathname === item.href ? "bg-base border-2 border-lime text-buttons" : "border-2 border-[transparent]"
                            }`}
                        >
                            {item.icon}
                            <span className={`text-sm ${item.name === "Sign Out" ? 'text-errorRed' : 'text-titles'}`}>
                                {item.name}
                            </span>
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MobileBottomNav;