import { useEffect, useState } from 'react';
import { resetAuthExpiredNotification } from './config/axios/axiosConfig';
import AppRoutes from './routes/AppRoutes';
import AuthExpiredModal from './shared/components/AuthExpiredModal';

export default function App() {
  const [authExpiredMessage, setAuthExpiredMessage] = useState('');

  useEffect(() => {
    const handleAuthExpired = (event) => {
      setAuthExpiredMessage(event.detail?.message || 'Phien dang nhap da het han. Vui long dang nhap lai.');
    };

    window.addEventListener('auth-expired', handleAuthExpired);

    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, []);

  const handleAuthExpiredConfirm = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    resetAuthExpiredNotification();
    setAuthExpiredMessage('');
    window.location.replace('/login');
  };

  return (
    <>
      <AppRoutes />
      {authExpiredMessage && (
        <AuthExpiredModal
          message={authExpiredMessage}
          onConfirm={handleAuthExpiredConfirm}
        />
      )}
    </>
  );
}
