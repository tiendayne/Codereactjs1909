import { useState } from 'react';
import TextField from '../shared/components/TextField';
import { minLen, notEmpty } from '../shared/utils/validators';
import { register } from '../services/auth/registerService';

export default function Signup() {
  const [form, setForm] = useState({ username: '', password: '', confirm: '', security_question: '', security_answer: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!notEmpty(form.username)) e.username = 'Vui lòng nhập tên đăng nhập';
    if (!notEmpty(form.security_question)) e.security_question = 'Vui lòng nhập câu hỏi bảo mật';
    if (!notEmpty(form.security_answer)) e.security_answer = 'Vui lòng nhập câu trả lời bảo mật';
    if (!minLen(form.password, 6)) e.password = 'Mật khẩu tối thiểu 6 ký tự';
    if (form.password !== form.confirm) e.confirm = 'Mật khẩu nhập lại không khớp';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register({
        username: form.username.trim(),
        password: form.password,
        security_question: form.security_question.trim(),
        security_answer: form.security_answer.trim(),
      });
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      setForm({ username: '', password: '', confirm: '', security_question: '', security_answer: '' });
    } catch (error) {
      setServerError(error.response?.data?.message || error.message || 'Đăng ký thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <TextField name="username" placeholder="Tên đăng nhập" value={form.username} onChange={handleChange} error={errors.username} />
      <TextField name="security_question" placeholder="Câu hỏi bảo mật" value={form.security_question} onChange={handleChange} error={errors.security_question} />
      <TextField name="security_answer" placeholder="Câu trả lời bảo mật" value={form.security_answer} onChange={handleChange} error={errors.security_answer} />
      <TextField name="password" type="password" placeholder="Mật khẩu" value={form.password} onChange={handleChange} error={errors.password} />
      <TextField name="confirm" type="password" placeholder="Xác nhận mật khẩu" value={form.confirm} onChange={handleChange} error={errors.confirm} />

      {serverError && <div className="error-text" style={{ marginBottom: 12 }}>{serverError}</div>}

      <button className="btn primary" type="submit" disabled={submitting}>
        {submitting ? 'Đang xử lý…' : 'Đăng ký'}
      </button>
    </form>
  );
}
