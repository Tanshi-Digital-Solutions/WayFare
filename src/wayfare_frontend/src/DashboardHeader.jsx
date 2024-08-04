import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import './Header.scss'; 

const DashboardHeader = ({ userData, handleLogout, toggleMobileMenu, mobileMenuOpen }) => {
  return (
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
  );
};

export default DashboardHeader;