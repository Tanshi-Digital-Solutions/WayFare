import React, { useState, useEffect } from 'react';
import { User, Mail, MessageSquare, Send, LogOut, Menu } from 'lucide-react';
import './ContactUs.scss';
import { useNavigate, Link } from 'react-router-dom';
import { wayfare_backend } from 'declarations/wayfare_backend';
import DashboardHeader from './DashboardHeader';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [userData, setUserData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          navigate('/');
          return;
        }

        const nameResult = await wayfare_backend.getUserName(userEmail);
        setUserData({
          name: 'ok' in nameResult ? nameResult.ok : 'User',
          email: userEmail,
        });
        setEmail(userEmail); // Pre-fill the email field
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await wayfare_backend.addSupportMessage(email, message);
      
      if ('ok' in result) {
        setSubmitted(true);
        setName('');
        setMessage('');
      } else if ('err' in result) {
        setErrorMessage(`Error: ${result.err}`);
      }
    } catch (error) {
      setErrorMessage(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="contact-us-page">
      <DashboardHeader
        userData={userData}
        handleLogout={handleLogout}
        toggleMobileMenu={toggleMobileMenu}
        mobileMenuOpen={mobileMenuOpen}
      />
      <div className="contact-us-container">
        <h2>Contact Us</h2>
        {submitted ? (
          <div className="success-message">
            <p>Thank you for your message! We'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <User size={20} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
              />
            </div>
            <div className="input-group">
              <Mail size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                required
                readOnly
              />
            </div>
            <div className="input-group">
              <MessageSquare size={20} />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your Message"
                required
              ></textarea>
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Message'}
              <Send size={20} />
            </button>
          </form>
        )}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default ContactUs;