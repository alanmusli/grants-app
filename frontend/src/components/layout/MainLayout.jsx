import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';

export default function MainLayout({ children, title = "Добредојдовте назад" }) {
    const { user, dispatch } = useContext(AuthContext);
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await authApi.logout();
            dispatch({ type: 'LOGOUT' });
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const isActive = (path) => location.pathname === path ? 'bg-blue-700' : 'hover:bg-blue-800';

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* 1. SIDEBAR */}
            <aside className="w-64 bg-[#003366] text-white flex flex-col">
                <div className="p-6 text-xl font-bold border-b border-blue-800">ФИНКИ Грантови</div>
                <nav className="flex-1 p-4 space-y-2">
                    {/* Scientist Links */}
                    {user?.role === 'Научник' && (
                        <>
                            <Link to="/dashboard" className={`block p-3 rounded ${isActive('/dashboard')}`}>🏠 Почетна</Link>
                            <Link to="/apply" className={`block p-3 rounded ${isActive('/apply')}`}>📝 Нова Апликација</Link>
                        </>
                    )}
                    
                    {/* Dean's Office Links */}
                    {user?.role === 'Деканат' && (
                        <Link to="/dekanat/applications" className={`block p-3 rounded ${isActive('/dekanat/applications')}`}>📂 Листа на Апликации</Link>
                    )}

                    {/* Finance Links */}
                    {user?.role === 'Финансии' && (
                        <>
                            <Link to="/finance/budget" className={`block p-3 rounded ${isActive('/finance/budget')}`}>📊 Буџет</Link>
                            <Link to="/finance/payments" className={`block p-3 rounded ${isActive('/finance/payments')}`}>💳 Исплати</Link>
                        </>
                    )}

                    {/* Admin Links */}
                    {user?.role === 'Администратор' && (
                        <>
                            <Link to="/admin/rules" className={`block p-3 rounded ${isActive('/admin/rules')}`}>⚙️ Правила</Link>
                            <Link to="/admin/logs" className={`block p-3 rounded ${isActive('/admin/logs')}`}>🛡️ Ревизија</Link>
                        </>
                    )}
                </nav>
                <div className="p-4 border-t border-blue-800 text-sm flex justify-between items-center">
                    <span>{user?.casUsername}</span>
                    <button onClick={handleLogout} className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded">Одјава</button>
                </div>
            </aside>

            {/* 2. MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* HEADER */}
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
                    <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
                    {user?.role === 'Научник' && (
                        <Link to="/apply" className="bg-[#003366] text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-900 transition-colors">
                            + Нова Апликација
                        </Link>
                    )}
                </header>

                {/* SCROLLABLE PAGE CONTENT */}
                <div className="p-8 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}