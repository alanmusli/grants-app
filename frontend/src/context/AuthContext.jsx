import React, { createContext, useReducer, useEffect } from 'react';
import { authApi } from '../api/authApi';

// Create the context
export const AuthContext = createContext();

// Reducer to manage authentication state transitions
const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload, loading: false };
        case 'LOGOUT':
            return { user: null, loading: false };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { 
        user: null, 
        loading: true 
    });

    useEffect(() => {
        // Automatically verify the CAS session cookie with the backend on app load
        const verifySession = async () => {
            try {
                const response = await authApi.getCurrentUser();
                dispatch({ type: 'LOGIN', payload: response.data });
            } catch (error) {
                // If unauthorized or session expired, clear state
                // (The axios interceptor handles the actual redirect to CAS)
                dispatch({ type: 'LOGOUT' });
            }
        };

        verifySession();
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {/* Render children only after the initial session check resolves */}
            {!state.loading ? children : <div className="loading-spinner">Се вчитува...</div>}
        </AuthContext.Provider>
    );
};