import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/Signup';

export default function App() {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-left">
          <div className="brand">
            <div className="logo">★</div>
            <div className="brand-text">Gradiator</div>
          </div>

          <h2 className="welcome">Welcome Back Creative!</h2>
          <p className="sub">We Are Happy To See You Again</p>

          <div className="tabs">
            <NavLink to="/login" className={({isActive}) => `tab ${isActive ? 'active' : ''}`}>Sign in</NavLink>
            <NavLink to="/signup" className={({isActive}) => `tab ${isActive ? 'active' : ''}`}>Sign Up</NavLink>
          </div>

          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>

        <div className="auth-right">
          <div className="glass">
            <small>© 2025 Gradiator. All rights reserved.</small>
          </div>
        </div>
      </div>
    </div>
  );
}
