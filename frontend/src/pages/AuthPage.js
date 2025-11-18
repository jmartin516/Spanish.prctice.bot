import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup } = useAuth();

  const handleLogin = async (email, password) => {
    return await login(email, password);
  };

  const handleSignup = async (email, password, name) => {
    return await signup(email, password, name);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>🗣️ Spanish IA Tutor</h1>
          <p>Practice Spanish with artificial intelligence</p>
        </div>
        
        {isLogin ? (
          <LoginForm 
            onLogin={handleLogin}
            onSwitchToSignup={() => setIsLogin(false)}
          />
        ) : (
          <SignupForm 
            onSignup={handleSignup}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
}

export default AuthPage;

