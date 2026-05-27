import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationApi } from '../../api/applicationApi';
import { formatCurrencyMKD, formatDate } from '../../utils/formatters';

export default function ApplicationList() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                // Fetch the REAL data from the backend
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

    const renderStatus = (status) => {
        if (status === 'одобрено') return <span className="font-bold text-green-600">Одобрено</span>;
        if (status === 'во разгледување') return <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase">Во Процедура</span>;
        if (status === 'одбиено') return <span className="font-bold text-red-600">Одбиено</span>;
        return <span>{status}</span>;
    };

    if (loading) return <div className="p-8 text-gray-500">Се вчитува...</div>;

    return (
        <div className="max-w-6xl mx-auto mt-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[#003366]">Сите Апликации за Грант</h2>
                    <span className="text-sm text-gray-500 border border-gray-200 px-3 py-1 rounded-full">
                        Вкупно: {applications.length}
                    </span>
                </div>
                
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm">
                        <tr>
                            <th className="p-4">Апликант</th>
                            <th className="p-4">Конференција</th>
                            <th className="p-4">Датум</th>
                            <th className="p-4">Статус</th>
                            <th className="p-4 text-right">Акција</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {applications.map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-bold text-gray-800">{app.applicant}</td>
                                <td className="p-4">{app.conference?.name}</td>
                                <td className="p-4">{formatDate(app.createdAt) || '-'}</td>
                                <td className="p-4">{renderStatus(app.status)}</td>
                                <td className="p-4 text-right">
                                    {/* This is the crucial part that generates the CORRECT dynamic ID link */}
                                    <Link 
                                        to={`/dekanat/applications/${app.id}`}
                                        className="text-sm bg-[#003366] text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition"
                                    >
                                        Прегледај
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {applications.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">
                                    Нема активни апликации во системот.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}