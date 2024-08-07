import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { wayfare_backend } from 'declarations/wayfare_backend';
import { Html5QrcodeScanner } from "html5-qrcode";
import './AdminDashboard.scss';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [ticketCode, setTicketCode] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [ticketInfoCode, setTicketInfoCode] = useState('');
  const [supportMessages, setSupportMessages] = useState([]);
  const [ticketInfo, setTicketInfo] = useState(null);
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanTarget, setScanTarget] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const adminEmail = localStorage.getItem('adminEmail');
    if (!adminEmail) {
      navigate('/admin-login');
    } else {
      fetchUsers();
      fetchTickets();
      fetchSupportMessages();
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const result = await wayfare_backend.getAllUsers();
      setUsers(result);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTickets = async () => {
    try {
      const result = await wayfare_backend.getAllTickets();
      setTickets(result);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const fetchSupportMessages = async () => {
    try {
      const result = await wayfare_backend.getAllSupportMessages();
      setSupportMessages(result);
    } catch (error) {
      console.error('Error fetching support messages:', error);
    }
  };

  const handleTicketValidation = async (code) => {
    try {
      const result = await wayfare_backend.validateTicket(code);
      setValidationResult(result);
    } catch (error) {
      console.error('Error validating ticket:', error);
      setValidationResult({ err: 'Error validating ticket' });
    }
  };

  const handleGetTicketInfo = async (code) => {
    try {
      const result = await wayfare_backend.getTicketInfo(code);
      setTicketInfo(result);
    } catch (error) {
      console.error('Error fetching ticket info:', error);
      setTicketInfo({ err: 'Error fetching ticket info' });
    }
  };

  const convertTime = (timeNs) => {
    if (!timeNs) return null;
    return new Date(Number(timeNs) / 1000000);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminEmail');
    navigate('/admin-login');
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      await navigator.permissions.query({ name: 'camera' });
      return true;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  };

  const startScanning = async (target) => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      alert('Camera permission is required to scan QR codes. Please grant permission in your browser settings.');
      return;
    }
  
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());

      setIsScanning(true);
      setScanTarget(target);

      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
      scannerRef.current = scanner;

      scanner.render(onScanSuccess, onScanError);

      function onScanSuccess(decodedText, decodedResult) {
        if (target === 'validate') {
          setTicketCode(decodedText);
          handleTicketValidation(decodedText);
        } else if (target === 'info') {
          setTicketInfoCode(decodedText);
          handleGetTicketInfo(decodedText);
        }
        scanner.clear();
        setIsScanning(false);
      }

      function onScanError(errorMessage) {
        console.warn(`QR code scan error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please grant permission and ensure no other application is using the camera.');
      setIsScanning(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <header>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <div className="dashboard-content">
        <section className="users-section">
          <h2>Users</h2>
          <ul>
            {users.map(([email, name]) => (
              <li key={email}>{name} ({email})</li>
            ))}
          </ul>
        </section>
        <section className="tickets-section">
          <h2>Tickets</h2>
          <ul>
            {tickets.map((ticket) => (
              <li key={ticket.code}>{ticket.code} - {ticket.passengerName}</li>
            ))}
          </ul>
        </section>
        <section className="ticket-validation">
          <h2>Validate Ticket</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleTicketValidation(ticketCode); }}>
            <input
              type="text"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value)}
              placeholder="Enter ticket code"
              required
            />
            <button type="submit">Validate</button>
            <button type="button" onClick={() => startScanning('validate')}>Scan QR</button>
          </form>
          {validationResult && (
            <div className="validation-result">
              {validationResult.ok ? 'Valid ticket' : 'Invalid ticket'}
            </div>
          )}
        </section>
        <section className="ticket-info">
          <h2>Get Ticket Info</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleGetTicketInfo(ticketInfoCode); }}>
            <input
              type="text"
              value={ticketInfoCode}
              onChange={(e) => setTicketInfoCode(e.target.value)}
              placeholder="Enter ticket code"
              required
            />
            <button type="submit">Get Info</button>
            <button type="button" onClick={() => startScanning('info')}>Scan QR</button>
          </form>
          {ticketInfo && (
            <div className="ticket-info-result">
              {ticketInfo.ok ? (
                <div>
                  <h3>Ticket Information</h3>
                  <p>Code: {ticketInfo.ok.code}</p>
                  <p>Passenger: {ticketInfo.ok.passengerName}</p>
                  <p>From: {ticketInfo.ok.departLocation}</p>
                  <p>To: {ticketInfo.ok.destination}</p>
                  <p>Date: {ticketInfo.ok.departureDateTime}</p>
                  <p>Seat: {ticketInfo.ok.seat}</p>
                  <p>Price: {ticketInfo.ok.price}</p>
                  <p>Payment Method: {ticketInfo.ok.paymentMethod}</p>
                  <p>User Email: {ticketInfo.ok.userEmail}</p>
                  <p>Provider ID: {ticketInfo.ok.providerId}</p>
                  <p>Distance: {ticketInfo.ok.distance}</p>
                  <p>Trip: {ticketInfo.ok.trip}</p>
                </div>
              ) : (
                <p>Error: {ticketInfo.err}</p>
              )}
            </div>
          )}
        </section>
        <section className="support-messages">
          <h2>Support Messages</h2>
          <ul>
            {supportMessages.map((message, index) => (
              <li key={index}>
                <p><strong>User Email:</strong> {message.userEmail}</p>
                <p><strong>Message:</strong> {message.message}</p>
                <p><strong>Timestamp:</strong> {convertTime(message.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
      {isScanning && (
        <div className="qr-scanner">
          <div id="reader"></div>
          <button onClick={() => setIsScanning(false)}>Cancel Scan</button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;