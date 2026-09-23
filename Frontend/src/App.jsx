import React from 'react';
import { Routes, Route } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import AdminRoute from './components/auth/AdminRoute.jsx';
import { ROUTES } from './constants/routes.js';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import VerifyOtp from './pages/VerifyOtp.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Resumes from './pages/Resumes.jsx';
import ResumeDetail from './pages/ResumeDetail.jsx';
import ResumeBuilder from './pages/ResumeBuilder.jsx';
import MockInterview from './pages/MockInterview.jsx';
import JobAnalyses from './pages/JobAnalyses.jsx';
import AnalyzeJob from './pages/AnalyzeJob.jsx';
import JobAnalysisDetail from './pages/JobAnalysisDetail.jsx';
import Optimize from './pages/Optimize.jsx';
import CoverLetter from './pages/CoverLetter.jsx';
import GitHubImport from './pages/GitHubImport.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminLogs from './pages/AdminLogs.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Toaster
                    position="top-center"
                    toastOptions={{
                        style: {
                            background: '#14161A',
                            color: '#FFFFFF',
                            fontSize: '13px',
                            fontWeight: 500,
                            border: '2px solid #14161A',
                            borderRadius: '999px',
                            padding: '10px 16px'
                        },
                        success: { iconTheme: { primary: '#D7FA3B', secondary: '#14161A' } }
                    }}
                />
                <Routes>
                    <Route path={ROUTES.HOME} element={<Landing />} />
                    <Route path={ROUTES.LOGIN} element={<Login />} />
                    <Route path={ROUTES.REGISTER} element={<Register />} />
                    <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtp />} />
                    <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
                    <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                        <Route path={ROUTES.RESUMES} element={<Resumes />} />
                        <Route path={ROUTES.RESUME_DETAIL} element={<ResumeDetail />} />
                        <Route path={ROUTES.BUILDER} element={<ResumeBuilder />} />
                        <Route path={ROUTES.MOCK_INTERVIEW} element={<MockInterview />} />
                        <Route path={ROUTES.JOB_ANALYSES} element={<JobAnalyses />} />
                        <Route path={ROUTES.ANALYZE_JOB} element={<AnalyzeJob />} />
                        <Route path={ROUTES.JOB_ANALYSIS_DETAIL} element={<JobAnalysisDetail />} />
                        <Route path={ROUTES.OPTIMIZE} element={<Optimize />} />
                        <Route path={ROUTES.COVER_LETTER} element={<CoverLetter />} />
                        <Route path={ROUTES.GITHUB_IMPORT} element={<GitHubImport />} />

                        <Route element={<AdminRoute />}>
                            <Route path={ROUTES.ADMIN} element={<AdminDashboard />} />
                            <Route path={ROUTES.ADMIN_USERS} element={<AdminUsers />} />
                            <Route path={ROUTES.ADMIN_LOGS} element={<AdminLogs />} />
                        </Route>
                    </Route>

                    <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </ThemeProvider>
    );
}
