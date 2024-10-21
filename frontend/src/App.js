// ייבוא קובץ העיצוב הכללי של האפליקציה
import './css/App.css';
import React from 'react';
// ייבוא ה-Router ו-Routes לניווט בין דפי האפליקציה
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// ייבוא קומפוננטות של דפי האפליקציה
import LandingPage from './components/Pages/LandingPage';
import ContactForm from './components/Forms/ContactForm/ContactForm';
import Auth from './components/Pages/Auth';
import Layout from "./components/Layouts/Layout";
// פונקציה המאפשרת גלילה אוטומטית לראש הדף בעת שינוי דף
import ScrollToTop from './components/functions/UI/ScrollToTop';
// ייבוא קומפוננטות של דשבורד המנהל
import Dashboard from "./components/AdminPanel/Dashboard/Dashboard";
import DailySalesReport from "./components/AdminPanel/DailySalesReport/dailySalesReport";
import LeftoverReport from "./components/AdminPanel/LeftoverReport/LeftoverReport";
import PriceQuote from "./components/AdminPanel/PriceQuote/PriceQuote";
import InventoryManagement from "./components/AdminPanel/InventoryManagement/InventoryManagement";
// קומפוננטת הגנה על נתיבים (Routes) הדורשים הרשאות מיוחדות
import ProtectedRoute from "./Routs/ProtectedRoute";
// ספק ההקשר של המשתמש, מנהל נתוני המשתמש ברחבי האפליקציה
import {UserProvider} from "./Contexts/UserContext";
import {AuthProvider} from "./Contexts/AuthContext";
import {GuestRoute} from "./Routs/GuestRoute";

const App = () => {
    return (
        <div className="App">
            {/* עוטפים את כל האפליקציה ב-BrowserRouter כדי לנהל את הניווט בין הדפים */}
            <BrowserRouter>
                {/* מספק את מצב חיבור המשתמש לכל הקומפוננטות שדורשות אותו */}
                <AuthProvider>
                    {/* מספק את הנתונים המשתמש לכל הקומפוננטות שדורשות אותו */}
                    <UserProvider>
                        {/* גלילה אוטומטית לראש הדף כאשר הנתיב משתנה */}
                        <ScrollToTop />
                        {/* הגדרת הנתיבים של האפליקציה */}
                        <Routes>
                            {/* נתיב שורש, כולל פריסה כללית ודפים ראשיים */}
                            <Route path="/" element={<Layout pageType="default" />}>
                                {/* הדף הראשי (Landing Page) */}
                                <Route index element={<LandingPage />} />
                                {/* דף יצירת קשר */}
                                <Route path="contact" element={<ContactForm />} />

                                {/* נתיב ההתחברות / הרשמה שמוגבל למשתמשים לא מחוברים בלבד */}
                                <Route element={<GuestRoute/>}>
                                    <Route path="auth" element={<Auth />} />
                                </Route>
                            </Route>

                            {/* ניהול פאנל המנהלים, מוגן על ידי ProtectedRoute */}
                            <Route path="admin-panel" element={
                                // הגנה על הגישה לפאנל המנהלים, מאשר גם גישת אורחים
                                <ProtectedRoute allowGuest={false} element={<Layout pageType="admin-panel" />} />
                            }>
                                {/* דף דשבורד */}
                                <Route index element={<Dashboard />} />
                                {/* דוח מכירות יומי */}
                                <Route path="sales-report" element={<DailySalesReport />} />
                                {/* דוח שאריות */}
                                <Route path="leftover-report" element={<LeftoverReport />} />
                                {/* ניהול מלאי */}
                                <Route path="inventory-management" element={<InventoryManagement />} />
                                {/* בקשת הצעת מחיר */}
                                <Route path="request-quote" element={<PriceQuote />} />
                            </Route>
                        </Routes>
                    </UserProvider>
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
};

export default App;
