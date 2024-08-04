import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, MapPin, Calendar, DollarSign, LogOut, Menu } from 'lucide-react';
import './MyTickets.scss';
import { wayfare_backend } from 'declarations/wayfare_backend';
import DashboardHeader from './DashboardHeader';

const TicketPreview = ({ ticket, onClick }) => (
  <div className="ticket-preview" onClick={() => onClick(ticket.code)}>
    <h3>{ticket.code}</h3>
    <p><User size={14} /> {ticket.passengerName}</p>
    <p><MapPin size={14} /> {ticket.departLocation} to {ticket.destination}</p>
    <p><Calendar size={14} />Purchase Time: {ticket.purchaseTime ? ticket.purchaseTime.toLocaleString() : 'N/A'}</p>
    <p><DollarSign size={14} /> Price: {ticket.price}</p>
  </div>
);

const MyTickets = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tickets, setTickets] = useState([]);

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
  
        // Fetch user's tickets
        const ticketCodesResult = await wayfare_backend.getUserTickets(userEmail);
        const ticketCodes = 'ok' in ticketCodesResult ? ticketCodesResult.ok : [];
        console.log('ticketCodes:', ticketCodes);
  
        if (Array.isArray(ticketCodes) && ticketCodes.length > 0) {
          const ticketPromises = ticketCodes.map(code => wayfare_backend.getTicketInfo(code));
          const ticketInfos = await Promise.all(ticketPromises);
  
          const formattedTickets = ticketInfos.map((result, index) => {
            console.log(`Raw ticket info for code ${ticketCodes[index]}:`, result);
  
            // Check if the result has an 'ok' property
            const info = result.ok || {};
  
            // Convert Motoko time (nanoseconds) to JavaScript time (milliseconds)
            const convertTime = (timeNs) => {
              if (!timeNs) return null;
              // Convert BigInt to Number and divide by 1,000,000 to get milliseconds
              return new Date(Number(timeNs) / 1000000);
            };
  
            return {
              code: ticketCodes[index] || 'Unknown',
              providerId: info.providerId || 'Unknown',
              departLocation: info.departLocation || 'Unknown',
              destination: info.destination || 'Unknown',
              distance: info.distance || 'N/A',
              passengerName: info.passengerName || 'Unknown',
              price: info.price ? `${info.price} ZMW` : 'N/A',
              paymentMethod: info.paymentMethod || 'Unknown',
              departureDateTime: convertTime(info.departureDateTime),
              status: info.status || 'Unknown',
              purchaseTime: convertTime(info.purchaseTime),
            };
          });
  
          console.log('Formatted tickets:', formattedTickets);
          setTickets(formattedTickets);
        } else {
          console.log('No tickets found or invalid ticket codes:', ticketCodes);
          setTickets([]);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Optionally, update state to show an error message to the user
        setTickets([]);
      }
    };
  
    fetchUserData();
  }, [navigate]); // Add navigate to the dependency array if it's from useNavigate

  const handleTicketClick = (ticketCode) => {
    navigate(`/ticket/${ticketCode}`);
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
    <div className="my-tickets-page">
      <DashboardHeader
        userData={userData}
        handleLogout={handleLogout}
        toggleMobileMenu={toggleMobileMenu}
        mobileMenuOpen={mobileMenuOpen}
      />
      <div className="my-tickets-container">
        <h2>My Tickets</h2>
        <div className="tickets-grid">
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <TicketPreview key={ticket.code} ticket={ticket} onClick={handleTicketClick} />
            ))
          ) : (
            <p>No tickets found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
