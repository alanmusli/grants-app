import React, { useState } from 'react';

export default function DataTable({ columns, data, searchable = true }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter logic based on search input across all object values
    const filteredData = data.filter(row => {
        if (!searchTerm) return true;
        return Object.values(row).some(value => 
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="data-table-container">
            {searchable && (
                <div className="table-controls" style={{ marginBottom: '15px' }}>
                    <input 
                        type="text" 
                        placeholder="Пребарувај..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ padding: '8px', width: '300px' }}
                    />
                </div>
            )}
            
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                        {columns.map((col, idx) => (
                            <th key={idx} style={{ padding: '10px' }}>{col.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length > 0 ? (
                        filteredData.map((row, rowIndex) => (
                            <tr key={rowIndex} style={{ borderBottom: '1px solid #ddd' }}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} style={{ padding: '10px' }}>
                                        {/* Render custom cell if provided, otherwise raw data */}
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} style={{ padding: '20px', textAlign: 'center' }}>
                                Нема пронајдени податоци.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}