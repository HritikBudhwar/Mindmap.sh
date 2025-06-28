import React, { useState } from 'react';
import './SignupPage.css'; 
import { Link } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';
const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished , setisFinished] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !username || !password) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    const userData = { email, username, password };
    
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Signup successful!');
        navigate('/');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="r">

      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <div className="signup-container">
        <h2>Signup</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="login-link-container">
            {/* Link to login page */}
            <span>Already have an account? </span>
            <Link to="/" className="login-link">Login here</Link>
          </div>
          <button type="submit" className="signup-button-2" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Signup'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
