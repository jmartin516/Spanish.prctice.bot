import React, { useState } from 'react';
import './AuthForms.css';

function LoginForm({ onLogin, onSwitchToSignup, error: externalError }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await onLogin(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Sign In</h2>
      
      {(error || externalError) && (
        <div className="error-message">{error || externalError}</div>
      )}
      
      <div className="form-group">
        <label htmlFor="login-email">Email</label>
        <input
          type="email"
          id="login-email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="your@email.com"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Password</label>
        <input
          type="password"
          id="login-password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="••••••••"
          disabled={loading}
        />
      </div>

      <button type="submit" disabled={loading} className="submit-button">
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <p className="switch-form">
        Don't have an account?{' '}
        <button 
          type="button" 
          onClick={onSwitchToSignup}
          className="link-button"
          disabled={loading}
        >
          Sign up here
        </button>
      </p>
    </form>
  );
}

export default LoginForm;