import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, MapPin, Calendar, DollarSign } from 'lucide-react';
import './MyTickets.scss';
import { wayfare_backend } from 'declarations/wayfare_backend';

const TicketPreview = ({ ticket, onClick }) => (
  <div className="ticket-preview" onClick={() => onClick(ticket.ticketCode)}>
    <h3>{ticket.itemName}</h3>
    <p><User size={14} /> {ticket.senderName}</p>
    <p><MapPin size={14} /> {ticket.origin} to {ticket.destination}</p>
    <p><Calendar size={14} /> {new Date(Number(ticket.dateCreated)).toLocaleDateString()}</p>
    <p><DollarSign size={14} /> ZMW {ticket.price}</p>
  </div>
);

const MyTickets = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
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
        const ticketCodes = await wayfare_backend.getUserTickets(userEmail);
        const ticketPromises = ticketCodes.map(code => wayfare_backend.getTicketInfo(code));
        const ticketInfos = await Promise.all(ticketPromises);

        const formattedTickets = ticketInfos.map((info, index) => ({
          ticketCode: ticketCodes[index],
          itemName: info.itemName,
          senderName: info.senderName,
          origin: info.origin,
          destination: info.destination,
          dateCreated: info.dateCreated,
          price: info.price,
        }));

        setTickets(formattedTickets);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleTicketClick = (ticketCode) => {
    navigate(`/ticket/${ticketCode}`);
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
          <span>{userData ? userData.name : 'Loading...'}</span>
          <button className="logout-btn" onClick={() => navigate('/')}>
            Logout
          </button>
        </div>
      </header>
      <div className="my-tickets-container">
        <h2>My Tickets</h2>
        <div className="tickets-grid">
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <TicketPreview key={ticket.ticketCode} ticket={ticket} onClick={handleTicketClick} />
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