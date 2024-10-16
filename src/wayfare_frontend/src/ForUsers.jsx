import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import wayLogo from './waylogo.png'; 

import './ForUsers.scss';

const ForUsers = () => {
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
    <div className="for-users-page">
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
      <header className="users-header">
        <div className="container">
          <h1>WayFare for Travelers</h1>
          <p>Experience seamless bus travel across Zambia</p>
        </div>
      </header>

      <section className="key-benefits">
        <div className="container">
          <h2>Key Benefits for Travelers</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <img src="/placeholder-easy-booking.jpg" alt="Easy Booking" />
              <h3>Easy Booking</h3>
              <p>Book your bus tickets anytime, anywhere with just a few taps on your smartphone.</p>
            </div>
            <div className="benefit-card">
              <img src="/placeholder-transparent-pricing.jpg" alt="Transparent Pricing" />
              <h3>Transparent Pricing</h3>
              <p>See the real price upfront. No hidden fees or surprises when you book with WayFare.</p>
            </div>
            <div className="benefit-card">
              <img src="/placeholder-secure-payments.jpg" alt="Secure Payments" />
              <h3>Secure Payments</h3>
              <p>Your transactions are protected by blockchain technology, ensuring maximum security.</p>
            </div>
            <div className="benefit-card">
              <img src="/placeholder-digital-tickets.jpg" alt="Digital Tickets" />
              <h3>Digital Tickets</h3>
              <p>Say goodbye to paper tickets. Access your tickets digitally, anytime you need them.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2>How WayFare Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Search</h3>
              <p>Enter your departure, destination, and travel date to find available bus routes.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Select</h3>
              <p>Choose your preferred bus service, seat, and any additional options.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Pay</h3>
              <p>Complete your booking with our secure, blockchain-powered payment system.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Travel</h3>
              <p>Show your digital ticket when boarding and enjoy your journey!</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features-showcase">
        <div className="container">
          <h2>Features That Make Travel Easier</h2>
          <div className="feature-list">
            <div className="feature-item">
              <i className="icon-realtime"></i>
              <h3>Real-time Updates</h3>
              <p>Get instant notifications about schedule changes, delays, or any other important information.</p>
            </div>
            <div className="feature-item">
              <i className="icon-routes"></i>
              <h3>Multiple Routes</h3>
              <p>Compare different routes and bus operators to find the best option for your journey.</p>
            </div>
            <div className="feature-item">
              <i className="icon-reviews"></i>
              <h3>User Reviews</h3>
              <p>Read and leave reviews to help fellow travelers make informed decisions.</p>
            </div>
            <div className="feature-item">
              <i className="icon-support"></i>
              <h3>24/7 Support</h3>
              <p>Our customer support team is always ready to assist you with any queries or issues.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <h2>What Our Users Say</h2>
          <div className="testimonial-carousel">
            <div className="testimonial">
              <p>"WayFare has made bus travel so much easier. No more waiting in long queues or worrying about overcharging!"</p>
              - Sarah M., Lusaka
            </div>
            <div className="testimonial">
              <p>"The digital tickets are a game-changer. I love how I can book and manage my trips right from my phone."</p>
              - John K., Kitwe
            </div>
            <div className="testimonial">
              <p>"As a frequent traveler, the transparency in pricing and real-time updates have been invaluable to me."</p>
              - Grace C., Livingstone
            </div>
          </div>
        </div>
      </section>

      <section className="faq">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>How do I create a WayFare account?</h3>
              <p>Simply download our app or visit our website, click on 'Sign Up', and follow the easy registration process.</p>
            </div>
            <div className="faq-item">
              <h3>Can I cancel or change my booking?</h3>
              <p>Yes, you can modify or cancel your booking up to 24 hours before departure, subject to the bus operator's policy.</p>
            </div>
            <div className="faq-item">
              <h3>Is my personal information safe?</h3>
              <p>Absolutely. We use advanced encryption and blockchain technology to ensure your data is always protected.</p>
            </div>
            <div className="faq-item">
              <h3>What payment methods are accepted?</h3>
              <p>We accept various payment methods including credit/debit cards, mobile money, and select cryptocurrencies.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to Simplify Your Bus Travel?</h2>
          <p>Join thousands of satisfied travelers who have made WayFare their go-to platform for bus bookings.</p>
          <Link to="/signup" className="cta-button">Get Started Now</Link>
        </div>
      </section>
    </div>
  );
};

export default ForUsers;