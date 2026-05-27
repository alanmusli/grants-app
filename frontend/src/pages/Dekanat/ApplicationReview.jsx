import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationApi } from '../../api/applicationApi';

export default function ApplicationReview() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [justification, setJustification] = useState('');

    useEffect(() => {
        const fetchApp = async () => {
            try {
                const response = await applicationApi.getApplicationById(id);
                setApplication(response.data);
            } catch (err) {
                console.error("Грешка при вчитување", err);
            } finally {
                setLoading(false);
            }
        };
        fetchApp();
    }, [id]);

    const handleAction = async (newStatus) => {
        try {
            await applicationApi.updateStatus(id, newStatus, justification);
            alert(`Апликацијата е ${newStatus.toUpperCase()}`);
            navigate('/dekanat/applications'); // Go back to the list
        } catch (err) {
            alert("Грешка при ажурирање.");
        }
    };

    if (loading) return <div className="p-8 text-gray-500">Се вчитува...</div>;
    if (!application) return <div className="p-8 text-red-500">Апликацијата не е пронајдена. (Можеби серверот се рестартираше)</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 mt-4">
            {/* Details Card */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-[#003366]">Детали за Апликација #{application.id}</h2>
                    <span className="px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-bold uppercase">
                        {application.status}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase">Апликант</p>
                        <p className="text-lg text-gray-900">{application.applicant}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase">Конференција</p>
                        <p className="text-lg text-gray-900">{application.conference?.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase">Наслов на труд</p>
                        <p className="text-lg text-gray-900">{application.paper?.title}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase">Дестинација</p>
                        <p className="text-lg text-gray-900">{application.destination}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase">Датум</p>
                        <p className="text-lg text-gray-900">{application.travelDate}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase">Проценети Трошоци</p>
                        <p className="text-lg font-bold text-gray-900">{application.estimatedCosts} МКД</p>
                    </div>
                </div>
            </div>

            {/* Action Card (Dean's Controls) */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Одлука на Деканат</h3>
                <textarea 
                    className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-[#003366] focus:outline-none mb-4"
                    rows="3"
                    placeholder="Внесете образложение (задолжително при одбивање)..."
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                ></textarea>
                
                <div className="flex gap-4">
                    <button 
                        onClick={() => handleAction('одобрено')}
                        className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
                    >
                        ✓ Одобри Грант
                    </button>
                    <button 
                        onClick={() => handleAction('одбиено')}
                        className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition"
                    >
                        ✕ Одбиј Грант
                    </button>
                </div>
            </div>
        </div>
    );
}