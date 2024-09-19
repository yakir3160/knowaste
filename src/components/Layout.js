import "../css/App.css";  // You can remove this if all styles are converted to Tailwind
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = ({ children, pageType }) => (
    <div className="min-h-screen flex flex-col">
        <NavigationBar />
        <main
            className={` flex-1 flex flex-col items-center max-w-7xl w-full mx-auto ${pageType !== 'dashboard' ? 'pt-[150px] px-4 sm:px-6 lg:px-8' : 'pt-[150px] px-10  max-w-none'}`}
        >
            {children}
            <Outlet />
        </main>
        <Footer />
    </div>
);

export default Layout;
