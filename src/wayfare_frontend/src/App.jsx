import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthClient } from "@dfinity/auth-client";
import { wayfare_backend } from 'declarations/wayfare_backend';
import user_icon from './Assets/person.png';
import email_icon from './Assets/email.png';
import password_icon from './Assets/password.png';
import dfinity_icon from './dfinity.png';
import './index.scss';
import Notification from './Notification';

const App = () => {
  const [action, setAction] = useState("Login");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isIISignup, setIsIISignup] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const initAuthClient = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);
      const isAuthenticated = await client.isAuthenticated();
      if (isAuthenticated) {
        handleExistingAuth(client);
      }
    };
    initAuthClient();
  }, []);

  const handleExistingAuth = async (client) => {
    try {
      const identity = client.getIdentity();
      const principal = identity.getPrincipal();
      const result = await wayfare_backend.loginWithInternetIdentity();
      if ('ok' in result) {
        navigate('/dashboard');
      } else {
        setIsIISignup(true);
        showNotification("No account found. Please complete your signup.", "info");
      }
    } catch (error) {
      console.error("Error during auto-login:", error);
      showNotification("An error occurred during auto-login. Please try again.", "error");
    }
  };

  const validateForm = () => {
    let errors = {};
    if ((action === "Sign up" || isIISignup) && !name.trim()) {
      errors.name = "Name is required";
    }
    if (!email.trim()) {
      errors.email = "Email is required";
    }
    if (!isIISignup && !password.trim()) {
      errors.password = "Password is required";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let result;
      if (isIISignup) {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal();
        result = await wayfare_backend.createUserWithInternetIdentity(name, email);
      } else if (action === "Sign up") {
        result = await wayfare_backend.createUser(name, email, password);
      } else {
        result = await wayfare_backend.login(email, password);
      }
      handleResult(result);
    } catch (error) {
      console.error("Error during submission:", error);
      showNotification("An error occurred. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInternetIdentity = useCallback(async () => {
    if (action === "Sign up" && (!name.trim() || !email.trim())) {
      setErrors({
        name: !name.trim() ? "Name is required" : "",
        email: !email.trim() ? "Email is required" : "",
      });
      return;
    }
  
    setIsLoading(true);
    try {
      const isAuthenticated = await authClient.isAuthenticated();
  
      if (!isAuthenticated) {
        await new Promise((resolve, reject) => {
          authClient.login({
            identityProvider: process.env.II_URL,
            onSuccess: resolve,
            onError: reject
          });
        });
      }
  
      if (action === "Sign up") {
        setIsIISignup(true);
        showNotification("Please complete your signup.", "info");
      } else {
        // For login, we need to get the user's email first
        const userEmail = prompt("Please enter your email address:");
        if (userEmail) {
          setEmail(userEmail);
          const result = await wayfare_backend.loginWithInternetIdentity();
          if ('ok' in result) {
            localStorage.setItem('userEmail', userEmail);
            navigate('/dashboard');
          } else if ('err' in result) {
            showNotification(result.err, 'error');
          } else {
            // Handle the case where the result is a ShareableUser
            localStorage.setItem('userEmail', result.email);
            navigate('/dashboard');
          }
        } else {
          showNotification("Email is required for login.", "error");
        }
      }
    } catch (error) {
      console.error("Error during Internet Identity authentication:", error);
      if (error.message.includes("user closed the identity provider window")) {
        showNotification("Authentication cancelled. Please try again.", "info");
      } else {
        showNotification("An error occurred during authentication. Please try again.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  }, [action, name, email, authClient, navigate]);

  const handleResult = (result) => {
    if ('ok' in result) {
      showNotification(result.ok, 'success');
      if (action === "Login" || action === "Sign up" || isIISignup) {
        localStorage.setItem('userEmail', email);
        navigate('/dashboard');
      }
    } else if ('err' in result) {
      showNotification(result.err, 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const toggleAction = () => {
    setAction(action === "Login" ? "Sign up" : "Login");
    setEmail('');
    setPassword('');
    setName('');
    setErrors({});
    setIsIISignup(false);
  };

  return (
    <div className='container'>
      <Notification message={notification.message} type={notification.type} show={notification.show} />
      <div className="header">
        <div className="text">{isIISignup ? "Complete Signup" : action}</div>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="inputs">
          {(action === "Sign up" || isIISignup) && (
            <div className="input">
              <img src={user_icon} alt="User Icon" />
              <input 
                type="text" 
                placeholder='Name' 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
              {errors.name && <div className="error">{errors.name}</div>}
            </div>
          )}
          <div className="input">
            <img src={email_icon} alt="Email Icon" />
            <input 
              type="email" 
              placeholder='Email Address' 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>
          {!isIISignup && (
            <div className="input">
              <img src={password_icon} alt="Password Icon" />
              <input 
                type="password" 
                placeholder='Password' 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              {errors.password && <div className="error">{errors.password}</div>}
            </div>
          )}
        </div>
        {action === "Login" && !isIISignup && (
          <div className="forgot-password">Forgot Password?</div>
        )}
        <div className="submit-container">
          <button type="submit" className="submit" disabled={isLoading}>
            {isLoading ? <div className="loader"></div> : (isIISignup ? "Complete Signup" : action)}
          </button>
        </div>
      </form>
      {!isIISignup && (
        <div className="alternative-login">
          <button onClick={handleInternetIdentity} className="internet-identity-button" disabled={isLoading}>
            <img src={dfinity_icon} alt="Internet Identity" />
            {isLoading ? <div className="loader"></div> : `${action} with Internet Identity`}
          </button>
        </div>
      )}
      {!isIISignup && (
        <div className="toggle-action" onClick={toggleAction}>
          {action === "Login" 
            ? "Don't have an account? Sign Up" 
            : "Already have an account? Login"}
        </div>
      )}
    </div>
  );
};

export default App;