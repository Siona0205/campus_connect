import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
 // Make sure to link the correct CSS file path

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
        role,
      });

      if (response.data.success) {
        const userInfo = {
          studentId: response.data.studentId,
          role: response.data.role,
        };

        onLogin(userInfo);
        setMessage('Login successful!');
        navigate(role === 'student' ? '/complaint' : '/admin');
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('Login failed: Something went wrong');
    }
  };

  return (
    <div className="login-page">
      {/* Navigation Bar */}
      <nav class="navbar">
  <div className="logo">
    <img src="/images/logo.png" alt="School Logo" />
    <div className="logo-text">Connects you together</div>
  </div>
  <div class="nav-links">
    <a href="#login">Login</a>
    <a href="#about">About Us</a>
    <a href="#contact">Contact Us</a>
  </div>
</nav>


      {/* School Name */}
      <div className="school-name">
        <h1>Govt. High School Lambapur</h1>
      </div>

      {/* Slideshow */}
      <div className="slideshow">
        <div className="slides">
          <img src="/images/image4.jpg" alt="School 1" />
          <img src="/images/image2.jpg" alt="School 2" />
          <img src="/images/image3.jpg" alt="School 3" />
        </div>
      </div>

      {/* Login Section */}
      <section id="login" className="login-section">
        <div className="login-box">
          <h2>Login</h2>
          {message && (
            <p className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
              {message}
            </p>
          )}
          <form onSubmit={handleLogin}>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit">Login</button>
          </form>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <h2>About Us</h2>
        <p>
          GHS Lambapur, this school has been a beacon of excellence in education since 1994.
          Despite being located in a low-population region, the students have consistently
          demonstrated a thirst for knowledge and a drive to succeed because of the unwavering
          support and guidance of the talented, friendly, and kind teachers. Their alumni have
          gone on to achieve remarkable success in various fields such as doctors, engineers,
          government officials, etc. They are setting their unremarkable contribution towards the
          betterment and progress of students.
        </p>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <h2>Contact Us</h2>
        <p>Email: contact@ghslambapur.edu</p>
        <p>Phone: +91-9876543210</p>
        <p>Address: Lambapur, Uttarkannada, Karnataka</p>
      </footer>
    </div>
  );
};

export default LoginPage;
