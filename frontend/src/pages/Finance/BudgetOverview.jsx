import React, { useState, useEffect } from 'react';
import { applicationApi } from '../../api/applicationApi';

export default function BudgetOverview() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hardcoded total budget for the prototype (e.g., 5,000,000 MKD)
    const TOTAL_BUDGET = 5000000; 

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const response = await applicationApi.getApplications();
                setApplications(response.data);
            } catch (err) {
                console.error("Грешка при вчитување", err);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    // --- Dynamic Budget Calculations ---
    const calculateTotal = (status) => {
        return applications
            .filter(app => app.status === status)
            .reduce((sum, app) => sum + (parseFloat(app.estimatedCosts) || 0), 0);
    };

    const spentBudget = calculateTotal('одобрено');
    const pendingBudget = calculateTotal('во разгледување');
    const remainingBudget = TOTAL_BUDGET - spentBudget;
    const spentPercentage = ((spentBudget / TOTAL_BUDGET) * 100).toFixed(1);

    // Formatting helper
    const formatMoney = (amount) => new Intl.NumberFormat('mk-MK').format(amount) + ' МКД';

    if (loading) return <div className="p-8 text-gray-500">Се вчитува...</div>;

    return (
        <div className="max-w-6xl mx-auto mt-4 space-y-6">
            
            {/* Top Row: Budget Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 uppercase font-bold">Вкупен Буџет (2026)</p>
                    <p className="text-2xl font-bold text-[#003366] mt-2">{formatMoney(TOTAL_BUDGET)}</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 uppercase font-bold">Потрошено (Одобрено)</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">{formatMoney(spentBudget)}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 uppercase font-bold">Во Процедура</p>
                    <p className="text-2xl font-bold text-orange-500 mt-2">{formatMoney(pendingBudget)}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 uppercase font-bold">Достапен Остаток</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{formatMoney(remainingBudget)}</p>
                </div>
            </div>

            {/* Middle Row: Progress Bar */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-end mb-2">
                    <h3 className="text-lg font-bold text-gray-800">Искористеност на Буџетот</h3>
                    <span className="text-sm font-bold text-gray-500">{spentPercentage}% Потрошено</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden flex">
                    <div className="bg-green-500 h-4 transition-all duration-500" style={{ width: `${spentPercentage}%` }}></div>
                </div>
            </div>

            {/* Bottom Row: Recent Approved Expenses */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-[#003366]">Одобрени Трошоци</h3>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm">
                        <tr>
                            <th className="p-4">Апликант</th>
                            <th className="p-4">Конференција</th>
                            <th className="p-4">Датум</th>
                            <th className="p-4 text-right">Сума</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {applications.filter(app => app.status === 'одобрено').map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-bold text-gray-800">{app.applicant}</td>
                                <td className="p-4">{app.conference?.name}</td>
                                <td className="p-4">{new Date(app.createdAt).toLocaleDateString('mk-MK')}</td>
                                <td className="p-4 text-right font-mono font-medium text-green-700">
                                    {formatMoney(app.estimatedCosts)}
                                </td>
                            </tr>
                        ))}
                        {applications.filter(app => app.status === 'одобрено').length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-gray-500">
                                    Немате одобрени трошоци за прикажување.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}