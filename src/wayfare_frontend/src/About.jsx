
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './About.scss';
import wayLogo from './waylogo.png'; 

const About = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="about-page">
        <nav className="navbar">
        <div className="navbar-container">
          <img src={wayLogo} alt="WayFare Logo" className="logo" />
          <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <li><a href="about">About</a></li>
            <li><a href="for-users">For Users</a></li>
            <li><a href="for-providers">For Providers</a></li>
            <li><a href="contact">Contact Us</a></li>
            <li><a href="login">Login</a></li>
          </ul>
        </div>
      </nav>
      <header className="about-header">
        <div className="container">
          <h1>About WayFare</h1>
          <p>Revolutionizing Bus Travel in Zambia with Web3 Technology</p>
        </div>
      </header>

      <section className="about-wayfare">
        <div className="container">
          <h2>Our Mission</h2>
          <p>At WayFare, we're on a mission to transform the bus travel experience in Zambia. By leveraging cutting-edge Web3 technology, we're creating a more efficient, transparent, and secure ticketing system that benefits both travelers and service providers.</p>
          
          <div className="about-features">
            <div className="feature">
              <img src="/placeholder-efficiency.jpg" alt="Efficiency" />
              <h3>Efficiency</h3>
              <p>Say goodbye to long queues and tedious booking processes. WayFare streamlines your travel experience from start to finish.</p>
            </div>
            <div className="feature">
              <img src="/placeholder-transparency.jpg" alt="Transparency" />
              <h3>Transparency</h3>
              <p>With blockchain technology, every transaction is recorded and verifiable, ensuring fair pricing and eliminating hidden fees.</p>
            </div>
            <div className="feature">
              <img src="/placeholder-security.jpg" alt="Security" />
              <h3>Security</h3>
              <p>Your data and payments are protected by state-of-the-art encryption and blockchain security measures.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-tanshi">
        <div className="container">
          <h2>About Tanshi Digital Solutions</h2>
          <p>WayFare is proudly developed by Tanshi Digital Solutions, a forward-thinking tech startup registered with PACRA in Zambia. At Tanshi, we're committed to harnessing the power of technology to solve real-world problems faced by Zambians.</p>
          
          <div className="tanshi-vision">
            <img src="/placeholder-tanshi-team.jpg" alt="Tanshi Digital Solutions Team" />
            <div className="vision-content">
              <h3>Our Vision</h3>
              <p>We envision a future where digital solutions empower every Zambian, making daily life more convenient, efficient, and connected. WayFare is just the beginning of our journey to revolutionize various sectors through innovative technology.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="web3-advantage">
        <div className="container">
          <h2>The Web3 Advantage</h2>
          <p>By building WayFare on Web3 technology and the Internet Computer Protocol (ICP), we're bringing unprecedented benefits to the bus travel industry:</p>
          
          <ul className="advantage-list">
            <li>Decentralized infrastructure ensuring no single point of failure</li>
            <li>Smart contracts for automated, trustless transactions</li>
            <li>Immutable record-keeping for enhanced accountability</li>
            <li>Reduced operational costs through blockchain efficiency</li>
            <li>Future-proof scalability to meet growing demands</li>
          </ul>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Join the Future of Bus Travel</h2>
          <p>Whether you're a traveler looking for a smoother journey or a service provider aiming to optimize your operations, WayFare is here to revolutionize your experience.</p>
          <div className="cta-buttons">
            <Link to="/for-users" className="cta-button">For Travelers</Link>
            <Link to="/for-providers" className="cta-button">For Service Providers</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;