import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ChevronDown, ChevronUp, Calendar, MapPin, Clock, DollarSign, User, Barcode, ArrowRight } from 'lucide-react';
import './Ticket.scss';
import { wayfare_backend } from 'declarations/wayfare_backend';

const StatusBadge = ({ status }) => {
  return <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>;
};

const Ticket = ({ status = 'Active' }) => {
  const [expanded, setExpanded] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const { ticketCode, bookingDetails, selectedSeat } = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
  }, []);

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
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="ticket-container">
      <header className="dashboard-header">
        <div className="logo">WayFare</div>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/booking">Book Trip</Link>
          <Link to="/mytickets">My Tickets</Link>
          <Link to="/contactus">Support</Link>
        </nav>
        <div className="user-menu">
          <span>{userData ? userData.name : 'Loading...'}</span>
          <button className="logout-btn" onClick={() => navigate('/')}>
            Logout
          </button>
        </div>
      </header>
      <div className={`ticket ${animate ? 'animate-in' : ''}`}>
        <div className="ticket-header">
          <div className="wayfare-branding">
            <h1>WayFare</h1>
            <img src='./waylogo.png' alt="WayFare Logo" className="wayfare-logo" />
          </div>
          <div className="provider-info">
            <h2>{bookingDetails.provider}</h2>
            <StatusBadge status={status} />
          </div>
        </div>
        <div className="ticket-main">
          <div className="ticket-body">
            <div className="ticket-info">
              <p><User size={16} /> <strong>Passenger:</strong> {bookingDetails.passenger}</p>
              <p><MapPin size={16} /> <strong>Route:</strong> {bookingDetails.startLocation} to {bookingDetails.endLocation}</p>
              <p><Calendar size={16} /> <strong>Departure:</strong> {bookingDetails.departureDate} 08:00 AM</p>
              <p><ArrowRight size={16} /> <strong>Seat:</strong> {selectedSeat}</p>
              <p><DollarSign size={16} /> <strong>Price:</strong> ZMW 305</p>
              <p><Barcode size={16} /> <strong>Ticket Code:</strong> {ticketCode}</p>
            </div>
            <div className="ticket-qr">
              <QRCodeSVG value={ticketCode} size={100} />
            </div>
          </div>
        </div>
        <div className="ticket-footer">
          <button className="expand-button" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Hide Details' : 'Show Details'}
            {expanded ? <ChevronUp className="icon" /> : <ChevronDown className="icon" />}
          </button>
        </div>
        <div className={`expanded-details ${expanded ? 'expanded' : ''}`}>
          <p><Clock size={16} /> <strong>Time Purchased:</strong> {new Date().toLocaleString()}</p>
          <p><MapPin size={16} /> <strong>Route Distance:</strong> 417 Km</p>
          <p><DollarSign size={16} /> <strong>Payment Method:</strong> {bookingDetails.paymentOption}</p>
          <button className="save-wallet-button">Save to Wallet</button>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
