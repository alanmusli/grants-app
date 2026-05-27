import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationApi } from '../../api/applicationApi';
import FileUploader from '../../components/forms/FileUploader';

export default function PostTravelReport() {
    const navigate = useNavigate();
    const [approvedApps, setApprovedApps] = useState([]);
    const [selectedAppId, setSelectedAppId] = useState('');
    const [reportFile, setReportFile] = useState(null);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchEligibleApps = async () => {
            try {
                const response = await applicationApi.getApplications();
                // Filter only approved applications that need reports
                const eligible = response.data.filter(app => app.status === 'одобрено');
                setApprovedApps(eligible);
            } catch (err) {
                console.error("Error fetching applications", err);
            }
        };
        fetchEligibleApps();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!selectedAppId) {
            return setError('Изберете патување за кое го поднесувате извештајот.');
        }

        if (!reportFile || reportFile.length === 0) {
            return setError('Мора да прикачите PDF извештај.');
        }

        setSubmitting(true);
        const submitData = new FormData();
        submitData.append('applicationId', selectedAppId);
        submitData.append('reportDocument', reportFile[0]); // Must be single file

        try {
            await applicationApi.submitPostTravelReport(submitData);
            alert('Извештајот е успешно поднесен.');
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Грешка при прикачување на извештајот.');
            setSubmitting(false);
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: '600px' }}>
            <h2>Поднеси Извештај за Патни Трошоци</h2>
            <p><strong>Важно:</strong> Имате рок од 48 часа по завршување на патувањето да го поднесете овој извештај.</p>
            
            {error && <div className="error-banner" style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div className="form-group">
                    <label>Изберете Одобрено Патување *</label>
                    <select 
                        value={selectedAppId} 
                        onChange={e => setSelectedAppId(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '10px' }}
                    >
                        <option value="">-- Изберете Патување --</option>
                        {approvedApps.map(app => (
                            <option key={app._id} value={app._id}>
                                {app.conference?.name} ({app.conference?.destinationCountry})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Uses FileUploader forcing the strict 20MB limit and PDF-only requirement */}
                <FileUploader 
                    onFilesSelected={setReportFile} 
                    maxSizeMB={20} 
                    allowedTypes=".pdf" 
                    maxFiles={1} 
                />
                
                <button type="submit" disabled={submitting} style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer' }}>
                    {submitting ? 'Се прикачува...' : 'Прикачи Извештај'}
                </button>
            </form>
        </div>
    );
}