import './css/App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ContactForm from './pages/ContantForm';
import Auth from './pages/Auth';
import Layout from "./components/Layout";


const App = () => {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<LandingPage />} />
                        <Route path="contact" element={<ContactForm />} />
                        <Route path="auth" element={<Auth />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
