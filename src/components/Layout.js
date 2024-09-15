import "../css/App.css"
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
import {Outlet} from "react-router-dom";


const Layout = ({ children }) => (
    <div className="app">
        <NavigationBar/>
        <div className="wrapper">
            {children}
            <Outlet/>
        </div>
        <Footer/>

    </div>
);

export default Layout;
