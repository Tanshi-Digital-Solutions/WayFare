import React, { useState, useEffect } from 'react';
import { User, MapPin, Calendar, DollarSign, CreditCard, LogOut, Menu } from 'lucide-react';
import './SeatSelection.scss';
import { wayfare_backend } from 'declarations/wayfare_backend';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';

const SeatSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails } = location.state || {};
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookedSeats] = useState([1, 5, 12, 25, 30, 42, 55]); // Example booked seats
  const [userData, setUserData] = useState(null);

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
          email: userEmail,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    if (!bookingDetails) {
      navigate('/booking');
    }
  }, [bookingDetails, navigate]);

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

  const handleFinaliseBooking = async () => {
    if (!selectedSeat || !bookingDetails || !userData) return;

    const { passenger,provider, startLocation, endLocation, departureDate, paymentOption } = bookingDetails;

    try {
      const result = await wayfare_backend.purchaseTicket(
        userData.email,
        provider,
        startLocation,
        endLocation,
        417, // Assuming fixed distance for now
        1,
        passenger,
        305,
        paymentOption,
        departureDate,
        selectedSeat.toString(),
        userData.email,
      );

      if ('ok' in result) {
        // Navigate to the new ticket page
        navigate(`/ticket/${result.ok}`);
      } else {
        console.error(result.err);
        // Handle error (e.g., show an error message to the user)
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  if (!bookingDetails) {
    return <div>Loading...</div>;
  }
  const handleLogout = () => {
    // Implement logout logic here
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="seat-selection-page">
      <DashboardHeader
        userData={userData}
        handleLogout={handleLogout}
        toggleMobileMenu={toggleMobileMenu}
        mobileMenuOpen={mobileMenuOpen}
      />
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
              <p>{bookingDetails.passenger}</p>
            </div>
            <div className="detail-item">
              <div className="detail-header">
                <MapPin size={18} />
                <span>Route</span>
              </div>
              <p>{bookingDetails.startLocation} to {bookingDetails.endLocation}</p>
            </div>
            <div className="detail-item">
              <div className="detail-header">
                <Calendar size={18} />
                <span>Departure</span>
              </div>
              <p>{bookingDetails.departureDate}</p>
            </div>
            <div className="detail-item">
              <div className="detail-header">
                <CreditCard size={18} />
                <span>Payment Method</span>
              </div>
              <p>{bookingDetails.paymentOption}</p>
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
          <button className="finalise-button" onClick={handleFinaliseBooking} disabled={!selectedSeat}>
            Finalise Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;