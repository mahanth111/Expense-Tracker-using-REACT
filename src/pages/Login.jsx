import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = e => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('registeredUser'));

    if (storedUser && storedUser.email === email && storedUser.password === password) {
      setUser(email);
      navigate('/');
    } else {
      alert('Invalid credentials or user not registered.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="btn">Login</button>
      </form>
      <p>Don’t have an account? <Link to="/register">Register</Link></p>
    </div>
  );
};

export default Login;
