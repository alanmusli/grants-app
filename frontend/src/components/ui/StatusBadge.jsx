import React from 'react';

export default function StatusBadge({ status }) {
    let bgColor = '#e0e0e0';
    let textColor = '#333';

    switch (status) {
        case 'во разгледување':
            bgColor = '#fff3cd'; // Yellow
            textColor = '#856404';
            break;
        case 'одобрено':
            bgColor = '#d4edda'; // Green
            textColor = '#155724';
            break;
        case 'одбиено':
            bgColor = '#f8d7da'; // Red
            textColor = '#721c24';
            break;
        case 'во дополнување':
            bgColor = '#cce5ff'; // Blue
            textColor = '#004085';
            break;
        default:
            break;
    }

    const badgeStyle = {
        padding: '5px 10px',
        borderRadius: '12px',
        fontSize: '0.85em',
        fontWeight: 'bold',
        backgroundColor: bgColor,
        color: textColor,
        display: 'inline-block'
    };

    return <span style={badgeStyle}>{status.toUpperCase()}</span>;
}