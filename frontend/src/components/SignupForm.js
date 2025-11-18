import React, { useState } from 'react';
import './AuthForms.css';

function SignupForm({ onSignup, onSwitchToLogin, error: externalError }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    // Validate that passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate minimum length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const result = await onSignup(
      formData.email,
      formData.password,
      formData.name
    );
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Create Account</h2>
      
      {(error || externalError) && (
        <div className="error-message">{error || externalError}</div>
      )}
      
      <div className="form-group">
        <label htmlFor="signup-name">Name</label>
        <input
          type="text"
          id="signup-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your name"
          minLength="2"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="signup-email">Email</label>
        <input
          type="email"
          id="signup-email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="your@email.com"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="signup-password">Password</label>
        <input
          type="password"
          id="signup-password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Minimum 6 characters"
          minLength="6"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="signup-confirm">Confirm Password</label>
        <input
          type="password"
          id="signup-confirm"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          placeholder="Repeat your password"
          minLength="6"
          disabled={loading}
        />
      </div>

      <button type="submit" disabled={loading} className="submit-button">
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>

      <p className="switch-form">
        Already have an account?{' '}
        <button 
          type="button" 
          onClick={onSwitchToLogin}
          className="link-button"
          disabled={loading}
        >
          Sign in here
        </button>
      </p>
    </form>
  );
}

export default SignupForm;