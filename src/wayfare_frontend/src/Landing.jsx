import React, { useState, useEffect } from 'react';
import wayLogo from './waylogo.png'; 
import booking from './Assets/booking.jpg';
import securepay from './Assets/SecurePay.png';
import ticket from './Assets/ticket1.jpeg';
import dataTrack from './Assets/data.jpeg';
import analytics from './Assets/analytics.jpg';
import Droute from './Assets/route.png';
import './Landing.scss';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeForm, setActiveForm] = useState('user');

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
    <div className="landing">
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

      <header className="hero">
        <div className="hero-content">
          <h1>Revolutionizing Bus Travel in Zambia with Web3</h1>
          <p>WayFare: Empowering Zambians with secure, transparent, and efficient bus ticketing</p>
          <button className="cta-button">Join the Journey</button>
        </div>
      </header>

      <section id="about" className="about">
        <div className="container">
          <h2>About WayFare</h2>
          <p>WayFare is a cutting-edge bus ticketing platform designed for Zambians by Zambians. Our mission is to revolutionize bus travel, making it more accessible, efficient, and secure using Web3 technology.</p>
          <p className="highlight">A product of Tanshi Digital Solutions</p>
        </div>
      </section>

      <section id="for-users" className="for-users">
        <div className="container">
          <h2>For Travelers</h2>
          <div className="features">
            <div className="feature">
              <img src={booking} alt="Easy Booking" />
              <h3>Easy Booking</h3>
              <p>Book your bus tickets with just a few taps on your smartphone.</p>
            </div>
            <div className="feature">
              <img src={securepay} alt="Secure Payments" />
              <h3>Secure Payments</h3>
              <p>Make worry-free payments using our blockchain-powered system.</p>
            </div>
            <div className="feature">
              <img src={ticket} alt="Digital Tickets" />
              <h3>Digital Tickets</h3>
              <p>Say goodbye to paper tickets. Store and access your tickets digitally.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="for-providers" className="for-providers">
        <div className="container">
          <h2>For Service Providers</h2>
          <div className="features">
            <div className="feature">
              <img src={Droute} alt="Route Management" />
              <h3>Route Management</h3>
              <p>Easily manage and optimize your bus routes for maximum efficiency.</p>
            </div>
            <div className="feature">
              <img src={dataTrack} alt="Data Tracking" />
              <h3>Data Tracking</h3>
              <p>Get real-time insights into ticket sales and passenger trends.</p>
            </div>
            <div className="feature">
              <img src={analytics} alt="Performance Analytics" />
              <h3>Performance Analytics</h3>
              <p>Make data-driven decisions with our comprehensive analytics tools.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="why-web3" className="why-web3">
        <div className="container">
          <h2>Why Web3?</h2>
          <div className="web3-benefits">
            <div className="benefit">
              <h3>Security</h3>
              <p>Blockchain technology ensures your data and transactions are secure.</p>
            </div>
            <div className="benefit">
              <h3>Transparency</h3>
              <p>All transactions are recorded on the blockchain, providing full transparency.</p>
            </div>
            <div className="benefit">
              <h3>Efficiency</h3>
              <p>Smart contracts automate processes, reducing costs and improving speed.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="container">
          <h2>Contact Us</h2>
          <div className="form-toggle">
            <button className={activeForm === 'user' ? 'active' : ''} onClick={() => setActiveForm('user')}>For Users</button>
            <button className={activeForm === 'provider' ? 'active' : ''} onClick={() => setActiveForm('provider')}>For Providers</button>
          </div>
          {activeForm === 'user' ? (
            <form className="contact-form user-form">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="Your Message" required></textarea>
              <button type="submit">Send Message</button>
            </form>
          ) : (
            <form className="contact-form provider-form">
              <input type="text" placeholder="Company Name" required />
              <input type="email" placeholder="Business Email" required />
              <input type="tel" placeholder="Phone Number" required />
              <textarea placeholder="Tell us about your bus service" required></textarea>
              <button type="submit">Request Information</button>
            </form>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-info">
              <img src={wayLogo} alt="WayFare Logo" className="logo" />
              <p>WayFare - A product of Tanshi Digital Solutions</p>
              <p>Revolutionizing bus travel in Zambia</p>
            </div>
            <div className="footer-links">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#for-users">For Users</a></li>
                <li><a href="#for-providers">For Providers</a></li>
                <li><a href="#why-web3">Why Web3</a></li>
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
            <div className="social-links">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;