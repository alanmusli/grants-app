import React, { useState, useEffect } from 'react';
import { applicationApi } from '../../api/applicationApi';

export default function PaymentTracker() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const response = await applicationApi.getApplications();
                // CRITICAL: Finance should only see APPROVED applications!
                const approvedApps = response.data.filter(app => app.status === 'одобрено');
                setApplications(approvedApps);
            } catch (err) {
                console.error("Грешка при вчитување", err);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    // Placeholder function for prototype interactivity
    const handlePayment = (id, type) => {
        alert(`Успешно запишан ${type} за апликација #${id}`);
    };

    // Filter by search bar input (Applicant Name or Conference)
    const filteredApps = applications.filter(app => 
        app.applicant?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        app.conference?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Simple Date Formatter
    const formatDate = (dateString) => {
        if (!dateString) return 'Непознат датум';
        return new Date(dateString).toLocaleDateString('mk-MK');
    };

    if (loading) return <div className="p-8 text-gray-500">Се вчитува...</div>;

    return (
        <div className="max-w-6xl mx-auto mt-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                
                {/* Header & Search Bar */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-xl font-bold text-[#003366]">Исплати и Рефундации</h2>
                    <div className="w-full md:w-72">
                        <input 
                            type="text" 
                            placeholder="Пребарувај апликант или конференција..." 
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#003366] focus:outline-none transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                
                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm">
                            <tr>
                                <th className="p-4">Апликант</th>
                                <th className="p-4">Конференција</th>
                                <th className="p-4">Датум на одобрување</th>
                                <th className="p-4">Проценети трошоци</th>
                                <th className="p-4 text-right">Акции</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredApps.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-gray-800">{app.applicant}</td>
                                    <td className="p-4">{app.conference?.name}</td>
                                    <td className="p-4">{formatDate(app.createdAt)}</td>
                                    <td className="p-4 font-mono font-medium text-gray-900">{app.estimatedCosts} МКД</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button 
                                            onClick={() => handlePayment(app.id, 'Аванс')}
                                            className="text-sm bg-blue-50 text-blue-700 border border-blue-200 font-semibold px-3 py-1.5 rounded hover:bg-blue-100 transition"
                                        >
                                            Запиши Аванс
                                        </button>
                                        <button 
                                            onClick={() => handlePayment(app.id, 'Рефундација')}
                                            className="text-sm bg-green-50 text-green-700 border border-green-200 font-semibold px-3 py-1.5 rounded hover:bg-green-100 transition"
                                        >
                                            Рефундација
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            
                            {/* Empty States */}
                            {filteredApps.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        {applications.length === 0 
                                            ? "Нема одобрени апликации кои чекаат на исплата." 
                                            : "Нема резултати од пребарувањето."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}