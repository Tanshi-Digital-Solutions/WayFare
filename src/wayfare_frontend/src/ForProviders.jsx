// ProvidersPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import './ForProviders.scss';

const ProvidersPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="providers-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <img src="/api/placeholder/150/50" alt="WayFare Logo" className="logo" />
          <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </div>
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/for-users">For Users</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1>Empower Your Bus Service with WayFare</h1>
          <p>Unlock Efficiency and Profitability with Web3 Technology</p>
          <button className="cta-button">Request a Demo</button>
        </div>
      </header>

      {/* Benefits Overview */}
      <section className="benefits-overview">
        <div className="container">
          <h2>Why Choose WayFare?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <img src="/api/placeholder/64/64" alt="Efficiency Icon" />
              <h3>Increased Efficiency</h3>
              <p>Streamline operations and reduce manual work</p>
            </div>
            <div className="benefit-item">
              <img src="/api/placeholder/64/64" alt="Data Insights Icon" />
              <h3>Data-Driven Insights</h3>
              <p>Make informed decisions with comprehensive analytics</p>
            </div>
            <div className="benefit-item">
              <img src="/api/placeholder/64/64" alt="Revenue Icon" />
              <h3>Increased Revenue</h3>
              <p>Reduce losses from corruption and under-reporting</p>
            </div>
            <div className="benefit-item">
              <img src="/api/placeholder/64/64" alt="Customer Satisfaction Icon" />
              <h3>Improved Customer Satisfaction</h3>
              <p>Provide a seamless booking experience for travelers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Benefits */}
      <section className="detailed-benefits">
        <div className="container">
          <div className="benefit-detail">
            <div className="benefit-content">
              <h3>Route Management</h3>
              <p>Optimize and manage bus routes with ease. Our platform provides powerful tools to help you create efficient schedules, track performance, and make data-driven decisions to improve your service.</p>
              <Link to="/demo" className="learn-more">Learn More <ArrowRight size={16} /></Link>
            </div>
            <div className="benefit-image">
              <img src="/api/placeholder/400/300" alt="Route Management Dashboard" />
            </div>
          </div>
          <div className="benefit-detail reverse">
            <div className="benefit-content">
              <h3>Real-Time Data Tracking</h3>
              <p>Gain valuable insights into ticket sales and passenger trends. Our real-time analytics dashboard gives you a comprehensive view of your business performance, helping you identify opportunities and address challenges promptly.</p>
              <Link to="/demo" className="learn-more">Learn More <ArrowRight size={16} /></Link>
            </div>
            <div className="benefit-image">
              <img src="/api/placeholder/400/300" alt="Data Tracking Dashboard" />
            </div>
          </div>
          <div className="benefit-detail">
            <div className="benefit-content">
              <h3>Transparent Transactions</h3>
              <p>Eliminate revenue loss due to corruption and under-reporting. Our blockchain-based platform ensures all transactions are secure, verifiable, and tamper-proof, giving you complete visibility into your ticket sales.</p>
              <Link to="/demo" className="learn-more">Learn More <ArrowRight size={16} /></Link>
            </div>
            <div className="benefit-image">
              <img src="/api/placeholder/400/300" alt="Transparent Transactions" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Web3 and ICP */}
      <section className="why-web3">
        <div className="container">
          <h2>The Power of Web3 and Internet Computer</h2>
          <p>WayFare leverages cutting-edge Web3 technology and the Internet Computer Protocol (ICP) to provide a secure, scalable, and efficient platform for bus ticketing.</p>
          <div className="web3-benefits">
            <div className="web3-benefit">
              <h3>Decentralization</h3>
              <p>Eliminate single points of failure and reduce dependency on centralized servers.</p>
            </div>
            <div className="web3-benefit">
              <h3>Enhanced Security</h3>
              <p>Benefit from blockchain's inherent security features to protect your data and transactions.</p>
            </div>
            <div className="web3-benefit">
              <h3>Scalability</h3>
              <p>Grow your business without worrying about infrastructure limitations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Transform Your Bus Service?</h2>
          <p>Join the future of bus ticketing with WayFare. Request a demo today and see how we can help you increase efficiency, boost revenue, and improve customer satisfaction.</p>
          <button className="cta-button">Request a Demo</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-info">
              <img src="/api/placeholder/150/50" alt="WayFare Logo" className="logo" />
              <p>WayFare - A product of Tanshi Digital Solutions</p>
              <p>Revolutionizing bus travel in Zambia</p>
            </div>
            <div className="footer-links">
              <h3>Quick Links</h3>
              <ul>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/for-users">For Users</Link></li>
                <li><Link to="/for-providers">For Providers</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-newsletter">
              <h3>Stay Updated</h3>
              <form>
                <input type="email" placeholder="Your email address" required />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 WayFare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProvidersPage;