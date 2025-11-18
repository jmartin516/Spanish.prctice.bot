import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import './App.css';

// Internal component that uses the context
function AppContent() {
  const { isAuthenticated, loading, user, logout } = useAuth();

  if (loading) {
    return (
      <div className="App">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spanish IA Tutor</h1>
        <p>Welcome, {user?.name}!</p>
        <p>We're ready to start working</p>
        <button onClick={logout} className="logout-button">
          Log Out
        </button>
      </header>
    </div>
  );
}

// Main component with the Provider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;