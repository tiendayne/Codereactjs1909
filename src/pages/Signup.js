import { useState } from 'react';
import TextField from '../components/TextField';
import { isEmail, minLen, notEmpty } from '../utils/validators';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!notEmpty(form.name)) e.name = 'Nhập tên của bạn';
    if (!isEmail(form.email)) e.email = 'Email không hợp lệ';
    if (!minLen(form.password, 6)) e.password = 'Mật khẩu tối thiểu 6 ký tự';
    if (form.password !== form.confirm) e.confirm = 'Mật khẩu nhập lại không khớp';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    // demo: lưu danh sách user (chỉ name+email)
    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
    users.push({ name: form.name, email: form.email });
    localStorage.setItem('demo_users', JSON.stringify(users));
    alert('Đăng ký thành công (demo). Mời đăng nhập!');
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <TextField name="name" placeholder="Your full name" value={form.name} onChange={handleChange} error={errors.name} />
      <TextField name="email" placeholder="Enter your email" value={form.email} onChange={handleChange} error={errors.email} />
      <TextField name="password" type="password" placeholder="Create a password" value={form.password} onChange={handleChange} error={errors.password} />
      <TextField name="confirm" type="password" placeholder="Confirm password" value={form.confirm} onChange={handleChange} error={errors.confirm} />
      <button className="btn primary" type="submit">Create account</button>
    </form>
  );
}
