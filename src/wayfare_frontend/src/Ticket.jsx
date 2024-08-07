import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ChevronDown, ChevronUp, Calendar, MapPin, Clock, DollarSign, User, Barcode, ArrowRight, Download  } from 'lucide-react';
import './Ticket.scss';
import { wayfare_backend } from 'declarations/wayfare_backend';
import wayLogo from './waylogo.png'; 
import DashboardHeader from './DashboardHeader';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

const StatusBadge = ({ status }) => {
  return <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>;
};

const Ticket = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [userData, setUserData] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { ticketCode } = useParams();
  const [isElementLoaded, setIsElementLoaded] = useState(false);
  const navigate = useNavigate();
  const ticketRef = useRef(null);

  console.log('Ticket component rendered. Ticket code:', ticketCode);

  useEffect(() => {
    setAnimate(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching data...');

        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          console.log('No user email found. Redirecting to home.');
          navigate('/');
          return;
        }

        const nameResult = await wayfare_backend.getUserName(userEmail);
        setUserData({
          name: 'ok' in nameResult ? nameResult.ok : 'User',
        });
        console.log('User data fetched:', nameResult);

        if (ticketCode) {
          console.log('Fetching ticket info for code:', ticketCode);
          const ticketResult = await wayfare_backend.getTicketInfo(ticketCode);
          console.log('Raw ticket result:', ticketResult);

          if ('ok' in ticketResult) {
            const info = ticketResult.ok;
            const formattedTicket = {
              code: ticketCode,
              providerId: info.providerId || 'Unknown',
              departLocation: info.departLocation || 'Unknown',
              destination: info.destination || 'Unknown',
              distance: info.distance ? `${info.distance} Km` : 'N/A',
              passengerName: info.passengerName || 'Unknown',
              price: info.price ? `${info.price} ZMW` : 'N/A',
              paymentMethod: info.paymentMethod || 'Unknown',
              departureDateTime: info.departureDateTime || 'N/A',
              status: info.status || 'Unknown',
              purchaseTime: info.purchaseTime ? new Date(Number(info.purchaseTime) / 1000000) : null,
              seat: info.seat || 'N/A',
            };
            console.log('Formatted ticket:', formattedTicket);
            setTicket(formattedTicket);
          } else {
            throw new Error('Failed to fetch ticket data');
          }
        } else {
          throw new Error('No ticket code provided');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, ticketCode]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    // Implement logout logic here
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleDownload = async () => {
    if (!ticketRef.current) {
      console.error('Ticket element not found');
      alert('Unable to generate ticket. Please try again.');
      return;
    }

    try {
      // Generate PNG
      const dataUrl = await toPng(ticketRef.current, { quality: 0.95 });
      
      // Download PNG
      const pngLink = document.createElement('a');
      pngLink.href = dataUrl;
      pngLink.download = 'ticket.png';
      document.body.appendChild(pngLink);
      pngLink.click();
      document.body.removeChild(pngLink);

      // Generate and download PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('ticket.pdf');
    } catch (error) {
      console.error('Error generating ticket:', error);
      alert('An error occurred while generating the ticket. Please try again.');
    }
  };

  useEffect(() => {
    // Set a delay to ensure the element is rendered
    const timer = setTimeout(() => {
      setIsElementLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  

  console.log('Current state - Loading:', loading, 'Error:', error, 'Ticket:', ticket);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!ticket) {
    return <div>No ticket data available.</div>;
  }

  return (
    <div className="ticket-container">
      <DashboardHeader
        userData={userData}
        handleLogout={handleLogout}
        toggleMobileMenu={toggleMobileMenu}
        mobileMenuOpen={mobileMenuOpen}
      />
      <div className={`ticket ${animate ? 'animate-in' : ''}`} ref={ticketRef}>
        <div className="ticket-header">
          <div className="wayfare-branding">
            <h1>WayFare</h1>
            <img src={wayLogo} alt="WayFare Logo" className="wayfare-logo" />
          </div>
          <div className="provider-info">
            <h2>{ticket.providerId}</h2>
            <StatusBadge status={ticket.status} />
          </div>
        </div>
        <div className="ticket-main">
          <div className="ticket-body">
            <div className="ticket-info">
              <p><User size={16} /> <strong>Passenger:</strong> {ticket.passengerName}</p>
              <p><MapPin size={16} /> <strong>Route:</strong> {ticket.departLocation} to {ticket.destination}</p>
              <p><Calendar size={16} /> <strong>Departure:</strong> {ticket.departureDateTime}</p>
              <p><ArrowRight size={16} /> <strong>Seat:</strong> {ticket.seat}</p>
              <p><DollarSign size={16} /> <strong>Price:</strong> {ticket.price}</p>
              <p><Barcode size={16} /> <strong>Ticket Code:</strong> {ticket.code}</p>
            </div>
            <div className="ticket-qr">
              <QRCodeSVG value={ticket.code} size={100} />
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
          <p><Clock size={16} /> <strong>Time Purchased:</strong> {ticket.purchaseTime ? ticket.purchaseTime.toLocaleString() : 'N/A'}</p>
          <p><MapPin size={16} /> <strong>Route Distance:</strong> {ticket.distance}</p>
          <p><DollarSign size={16} /> <strong>Payment Method:</strong> {ticket.paymentMethod}</p>
          <button className="download-button" onClick={handleDownload} disabled={loading || !ticket}>
            <Download size={16} /> Download Ticket (PNG & PDF)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
