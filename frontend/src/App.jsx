import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Import our new unified Tailwind Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import Gateway from './pages/Auth/Gateway';
import ScientistDashboard from './pages/Scientist/Dashboard';
import GrantApplication from './pages/Scientist/GrantApplication';
import PostTravelReport from './pages/Scientist/PostTravelReport';
import ApplicationList from './pages/Dekanat/ApplicationList';
import ApplicationReview from './pages/Dekanat/ApplicationReview';
import BudgetOverview from './pages/Finance/BudgetOverview';
import PaymentTracker from './pages/Finance/PaymentTracker';
import RuleConfig from './pages/Admin/RuleConfig';
import AuditLogs from './pages/Admin/AuditLogs';

/**
 * A wrapper component that enforces Role-Based Access Control on routes.
 * If a user doesn't have the right role, they are redirected.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Се вчитува...</div>;
    
    // If not logged in, send to the Gateway
    if (!user) return <Navigate to="/" replace />;
    
    // If logged in but lacks the correct role, send to their default dashboard
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public / Unauthenticated Route */}
                    <Route path="/" element={<Gateway />} />

                    {/* Scientist Routes (Professors/Assistants) */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute allowedRoles={['Научник']}>
                            <MainLayout title="Добредојдовте назад, Проф."><ScientistDashboard /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/apply" element={
                        <ProtectedRoute allowedRoles={['Научник']}>
                            <MainLayout title="Поднеси Нова Апликација"><GrantApplication /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/report" element={
                        <ProtectedRoute allowedRoles={['Научник']}>
                            <MainLayout title="Прикачи Финансиски Извештај"><PostTravelReport /></MainLayout>
                        </ProtectedRoute>
                    } />

                    {/* Dean's Office (Dekanat) Routes */}
                    <Route path="/dekanat/applications" element={
                        <ProtectedRoute allowedRoles={['Деканат']}>
                            <MainLayout title="Листа на Апликации"><ApplicationList /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/dekanat/applications/:id" element={
                        <ProtectedRoute allowedRoles={['Деканат']}>
                            <MainLayout title="Детали за Апликација"><ApplicationReview /></MainLayout>
                        </ProtectedRoute>
                    } />

                    {/* Finance Department Routes */}
                    <Route path="/finance/budget" element={
                        <ProtectedRoute allowedRoles={['Финансии']}>
                            <MainLayout title="Преглед на Буџет"><BudgetOverview /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/finance/payments" element={
                        <ProtectedRoute allowedRoles={['Финансии']}>
                            <MainLayout title="Следење на Исплати"><PaymentTracker /></MainLayout>
                        </ProtectedRoute>
                    } />

                    {/* System Administrator Routes */}
                    <Route path="/admin/rules" element={
                        <ProtectedRoute allowedRoles={['Администратор']}>
                            <MainLayout title="Системски Правила"><RuleConfig /></MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/logs" element={
                        <ProtectedRoute allowedRoles={['Администратор']}>
                            <MainLayout title="Ревизорски Логови"><AuditLogs /></MainLayout>
                        </ProtectedRoute>
                    } />

                    {/* Fallback for unknown routes */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}