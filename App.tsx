
import React, { useState, useEffect, useCallback } from 'react';
import { AuthWrapper } from './components/AuthWrapper';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Artemo AI Dashboard</h1>
                <p className="text-gray-600">Loading...</p>
            </div>
        </div>
    );
};

export default App;
