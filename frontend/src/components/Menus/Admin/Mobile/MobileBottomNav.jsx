import Button from "../../../Common/Button/Button";
import { LayoutDashboard, FileText, Trash2, Warehouse, DollarSign, LogOut, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const MobileBottomNav = () => {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);
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
            setIsVisible(true); // Show navigation when the route changes
        };
        handleRouteChange();
        return () => {
            setIsVisible(false); // Hide navigation when the component unmounts
        };
    }, [location]);

    return (
        <div className={`fixed bottom-0 left-0 right-0 bg-secondary z-50 transition-transform duration-300 ease-in-out transform ${isVisible ? "translate-y-0" : "translate-y-full"}`}>
            <div className="flex bg-white items-center justify-center mb-2 p-2 text-titles ">
                <ChevronDown className="h-6 w-6 " />
                <span className="text-lg font-semibold mx-2">Menu</span>
            </div>
            <div className="flex flex-col gap-2 justify-center p-2"> {/* Set gap between buttons here */}
                {menuItems.map((item, index) => (
                    <Button
                        key={index}
                        to={item.href}
                        className={`flex flex-col items-center text-center  shadow-none  ${
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
    );
};

export default MobileBottomNav;
