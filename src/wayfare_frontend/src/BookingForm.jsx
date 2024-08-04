import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Bus, DollarSign, User, LogOut, Menu } from 'lucide-react';
import './BookingForm.scss';
import { useNavigate, Link } from 'react-router-dom';
import { wayfare_backend } from 'declarations/wayfare_backend';
import DashboardHeader from './DashboardHeader';

const BookingForm = () => {
  const [userData, setUserData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    passenger: '',
    provider: '',
    startLocation: '',
    endLocation: '',
    departureDate: '',
    paymentOption: '',
  });

  const navigate = useNavigate();

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

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = localStorage.getItem('userEmail');
    navigate('/seatselection', { state: { bookingDetails: formData, email } });
  };
  const handleLogout = () => {
    // Implement logout logic here
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="booking-form-page">
      <DashboardHeader
        userData={userData}
        handleLogout={handleLogout}
        toggleMobileMenu={toggleMobileMenu}
        mobileMenuOpen={mobileMenuOpen}
      />
      <div className="booking-form-container">
        <form className="booking-form" onSubmit={handleSubmit}>
          <h2>Book Your Trip</h2>
          <div className="form-group">
            <label htmlFor="passenger">
              <User size={18} />
              Passenger Name
            </label>
            <input
              type="text"
              id="passenger"
              name="passenger"
              value={formData.passenger}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="provider">
              <Bus size={18} />
              Service Provider
            </label>
            <select
              id="provider"
              name="provider"
              value={formData.provider}
              onChange={handleChange}
            >
              <option value="">Select a provider</option>
              <option value="Power Tools Coach Services">Power Tools Coach Services (Recommended)</option>
              <option value="UBZ">UBZ</option>
              <option value="Likili Motors">Likili Motors</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="startLocation">
              <MapPin size={18} />
              Departure City
            </label>
            <select
              id="startLocation"
              name="startLocation"
              value={formData.startLocation}
              onChange={handleChange}
            >
              <option value="">Select departure city</option>
              <option value="Lusaka">Lusaka</option>
              <option value="Kitwe">Kitwe</option>
              <option value="Ndola">Ndola</option>
              <option value="Livingstone">Livingstone</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="endLocation">
              <MapPin size={18} />
              Destination City
            </label>
            <select
              id="endLocation"
              name="endLocation"
              value={formData.endLocation}
              onChange={handleChange}
            >
              <option value="">Select destination city</option>
              <option value="Lusaka">Lusaka</option>
              <option value="Kitwe">Kitwe</option>
              <option value="Ndola">Ndola</option>
              <option value="Livingstone">Livingstone</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="departureDate">
              <Calendar size={18} />
              Departure Date
            </label>
            <input
              type="date"
              id="departureDate"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="paymentOption">
              <DollarSign size={18} />
              Payment Method
            </label>
            <select
              id="paymentOption"
              name="paymentOption"
              value={formData.paymentOption}
              onChange={handleChange}
            >
              <option value="">Select payment method</option>
              <option value="MTN Mobile Money">MTN Mobile Money</option>
              <option value="Airtel Mobile Money">Airtel Mobile Money</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Cryptocurrency">Cryptocurrency</option>
              <option value="WayFare Balance">WayFare Balance</option>
            </select>
          </div>
          <button type="submit" className="submit-button">Book Now</button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
