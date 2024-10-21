import React from 'react';
import Button from "../../Common/Button/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { DollarSign } from "lucide-react";
import { sidebarClasses } from "../../Menus/Admin/Desktop/sidebarClasses";

export const SupplierMenu = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <Button
            onClick={() => navigate("/admin-panel/send-quote")}
            className={`p-2 ${sidebarClasses.menuItem} ${location.pathname === "/admin-panel/send-quote" ? "bg-base border-2 border-lime text-buttons pl-2" : "border-2 border-[transparent]"}`}
        >
            <DollarSign className="h-5 w-5" />
            <span className={sidebarClasses.itemText}>Send Price Quote</span>
        </Button>
    );
};
