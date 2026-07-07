// src/pages/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '../shared/components/TextField';
import { minLen, notEmpty } from '../shared/utils/validators';
import { forgotPassword } from '../services/auth/forgotPasswordService';
import { login } from '../services/auth/loginService';

// Font Awesome: dùng import icon trực tiếp (KHÔNG dùng import.macro)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple, faGoogle } from '@fortawesome/free-brands-svg-icons';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotForm, setForgotForm] = useState({
    username: '',
    security_answer: '',
    new_password: '',
    confirm_password: '',
  });
  const [forgotErrors, setForgotErrors] = useState({});
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotStatus, setForgotStatus] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleForgotChange = (e) => {
    const { name, value } = e.target;
    setForgotForm((f) => ({ ...f, [name]: value }));
  };

  const openForgot = () => {
    setShowForgot(true);
    setServerError('');
    setForgotMessage('');
    setForgotStatus('');
    setForgotErrors({});
  };

  const backToLogin = () => {
    setShowForgot(false);
    setForgotMessage('');
    setForgotStatus('');
    setForgotErrors({});
  };

  const validate = () => {
    const errs = {};
    const username = (form.username || '').trim();

    if (!notEmpty(username)) errs.username = 'Vui lòng nhập tên đăng nhập';
    if (!minLen(form.password, 6)) errs.password = 'Mật khẩu tối thiểu 6 ký tự';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateForgot = () => {
    const errs = {};
    const username = (forgotForm.username || '').trim();

    if (!notEmpty(username)) errs.username = 'Vui lòng nhập tên đăng nhập';
    if (!notEmpty(forgotForm.security_answer)) errs.security_answer = 'Vui lòng nhập câu trả lời bảo mật';
    if (!minLen(forgotForm.new_password, 6)) errs.new_password = 'Mật khẩu mới tối thiểu 6 ký tự';
    if (forgotForm.new_password !== forgotForm.confirm_password) errs.confirm_password = 'Mật khẩu nhập lại không khớp';
    setForgotErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getErrorMessage = (error) => {
    const status = error?.status || error?.code || error?.response?.status;

    if (status === 403) {
      return 'Bạn không có quyền truy cập. Vui lòng kiểm tra tài khoản hoặc cấu hình backend.';
    }

    if (status === 401) {
      return 'Thông tin đăng nhập không hợp lệ.';
    }

    if (status === 400) {
      return error?.message || 'Đăng nhập thất bại';
    }

    return error?.message || 'Đăng nhập thất bại';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data = await login({ username: form.username.trim(), password: form.password });
      localStorage.setItem('auth_token', data.token || 'logged-in');
      localStorage.setItem('auth_user', JSON.stringify({ username: form.username.trim() }));
      navigate('/home', { replace: true });
    } catch (error) {
      console.error('Login failed', error);
      setServerError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotMessage('');
    setForgotStatus('');
    if (!validateForgot()) return;

    setForgotSubmitting(true);
    try {
      await forgotPassword({
        username: forgotForm.username.trim(),
        security_answer: forgotForm.security_answer.trim(),
        new_password: forgotForm.new_password,
      });
      setForgotMessage('Đặt lại mật khẩu thành công! Vui lòng đăng nhập.');
      setForgotStatus('success');
      setForgotForm({ username: '', security_answer: '', new_password: '', confirm_password: '' });
      setShowForgot(false);
    } catch (error) {
      console.error('Forgot password failed', error);
      setForgotMessage(error?.message || 'Đặt lại mật khẩu thất bại');
      setForgotStatus('error');
    } finally {
      setForgotSubmitting(false);
    }
  };

  const handleAppleLogin = () => alert('Apple Login (demo)');
  const handleGoogleLogin = () => alert('Google Login (demo)');

  if (showForgot) {
    return (
      <div className="form">
        <div className="forgot-header">
          <h3>Quên mật khẩu</h3>
          <button className="link" type="button" onClick={backToLogin}>
            Quay lại đăng nhập
          </button>
        </div>

        {forgotMessage && (
          <div className={forgotStatus === 'success' ? 'success-text' : 'error-text'}>
            {forgotMessage}
          </div>
        )}

        <form onSubmit={handleForgotSubmit} className="form" noValidate>
          <TextField
            name="username"
            placeholder="Tên đăng nhập"
            value={forgotForm.username}
            onChange={handleForgotChange}
            error={forgotErrors.username}
          />
          <TextField
            name="security_answer"
            placeholder="Câu trả lời bảo mật"
            value={forgotForm.security_answer}
            onChange={handleForgotChange}
            error={forgotErrors.security_answer}
          />
          <TextField
            name="new_password"
            type="password"
            placeholder="Mật khẩu mới"
            value={forgotForm.new_password}
            onChange={handleForgotChange}
            error={forgotErrors.new_password}
          />
          <TextField
            name="confirm_password"
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            value={forgotForm.confirm_password}
            onChange={handleForgotChange}
            error={forgotErrors.confirm_password}
          />

          <button className="btn primary" type="submit" disabled={forgotSubmitting}>
            {forgotSubmitting ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="form">
      {forgotMessage && (
        <div className={forgotStatus === 'success' ? 'success-text' : 'error-text'}>
          {forgotMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form" noValidate>
        <TextField
          name="username"
          placeholder="Tên đăng nhập"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
        />
        <TextField
          name="password"
          type="password"
          placeholder="Mật khẩu"
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
            <span>Ghi nhớ đăng nhập</span>
          </label>
          <button className="link" type="button" onClick={openForgot}>
            Quên mật khẩu?
          </button>
        </div>

        {serverError && <div className="error-text" style={{ marginBottom: 12 }}>{serverError}</div>}

        <button className="btn primary" type="submit" disabled={submitting}>
          {submitting ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
      </form>

      <div className="or"><span>OR</span></div>

      <button className="btn apple" type="button" onClick={handleAppleLogin}>
        <FontAwesomeIcon icon={faApple} style={{ marginRight: 8 }} />
        Log in with Apple
      </button>

      <button className="btn google" type="button" onClick={handleGoogleLogin}>
        <FontAwesomeIcon icon={faGoogle} style={{ marginRight: 8 }} />
        Log in with Google
      </button>
    </div>
  );
}
