// src/pages/Login.js
import { useState } from 'react';
import TextField from '../components/TextField';
import { isEmail, minLen } from '../utils/validators';

// Font Awesome: dùng import icon trực tiếp (KHÔNG dùng import.macro)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faGoogle } from '@fortawesome/free-brands-svg-icons';

export default function Login() {
  // STATE lưu dữ liệu
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  // validate đơn giản
  const validate = () => {
    const errs = {};
    const email = (form.email || '').trim();

    if (!isEmail(email)) errs.email = 'Email không hợp lệ';
    if (!minLen(form.password, 6)) errs.password = 'Mật khẩu tối thiểu 6 ký tự';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      localStorage.setItem(
        'demo_auth',
        JSON.stringify({ email: form.email.trim(), remember: form.remember })
      );
      alert('Đăng nhập thành công (demo)!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAppleLogin = () => alert('Apple Login (demo)');
  const handleGoogleLogin = () => alert('Google Login (demo)');

  return (
    <form onSubmit={handleSubmit} className="form" noValidate>
      <TextField
        name="email"
        placeholder="Enter your email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
      />
      <TextField
        name="password"
        type="password"
        placeholder="Enter your password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
      />

      <div className="row between">
        <label className="remember">
          <input
            type="checkbox"
            name="remember"
            checked={form.remember}
            onChange={handleChange}
          />
          <span>Remember me</span>
        </label>
          <button className="link" type="button">Forgot Password?</button>
      </div>

      <button className="btn primary" type="submit" disabled={submitting}>
        {submitting ? 'Processing…' : 'Login'}
      </button>

      <div className="or"><span>OR</span></div>

      {/* Nút social dùng Font Awesome (brands) */}
      <button className="btn apple" type="button" onClick={handleAppleLogin}>
        <FontAwesomeIcon icon={faApple} style={{ marginRight: 8 }} />
        Log in with Apple
      </button>

      <button className="btn google" type="button" onClick={handleGoogleLogin}>
        <FontAwesomeIcon icon={faGoogle} style={{ marginRight: 8 }} />
        Log in with Google
      </button>
    </form>
  );
}
