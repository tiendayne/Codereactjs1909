import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('auth_user')) || {};
    } catch {
      return {};
    }
  }, []);

  const handleLogout = () => {
    if (!window.confirm('Ban co chac chan muon dang xuat khong?')) return;

    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    navigate('/login', { replace: true });
  };

  const displayData = {
    brand: 'Gradiator',
    title: 'Trang chu',
    greeting: `Xin chao ${user.username || 'ban'}, ban da dang nhap thanh cong.`,
    logoutText: 'Dang xuat',
  };

  return (
    <main className="home-shell">
      <section className="home-panel">
        <div>
          <p className="home-kicker">{displayData.brand}</p>
          <h1>{displayData.title}</h1>
          <p className="home-subtitle">{displayData.greeting}</p>
        </div>

        <button className="btn primary home-logout" type="button" onClick={handleLogout}>
          {displayData.logoutText}
        </button>
      </section>
    </main>
  );
}
