import React, { useState, useEffect } from 'react';
import { applicationApi } from '../../api/applicationApi';
import { formatCurrencyMKD, formatDate } from '../../utils/formatters';

export default function ScientistDashboard() {
    const [applications, setApplications] = useState([]);
    
    // NEW: State for handling the Bank Account edit feature
    const [bankAccount, setBankAccount] = useState('210-*******-89');
    const [isEditingAccount, setIsEditingAccount] = useState(false);

    useEffect(() => {
        const fetchMyApps = async () => {
            try {
                const response = await applicationApi.getApplications();
                setApplications(response.data);
            } catch (err) {
                console.error("Error fetching applications", err);
            }
        };
        fetchMyApps();
    }, []);

    const renderStatus = (status) => {
        if (status === 'одобрено') return <span className="font-bold text-green-600">Одобрено</span>;
        if (status === 'во разгледување') return <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase">Во Процедура</span>;
        if (status === 'одбиено') return <span className="font-bold text-red-600">Одбиено</span>;
        return <span>{status}</span>;
    };

    // Handler to save the new bank account number
    const handleSaveAccount = () => {
        // In a real app, you would send this to the backend API here
        setIsEditingAccount(false);
        alert("Сметката е успешно ажурирана!");
    };

    return (
        <>
            {/* ТРИ КАРТИЧКИ (TOP ROW) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Буџет Картичка */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 uppercase font-bold">Годишен Буџет</p>
                    <p className="text-3xl font-bold text-gray-900">120.000 МКД</p>
                    <div className="mt-4 h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <p className="text-xs mt-2 text-gray-400">Преостанати: 42.000 МКД</p>
                </div>

                {/* Последна Апликација */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <p className="text-sm text-gray-500 uppercase font-bold">Последен Статус</p>
                        <p className="text-xl font-bold text-gray-900 mt-1 truncate">
                            {applications.length > 0 ? applications[0].conference?.name : 'Нема активни'}
                        </p>
                        <div className="mt-2">
                            {applications.length > 0 ? renderStatus(applications[0].status) : '-'}
                        </div>
                    </div>
                    {applications.length > 0 && applications[0].justification && (
                        <div className="mt-3 p-2 bg-gray-50 border border-gray-100 rounded text-sm text-gray-600 italic">
                            "{applications[0].justification}"
                        </div>
                    )}
                </div>

                {/* Трансакциска сметка - NOW INTERACTIVE! */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <p className="text-sm text-gray-500 uppercase font-bold">Активна Сметка</p>
                        
                        {isEditingAccount ? (
                            <input 
                                type="text"
                                className="mt-2 w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#003366]"
                                value={bankAccount}
                                onChange={(e) => setBankAccount(e.target.value)}
                                autoFocus
                            />
                        ) : (
                            <p className="text-lg font-mono text-gray-700 mt-2">{bankAccount}</p>
                        )}
                    </div>
                    
                    {isEditingAccount ? (
                        <div className="mt-3 flex gap-2">
                            <button 
                                onClick={handleSaveAccount}
                                className="text-xs bg-[#003366] text-white px-3 py-1.5 rounded-md hover:bg-[#002244] transition font-bold"
                            >
                                Зачувај
                            </button>
                            <button 
                                onClick={() => setIsEditingAccount(false)}
                                className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-200 transition font-bold"
                            >
                                Откажи
                            </button>
                        </div>
                    ) : (
                        <p 
                            onClick={() => setIsEditingAccount(true)}
                            className="text-xs text-blue-600 cursor-pointer mt-3 underline hover:text-blue-800 transition w-fit"
                        >
                            Промени податоци
                        </p>
                    )}
                </div>
            </div>

            {/* ТАБЕЛА ЗА АКТИВНОСТИ */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 font-bold">Скорешни Конференции</div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm">
                        <tr>
                            <th className="p-4">Наслов на труд</th>
                            <th className="p-4">Конференција</th>
                            <th className="p-4">Датум</th>
                            <th className="p-4">Статус</th>
                            <th className="p-4">Забелешка</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {applications.map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium">{app.paper?.title || 'N/A'}</td>
                                <td className="p-4">{app.conference?.name || 'N/A'}</td>
                                <td className="p-4">{formatDate(app.createdAt) || '-'}</td>
                                <td className="p-4">{renderStatus(app.status)}</td>
                                <td className="p-4 text-sm text-gray-600 italic max-w-[200px] truncate" title={app.justification}>
                                    {app.justification || '-'}
                                </td>
                            </tr>
                        ))}
                        {applications.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">Немате поднесено апликации до сега.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}