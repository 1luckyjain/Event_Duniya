// src/pages/Logout.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/auth-context';

const Logout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>("Logging out...");
  
  useEffect(() => {
    const performLogout = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://eventduniya-server.onrender.com';
        
        // Get any stored token from localStorage
        const token = localStorage.getItem('token');
        
        // Set up request config with proper credentials and headers
        const config = {
          withCredentials: true,
          validateStatus: (status) => true, // Accept any status code
          headers: token ? { 
            Authorization: `Bearer ${token}`,
          } : {}
        };
        
        const response = await axios.post(`${API_URL}/api/auth/logout`, {}, config);
        
        console.log('Logout response:', response.status, response.data);
        
        // Both 200 and 204 are successful status codes
        if (response.status === 200 || response.status === 204) {
          setStatus("Successfully logged out from server");
        } else {
          setStatus(`Server responded with status ${response.status}`);
        }
      } catch (error) {
        console.error('Logout API error:', error);
        setStatus('Network error during logout, but logged out locally');
      } finally {
        // Always perform client-side logout regardless of API success
        logout();
        // Short delay to ensure logout state is updated before navigation
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 500); // Slightly longer delay to show status message
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">
        {status}
      </div>
    </div>
  );
};

export default Logout;
