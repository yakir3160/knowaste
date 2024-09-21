import { Outlet } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";


const Layout = ({ children, pageType }) => {

    const mainContentClass = pageType === 'dashboard'
        ? 'sticky pt-[150px] px-10 max-w-none'
        : 'pt-[150px] px-4 sm:px-6 lg:px-8';

    return (
        <div className="min-h-screen flex flex-col">
            <NavigationBar />

            <main className={`flex-1 flex flex-col items-center max-w-7xl w-full mx-auto ${mainContentClass}`}>
                {children}
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default Layout;