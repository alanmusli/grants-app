import React, { useState } from 'react';

export default function FileUploader({ 
    onFilesSelected, 
    maxSizeMB = 10, 
    allowedTypes = ".pdf,.docx,.jpg", 
    maxFiles = 5 
}) {
    const [error, setError] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setError('');

        if (files.length > maxFiles) {
            setError(`Можете да прикачите максимум ${maxFiles} документи.`);
            return;
        }

        const validFiles = [];
        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        files.forEach(file => {
            if (file.size > maxSizeBytes) {
                setError(`Фајлот "${file.name}" ја надминува границата од ${maxSizeMB}MB и беше отстранет.`);
            } else {
                validFiles.push(file);
            }
        });

        setSelectedFiles(validFiles);
        onFilesSelected(validFiles);
    };

    return (
        <div className="file-uploader">
            <label className="file-uploader-label">
                Прикачете документи
                <input 
                    type="file" 
                    multiple={maxFiles > 1} 
                    accept={allowedTypes} 
                    onChange={handleFileChange}
                    className="file-input"
                />
            </label>
            <small>Дозволени формати: {allowedTypes} | Макс: {maxSizeMB}MB по фајл</small>
            
            {error && <div className="error-text" style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            
            {selectedFiles.length > 0 && (
                <ul className="file-list">
                    {selectedFiles.map((f, index) => (
                        <li key={index}>{f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)</li>
                    ))}
                </ul>
            )}
        </div>
    );
}