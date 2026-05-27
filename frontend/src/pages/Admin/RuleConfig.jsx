import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

export default function RuleConfig() {
    const [budgetLimit, setBudgetLimit] = useState(100000);
    const [perDiemRates, setPerDiemRates] = useState({ "MKD": 1500, "DEFAULT": 3000 });
    const [message, setMessage] = useState('');

    // Fetch current rules on mount
    useEffect(() => {
        const fetchRules = async () => {
            try {
                const response = await api.get('/admin/rules');
                if (response.data) {
                    setBudgetLimit(response.data.annualBudgetLimit);
                    setPerDiemRates(response.data.perDiemRates);
                }
            } catch (error) {
                console.error("Failed to load rules", error);
            }
        };
        fetchRules();
    }, []);

    const handleRateChange = (countryCode, value) => {
        setPerDiemRates(prev => ({
            ...prev,
            [countryCode]: Number(value)
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await api.put('/admin/rules', {
                rules: {
                    annualBudgetLimit: budgetLimit,
                    perDiemRates: perDiemRates
                }
            });
            setMessage('Правилата се успешно ажурирани.');
        } catch (error) {
            setMessage('Грешка при зачувување на правилата.');
        }
    };

    return (
        <div className="admin-page">
            <h2>Конфигурација на Правила</h2>
            {message && <div className="alert-message">{message}</div>}
            
            <form onSubmit={handleSave} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="form-group">
                    <label>Годишен лимит на буџет (MKD):</label>
                    <input 
                        type="number" 
                        value={budgetLimit} 
                        onChange={e => setBudgetLimit(Number(e.target.value))} 
                        required 
                    />
                </div>

                <h3>Дневници по држава (MKD)</h3>
                {Object.entries(perDiemRates).map(([code, rate]) => (
                    <div key={code} className="form-group" style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" value={code} disabled style={{ width: '100px' }} />
                        <input 
                            type="number" 
                            value={rate} 
                            onChange={e => handleRateChange(code, e.target.value)} 
                            required 
                        />
                    </div>
                ))}
                
                <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Зачувај Промени
                </button>
            </form>
        </div>
    );
}