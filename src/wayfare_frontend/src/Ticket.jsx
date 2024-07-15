import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ChevronDown, ChevronUp, Calendar, MapPin, Clock, DollarSign, User, Barcode, ArrowRight } from 'lucide-react';
import './Ticket.scss';
import wayLogo from './waylogo.png';

const StatusBadge = ({ status }) => {
  return <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>;
};

const Ticket = ({ status = 'Active' }) => {
  const [expanded, setExpanded] = useState(false);
  const [animate, setAnimate] = useState(false);
  const ticketCode = '240981374';

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="ticket-container">
      <div className={`ticket ${animate ? 'animate-in' : ''}`}>
        <div className="ticket-header">
          <div className="wayfare-branding">
            <h1>WayFare</h1>
            <img src={wayLogo} alt="WayFare Logo" className="wayfare-logo" />
          </div>
          <div className="provider-info">
            <h2>Power Tools Coach Services</h2>
            <StatusBadge status={status} />
          </div>
        </div>
        <div className="ticket-main">
          <div className="ticket-body">
            <div className="ticket-info">
              <p><User size={16} /> <strong>Passenger:</strong> John Banda</p>
              <p><MapPin size={16} /> <strong>Route:</strong> Lusaka to Kitwe</p>
              <p><Calendar size={16} /> <strong>Departure:</strong> 19/07/2024 08:00 AM</p>
              <p><ArrowRight size={16} /> <strong>Seat:</strong> 14B</p>
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
          <p><DollarSign size={16} /> <strong>Payment Method:</strong> MTN Mobile Money</p>
          <button className="save-wallet-button">Save to Wallet</button>
        </div>
      </div>
    </div>
  );
};

export default Ticket;