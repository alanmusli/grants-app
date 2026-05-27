import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { AuthContext } from '../../context/AuthContext';

export default function Gateway() {
    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleMockLogin = async (role) => {
        try {
            // 1. Send the mock login request to the backend
            const response = await api.post('/auth/mock-login', { role });
            
            // 2. Immediately update React's global state (NO hard page reload!)
            dispatch({ type: 'LOGIN', payload: response.data.user });
            
            // 3. Smoothly redirect to the correct dashboard based on the chosen role
            if (role === 'Деканат') {
                navigate('/dekanat/applications');
            } else if (role === 'Финансии') {
                navigate('/finance/budget');
            } else if (role === 'Администратор') {
                navigate('/admin/rules');
            } else {
                navigate('/dashboard'); // Default Scientist Dashboard
            }
        } catch (error) {
            console.error("Mock login failed", error);
            alert("Грешка при најава. Проверете ја конзолата.");
        }
    };

    return (
        <div className="gateway-container" style={styles.container}>
            <div className="gateway-card" style={styles.card}>
                <h2>STGS - ФИНКИ</h2>
                <p>Систем за управување со грантови за научни патувања</p>
                
                <div style={styles.devBox}>
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
                        * PROTOTYPE MODE: Изберете улога за тестирање *
                    </p>
                    <button onClick={() => handleMockLogin('Научник')} style={{...styles.button, backgroundColor: '#007bff'}}>Најава како Научник</button>
                    <button onClick={() => handleMockLogin('Деканат')} style={{...styles.button, backgroundColor: '#6f42c1'}}>Најава како Деканат</button>
                    <button onClick={() => handleMockLogin('Финансии')} style={{...styles.button, backgroundColor: '#28a745'}}>Најава како Финансии</button>
                    <button onClick={() => handleMockLogin('Администратор')} style={{...styles.button, backgroundColor: '#dc3545'}}>Најава како Администратор</button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6' },
    card: { padding: '40px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center', width: '400px' },
    devBox: { marginTop: '30px', padding: '20px', border: '2px dashed #ccc', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px' },
    button: { padding: '10px 20px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }
};