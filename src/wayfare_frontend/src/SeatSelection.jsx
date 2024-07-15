import React, { useState } from 'react';
import { User, MapPin, Calendar, DollarSign, CreditCard } from 'lucide-react';
import './SeatSelection.scss';
import { useNavigate, Link } from 'react-router-dom';

const SeatSelection = () => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookedSeats] = useState([1, 5, 12, 25, 30, 42, 55]); // Example booked seats
  const navigate = useNavigate();

  const handleSeatClick = (seat) => {
    if (!bookedSeats.includes(seat)) {
      setSelectedSeat(seat);
    }
  };

  const renderSeat = (seat) => {
    const isBooked = bookedSeats.includes(seat);
    const isSelected = selectedSeat === seat;
    return (
      <div
        key={seat}
        className={`seat ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
        onClick={() => handleSeatClick(seat)}
      >
        {seat}
      </div>
    );
  };

  const renderSeatRows = () => {
    const rows = [];
    for (let i = 0; i < 16; i++) {
      rows.push(
        <div key={i} className="seat-row">
          {[0, 1, 2, 3].map((j) => renderSeat(i * 4 + j + 1))}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="seat-selection-page">
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
      <div className="seat-selection-container">
        <h2>Select Your Seat</h2>
        <div className="bus-layout">
          <div className="seat-group">
            {renderSeatRows()}
          </div>
        </div>
        <div className="booking-confirmation">
          <h3>Booking Details</h3>
          <div className="confirmation-details">
            <div className="detail-item">
              <div className="detail-header">
                <User size={18} />
                <span>Passenger</span>
              </div>
              <p>John Banda</p>
            </div>
            <div className="detail-item">
              <div className="detail-header">
                <MapPin size={18} />
                <span>Route</span>
              </div>
              <p>Lusaka to Kitwe</p>
            </div>
            <div className="detail-item">
              <div className="detail-header">
                <Calendar size={18} />
                <span>Departure</span>
              </div>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
            <div className="detail-item">
              <div className="detail-header">
                <CreditCard size={18} />
                <span>Payment Method</span>
              </div>
              <p>WayFare Balance</p>
            </div>
            <div className="detail-item">
              <div className="detail-header">
                <DollarSign size={18} />
                <span>Price</span>
              </div>
              <p>ZMW 305</p>
            </div>
            {selectedSeat && (
              <div className="detail-item">
                <div className="detail-header">
                  <User size={18} />
                  <span>Selected Seat</span>
                </div>
                <p>{selectedSeat}</p>
              </div>
            )}
          </div>
          <button className="finalise-button" disabled={!selectedSeat}>
            Finalise Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
