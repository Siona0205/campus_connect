import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';  
import ComplaintPage from './pages/ComplaintPage'; 
import AdminPage from './pages/AdminPage'; 
import ComplaintDetailsPage from './pages/ComplaintDetailsPage'; 
import './styles/styles.css';
import './i18n';

const App = () => {
  const [user, setUser] = useState(null);  

  const handleLogin = (userInfo) => {
    setUser(userInfo); 
  };

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />

        {/* Complaint Page (Visible to Student) */}
        <Route
          path="/complaint"
          element={
            user && user.role === 'student' ? (
              <ComplaintPage studentId={user.studentId} />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />

        {/* Admin Page */}
        <Route
          path="/admin"
          element={
            user && user.role === 'admin' ? (
              <AdminPage />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />

        {/* Complaint Details Page */}
        <Route
          path="/complaints/:id/details"
          element={
            user && user.role === 'admin' ? (
              <ComplaintDetailsPage />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
