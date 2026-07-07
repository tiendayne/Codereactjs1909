import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/login';
import Signup from '../pages/Signup';
import '../styles/auth.css';

function isLoggedIn() {
  return Boolean(localStorage.getItem('auth_token'));
}

function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-left">
          <div className="brand">
            <div className="logo">*</div>
            <div className="brand-text">Gradiator</div>
          </div>

          <h2 className="welcome">Welcome Back Creative!</h2>
          <p className="sub">We Are Happy To See You Again</p>

          <div className="tabs">
            <NavLink to="/login" className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>Sign in</NavLink>
            <NavLink to="/signup" className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>Sign Up</NavLink>
          </div>

          {children}
        </div>

        <div className="auth-right">
          <div className="glass">
            <small>(c) 2025 Gradiator. All rights reserved.</small>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProtectedHome() {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return <Home />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={isLoggedIn() ? '/home' : '/login'} replace />} />
      <Route path="/home" element={<ProtectedHome />} />
      <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
      <Route path="/signup" element={<AuthLayout><Signup /></AuthLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
