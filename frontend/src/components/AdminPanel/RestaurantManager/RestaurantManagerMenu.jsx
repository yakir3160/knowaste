import React from 'react';
import Button from "../../Common/Button/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText, Trash2, DollarSign } from "lucide-react";
import { sidebarClasses } from "../../Menus/Admin/Desktop/sidebarClasses";
import {buttonClass} from "../../Menus/Admin/Mobile/mobileBottomNavStyle";

export const RestaurantManagerMenu = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <>
            <Button
                onClick={() => navigate("/admin-panel/sales-report")}
                className={`p-2 ${sidebarClasses.menuItem} ${location.pathname === "/admin-panel/sales-report" ? "bg-base border-2 border-lime text-buttons pl-2" : "border-2 border-[transparent]"}`}
            >
                <FileText className="h-5 w-5" />
                <span className={sidebarClasses.itemText}>Daily Sales Report</span>
            </Button>
            <Button
                onClick={() => navigate("/admin-panel/leftover-report")}
                className={`p-2  ${location.pathname === "/admin-panel/leftover-report" ? "bg-base border-2 border-lime text-buttons pl-2" : "border-2 border-[transparent]"}`}
            >
                <Trash2 className="h-5 w-5" />
                <span className={sidebarClasses.itemText}>Leftover Report</span>
            </Button>
            <Button
                onClick={() => navigate("/admin-panel/request-quote")}
                className={`p-2 ${sidebarClasses.menuItem} ${location.pathname === "/admin-panel/request-quote" ? "bg-base border-2 border-lime text-buttons pl-2" : "border-2 border-[transparent]"}`}
            >
                <DollarSign className="h-5 w-5" />
                <span className={sidebarClasses.itemText}>Request Price Quote</span>
            </Button>
        </>
    );
};
