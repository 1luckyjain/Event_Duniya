import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/auth-context.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(

    <AuthProvider>
     <GoogleOAuthProvider clientId="782971334858-60n0qmgs1oiocvfpmg3rko81h2jmnc26.apps.googleusercontent.com">
       <App />
    </GoogleOAuthProvider>
  </AuthProvider>

);
