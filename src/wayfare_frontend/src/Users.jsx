import React, { useState, useCallback } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { wayfare_backend } from 'declarations/wayfare_backend';
import user_icon from './Assets/person.png';
import email_icon from './Assets/email.png';
import password_icon from './Assets/password.png';
import dfinity_icon from './dfinity.png';
import './index.scss';
import Notification from './Notification';

const LinkInternetIdentity = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let errors = {};
    if (!email.trim()) {
      errors.email = "Email is required";
    }
    if (!password.trim()) {
      errors.password = "Password is required";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLinkInternetIdentity = useCallback(async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const authClient = await AuthClient.create();
    const isAuthenticated = await authClient.isAuthenticated();
  
    if (!isAuthenticated) {
      await new Promise((resolve) => {
        authClient.login({
          identityProvider: process.env.II_URL,
          onSuccess: resolve,
        });
      });
    }
  
    const identity = authClient.getIdentity();
    const principal = identity.getPrincipal();
  
    try {
      const result = await wayfare_backend.linkInternetIdentity(email, password);
      setIsLoading(false);
      handleResult(result);
    } catch (error) {
      setIsLoading(false);
      showNotification("Error linking Internet Identity: " + error.message, 'error');
    }
  }, [email, password]);

  const handleResult = (result) => {
    if ('ok' in result) {
      showNotification(result.ok, 'success');
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

  return (
    <div className='container'>
      <Notification message={notification.message} type={notification.type} show={notification.show} />
      <div className="header">
        <div className="text">Link Internet Identity</div>
        <div className="underline"></div>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); handleLinkInternetIdentity(); }}>
        <div className="inputs">
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
        </div>
        <div className="submit-container">
          <button type="submit" className="submit" disabled={isLoading}>
            {isLoading ? <div className="loader"></div> : "Link Internet Identity"}
          </button>
        </div>
      </form>
      <div className="alternative-login">
        <button onClick={handleLinkInternetIdentity} className="internet-identity-button" disabled={isLoading}>
          <img src={dfinity_icon} alt="Internet Identity" />
          {isLoading ? <div className="loader"></div> : "Link with Internet Identity"}
        </button>
      </div>
    </div>
  );
};

export default LinkInternetIdentity;