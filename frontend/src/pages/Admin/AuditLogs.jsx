import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import DataTable from '../../components/ui/DataTable';
import { formatDate } from '../../utils/formatters';

export default function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get('/admin/audit-logs');
                setLogs(response.data);
            } catch (err) {
                setError('Неуспешно вчитување на ревизорската трага.');
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const columns = [
        { header: 'Датум и Време', accessor: 'createdAt', render: (row) => formatDate(row.createdAt) },
        { header: 'Акција', accessor: 'actionType' },
        { header: 'Корисник', accessor: 'userId' },
        { header: 'IP Адреса', accessor: 'ipAddress' },
        { header: 'Детали', accessor: 'actionDetails' }
    ];

    if (loading) return <div>Се вчитува...</div>;
    if (error) return <div className="error-text">{error}</div>;

    return (
        <div className="admin-page">
            <h2>Ревизорска Трага (Audit Logs)</h2>
            <p>Преглед на сите системски активности. Податоците постари од 90 дена се автоматски избришани.</p>
            <DataTable columns={columns} data={logs} searchable={true} />
        </div>
    );
}