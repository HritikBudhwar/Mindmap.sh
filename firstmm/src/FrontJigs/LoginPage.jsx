import React, { useState } from 'react';
import './LoginForm.css';
import { useNavigate , Link } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log(username , password)
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      console.log("Data.exits : " , data.exist);
      if (response.ok) {
        if (data.exist) {
          console.log(data.cards)
          const userInfo = {
            username : data.username,
            cards : data.cards
          }

          console.log(data.username)

          navigate('/front' , {state : {userInfo}});
        } else {
          setError('Invalid username or password');
        }
      } else {
        setError(data.message || 'An error occurred during login');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error - please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='r'>
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <form className='login-form' onSubmit={handleLogin}>
        <h3>Login Here</h3>

        {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="Email or Phone"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>

        <div className="signup-button">
      Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link>
    </div>

      </form>
    </div>
  );
};

export default LoginPage;