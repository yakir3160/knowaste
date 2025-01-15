import React from 'react';
import { Route } from 'react-router-dom';
import Layout from "../components/Layouts/Layout";
import LandingPage from '../components/Pages/LandingPage';
import ContactForm from '../components/Forms/ContactForm';
import Auth from '../components/Pages/Auth';
import PasswordResetForm from "../components/Forms/PasswordResetForm";
import { GuestRoute } from "./ConditionalRouts/GuestRoute";

export const PublicRoutes = (
    <Route path="/" element={<Layout pageType="default" />}>
        <Route index element={<LandingPage />} />
        <Route path="contact" element={<ContactForm />} />
        <Route element={<GuestRoute />}>
            <Route path="auth" element={<Auth />} />
            <Route path="auth/password-reset-form" element={<PasswordResetForm />} />
        </Route>
    </Route>
);
