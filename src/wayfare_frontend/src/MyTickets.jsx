import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, MapPin, Calendar, DollarSign } from 'lucide-react';
import './MyTickets.scss';

const TicketPreview = ({ onClick }) => (
  <div className="ticket-preview" onClick={onClick}>
    <h3>Power Tools</h3>
    <p><User size={14} /> John Banda</p>
    <p><MapPin size={14} /> Lusaka to Kitwe</p>
    <p><Calendar size={14} /> {new Date().toLocaleDateString()}</p>
    <p><DollarSign size={14} /> ZMW 305</p>
  </div>
);

const MyTickets = () => {
  const navigate = useNavigate();

  const handleTicketClick = () => {
    navigate('/ticket');
  };

  return (
    <div className="my-tickets-page">
      <header className="dashboard-header">
        <div className="logo">WayFare</div>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/booking">Book Trip</Link>
          <Link to="/mytickets">My Tickets</Link>
          <Link to="/contactus">Support</Link>
        </nav>
        <div className="user-menu">
          <span>John Banda</span>
          <button className="logout-btn" onClick={() => navigate('/')}>
            Logout
          </button>
        </div>
      </header>
      <div className="my-tickets-container">
        <h2>My Tickets</h2>
        <div className="tickets-grid">
          {[...Array(6)].map((_, index) => (
            <TicketPreview key={index} onClick={handleTicketClick} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
