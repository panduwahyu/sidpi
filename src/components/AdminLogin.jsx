import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate login process
    setTimeout(() => {
      // Langsung redirect ke dashboard tanpa validasi
      navigate('/admin/dashboard');
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h2>Login Pengguna</h2>
          
          {/* Info untuk demo
          <div style={{ 
            background: '#e6f3ff', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <strong>Demo Mode</strong><br/>
            <small>Masukkan email/password apa saja untuk masuk ke dashboard</small>
          </div> */}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Username/Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Masukan Username atau email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Masukan Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="captcha-section">
              <div className="captcha-checkbox">
                <input type="checkbox" id="captcha" required />
                <label htmlFor="captcha">Saya bukan robot</label>
              </div>
              <div className="recaptcha-logo">reCAPTCHA</div>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>

          <div className="sso-section">
            <p>LOGIN SSO BPS</p>
            <button type="button" className="sso-btn">
              <span className="sso-icon">🔗</span>
              SSO Eksternal BPS
            </button>
          </div>

          <div className="forgot-password">
            <p>Lupa Password? <a href="#reset">reset di sini</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;