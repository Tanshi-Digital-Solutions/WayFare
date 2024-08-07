import React, { useState, useEffect } from 'react';
import { User, CreditCard, Map, LogOut, Home, Book, Clock, Settings, HelpCircle, BarChart, BusFront, Menu } from 'lucide-react';
import './Dashboard.scss';
import { Link, useNavigate } from 'react-router-dom';
import { wayfare_backend } from 'declarations/wayfare_backend';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [recentTrips, setRecentTrips] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        navigate('/');
        return;
      }

      const balanceResult = await wayfare_backend.getBalance(userEmail);
      const nameResult = await wayfare_backend.getUserName(userEmail);
      const tripsResult = await wayfare_backend.getUserTrips(userEmail);
      const distanceResult = await wayfare_backend.getUserTotalDistance(userEmail);

      setUserData({
        name: 'ok' in nameResult ? nameResult.ok : 'User',
        balance: 'ok' in balanceResult ? balanceResult.ok : 0,
        trip: 'ok' in tripsResult ? tripsResult.ok : 0,
        distance: 'ok' in distanceResult ? distanceResult.ok : 0
      });

      // Fetch user's tickets
      const ticketCodesResult = await wayfare_backend.getUserTickets(userEmail);
      const ticketCodes = 'ok' in ticketCodesResult ? ticketCodesResult.ok : [];

      if (Array.isArray(ticketCodes) && ticketCodes.length > 0) {
        const ticketPromises = ticketCodes.map(code => wayfare_backend.getTicketInfo(code));
        const ticketInfos = await Promise.all(ticketPromises);

        const formattedTickets = ticketInfos.map((result, index) => {
          const info = result.ok || {};
          
          // Convert Motoko time (nanoseconds) to JavaScript time (milliseconds)
          const convertTime = (timeNs) => {
            if (!timeNs) return null;
            return new Date(Number(timeNs) / 1000000);
          };

          return {
            code: ticketCodes[index] || 'Unknown',
            departLocation: info.departLocation || 'Unknown',
            destination: info.destination || 'Unknown',
            departureDateTime: convertTime(info.departureDateTime),
            status: info.status || 'Unknown',
          };
        });

        const now = new Date();
        const recent = formattedTickets
          .filter(ticket => ticket.status === 'used' && ticket.departureDateTime && ticket.departureDateTime <= now)
          .sort((a, b) => b.departureDateTime - a.departureDateTime)
          .slice(0, 3);

        const upcoming = formattedTickets
          .filter(ticket => ticket.status === 'issued' && ticket.departureDateTime && ticket.departureDateTime > now)
          .sort((a, b) => a.departureDateTime - b.departureDateTime)
          .slice(0, 3);

        setRecentTrips(recent);
        setUpcomingTrips(upcoming);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="logo">WayFare</div>
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <Menu size={24} />
        </button>
        <nav className={`desktop-nav ${mobileMenuOpen ? 'mobile-nav-open' : ''}`}>
          <Link to="/dashboard" className="active">Dashboard</Link>
          <Link to="/booking">Book Trip</Link>
          <Link to="/mytickets">My Tickets</Link>
          <Link to="/contactus">Support</Link>
        </nav>
        <div className="user-menu">
          <span>{userData?.name}</span>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>
      
      <div className="dashboard__content">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <aside className={`dashboard__sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <nav>
            <Link to="/dashboard" className="active"><Home size={20} /> Home</Link>
            <Link to="/providers"><BusFront size={20} /> Providers</Link>
            <Link to="/schedule"><Clock size={20} /> Schedule</Link>
            <Link to="/settings"><Settings size={20} /> Settings</Link>
            <Link to="/contactus"><HelpCircle size={20} /> Help</Link>
          </nav>
        </aside>
        
        <main className="dashboard__main">
          <section className="welcome-banner">
            <h1>Welcome back, {userData.name}!</h1>
            <p>Ready for your next adventure?</p>
          </section>
          
          <div className="dashboard-grid">
            <section className="user-profile">
              <div className="user-avatar">
                <User size={48} />
              </div>
              <div className="user-info">
                <h2>{userData.name}</h2>
                <p>New User</p>
                <p>Member since: Aug 2024</p>
              </div>
            </section>
            
            <section className="account-balance">
              <CreditCard size={24} />
              <h3>Account Balance</h3>
              <p className="balance">{userData.balance > 0 ? `${userData.balance} ZMW` : '0'}</p>
              <Link to="/deposit" className="top-up-btn">Top Up</Link>
            </section>
            
            <section className="travel-stats">
              <h3>Your Travel Stats</h3>
              <div className="stat">
                <BarChart size={24} />
                <div>
                  <p>Total Trips</p>
                  <strong>{userData.distance > 0 ? `${userData.trip}` : '0'}</strong>
                </div>
              </div>
              <div className="stat">
                <Map size={24} />
                <div>
                  <p>Total Distance</p>
                  <strong>{userData.distance > 0 ? `${userData.distance} km` : '0'}</strong>
                </div>
              </div>
            </section>
            
            <section className="recent-trips">
              <h3>Recent Trips</h3>
              <ul>
                {recentTrips.map((trip, index) => (
                  <li key={index}>
                    <span className="trip-route">{trip.departLocation} to {trip.destination}</span>
                    <span className="trip-date">{trip.departureDateTime.toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
              {recentTrips.length === 0 && <p>No recent trips.</p>}
              <Link to="/mytickets" className="view-all-btn">View All Trips</Link>
            </section>

            <section className="upcoming-trips">
              <h3>Upcoming Trips</h3>
              <ul>
                {upcomingTrips.map((trip, index) => (
                  <li key={index}>
                    <span className="trip-route">{trip.departLocation} to {trip.destination}</span>
                    <span className="trip-date">{trip.departureDateTime.toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
              {upcomingTrips.length === 0 && <p>No upcoming trips.</p>}
              <Link to="/mytickets" className="view-all-btn">View All Trips</Link>
            </section>
          </div>
          
          <section className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <Link to="/mytickets" className="view-all-btn"><Book size={20} /> Book a Trip</Link>
              <Link to="/mytickets" className="view-all-btn"><Clock size={20} /> View Schedule</Link>
              <Link to="/mytickets" className="view-all-btn"><Settings size={20} /> Manage Account</Link>
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
              <li><a href="/contactus">Contact Us</a></li>
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
          <p>&copy; 2024 WayFare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;