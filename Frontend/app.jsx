import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import store from './store';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';

// Layout Components
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOTP from './pages/auth/VerifyOTP';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import ResumeUpload from './pages/ResumeUpload';
import JobOptimizer from './pages/JobOptimizer';
import AnalysisResult from './pages/AnalysisResult';
import ResumeHistory from './pages/ResumeHistory';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminResumes from './pages/admin/AdminResumes';

// Components
import { LoadingProvider } from './context/LoadingContext';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
        },
    },
});

function App() {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                    <AuthProvider>
                        <LoadingProvider>
                            <Router>
                                <Toaster
                                    position="top-right"
                                    toastOptions={{
                                        duration: 4000,
                                        style: {
                                            background: '#363636',
                                            color: '#fff',
                                        },
                                        success: {
                                            duration: 3000,
                                            iconTheme: {
                                                primary: '#4ade80',
                                                secondary: '#fff',
                                            },
                                        },
                                        error: {
                                            duration: 4000,
                                            iconTheme: {
                                                primary: '#ef4444',
                                                secondary: '#fff',
                                            },
                                        },
                                    }}
                                />
                                <Routes>
                                    {/* Public Routes */}
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/verify-otp" element={<VerifyOTP />} />
                                    <Route path="/forgot-password" element={<ForgotPassword />} />
                                    <Route path="/reset-password" element={<ResetPassword />} />

                                    {/* Protected Routes */}
                                    <Route element={<PrivateRoute />}>
                                        <Route element={<Layout />}>
                                            <Route path="/" element={<Navigate to="/dashboard" />} />
                                            <Route path="/dashboard" element={<Dashboard />} />
                                            <Route path="/resume/new" element={<ResumeBuilder />} />
                                            <Route path="/resume/upload" element={<ResumeUpload />} />
                                            <Route path="/resume/:id/edit" element={<ResumeBuilder />} />
                                            <Route path="/resume/history" element={<ResumeHistory />} />
                                            <Route path="/optimize/:resumeId" element={<JobOptimizer />} />
                                            <Route path="/analysis/:analysisId" element={<AnalysisResult />} />
                                        </Route>
                                    </Route>

                                    {/* Admin Routes */}
                                    <Route element={<AdminRoute />}>
                                        <Route element={<AdminLayout />}>
                                            <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
                                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                                            <Route path="/admin/users" element={<AdminUsers />} />
                                            <Route path="/admin/resumes" element={<AdminResumes />} />
                                        </Route>
                                    </Route>

                                    <Route path="*" element={<Navigate to="/" />} />
                                </Routes>
                            </Router>
                        </LoadingProvider>
                    </AuthProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </Provider>
    );
}

export default App;