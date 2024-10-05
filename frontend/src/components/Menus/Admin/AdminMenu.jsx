import React, { useEffect, useState } from 'react';

import DesktopSidebar from './Desktop/DesktopSidebar';
import MobileBottomNav from './Mobile/MobileBottomNav';
import MobileNavbar from "../Website/Mobile/MobileNavbar";


const AdminMenu = ({ isOpen, setIsOpen }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <nav className={``}>
            {isMobile ? (
                <MobileBottomNav/>
            ) : (
                <DesktopSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            )}
        </nav>
    );
};

export default AdminMenu;
