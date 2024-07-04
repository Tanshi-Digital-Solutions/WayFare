import React from 'react';
import { User, CreditCard, Map, LogOut, Home, Book, Clock, Settings, HelpCircle, BarChart } from 'lucide-react';
import './Dashboard.scss';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="logo">WayFare</div>
        <nav>
          <a href="#" className="active">Dashboard</a>
          <a href="#">Book Trip</a>
          <a href="#">My Tickets</a>
          <a href="#">Support</a>
        </nav>
        <div className="user-menu">
          <span>John Banda</span>
          <button className="logout-btn">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>
      
      <div className="dashboard__content">
        <aside className="dashboard__sidebar">
          <nav>
            <a href="#" className="active"><Home size={20} /> Home</a>
            <a href="#"><Book size={20} /> Bookings</a>
            <a href="#"><Clock size={20} /> History</a>
            <a href="#"><Settings size={20} /> Settings</a>
            <a href="#"><HelpCircle size={20} /> Help</a>
          </nav>
        </aside>
        
        <main className="dashboard__main">
          <section className="welcome-banner">
            <h1>Welcome back, John Banda!</h1>
            <p>Ready for your next adventure?</p>
          </section>
          
          <div className="dashboard-grid">
            <section className="user-profile">
              <div className="user-avatar">
                <User size={48} />
              </div>
              <div className="user-info">
                <h2>John Banda</h2>
                <p>Frequent Traveler</p>
                <p>Member since: Jan 2023</p>
              </div>
            </section>
            
            <section className="account-balance">
              <CreditCard size={24} />
              <h3>Account Balance</h3>
              <p className="balance">1,017 ZMW</p>
              <button className="top-up-btn">Top Up</button>
            </section>
            
            <section className="travel-stats">
              <h3>Your Travel Stats</h3>
              <div className="stat">
                <BarChart size={24} />
                <div>
                  <p>Total Trips</p>
                  <strong>24</strong>
                </div>
              </div>
              <div className="stat">
                <Map size={24} />
                <div>
                  <p>Total Distance</p>
                  <strong>3,450 km</strong>
                </div>
              </div>
            </section>
            
            <section className="recent-trips">
              <h3>Recent Trips</h3>
              <ul>
                <li>
                  <span className="trip-route">Lusaka to Kitwe</span>
                  <span className="trip-date">May 15, 2023</span>
                </li>
                <li>
                  <span className="trip-route">Kitwe to Lusaka</span>
                  <span className="trip-date">May 10, 2023</span>
                </li>
                <li>
                  <span className="trip-route">Lusaka to Livingstone</span>
                  <span className="trip-date">April 28, 2023</span>
                </li>
              </ul>
              <button className="view-all-btn">View All Trips</button>
            </section>
          </div>
          
          <section className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button className="action-btn"><Book size={20} /> Book a Trip</button>
              <button className="action-btn"><Clock size={20} /> View Schedule</button>
              <button className="action-btn"><Settings size={20} /> Manage Account</button>
            </div>
          </section>
        </main>
      </div>
      
      <footer className="dashboard__footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About WayFare</h4>
            <p>Your trusted partner for convenient and comfortable bus travel across Zambia.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect With Us</h4>
            <div className="social-icons">
              {/* Add social media icons here */}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2023 WayFare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;