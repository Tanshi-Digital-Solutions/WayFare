import React, { useState, useEffect } from 'react';
import { wayfare_backend } from 'declarations/wayfare_backend';
import { useNavigate, Link } from 'react-router-dom';
import './Deposit.scss';

const Deposit = () => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [depositStatus, setDepositStatus] = useState('');
  const navigate = useNavigate();

  const handleDeposit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setDepositStatus('');

    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        navigate('/');
        return;
      }

      const depositAmount = parseInt(amount);
      const result = await wayfare_backend.initiateDeposit(userEmail, depositAmount);

      if ('ok' in result) {
        setMessage('Deposit initiated. Please wait for verification.');
        setDepositStatus('pending');
        pollDepositStatus(userEmail, depositAmount);
      } else if ('err' in result) {
        setMessage(`Error: ${result.err}`);
      }
    } catch (error) {
      setMessage(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const pollDepositStatus = async (email, depositAmount) => {
    const checkStatus = async () => {
      const result = await wayfare_backend.checkDepositStatus(email, depositAmount);
      if ('ok' in result) {
        if (result.ok === 'verified') {
          setMessage('Deposit verified and added to your account!');
          setDepositStatus('verified');
          updateUserBalance(email);
        } else if (result.ok === 'pending') {
          setMessage('Deposit is still pending. Please wait...');
          setTimeout(checkStatus, 5000); // Check again after 5 seconds
        }
      } else {
        setMessage(`Error checking deposit status: ${result.err}`);
      }
    };
    checkStatus();
  };

  const updateUserBalance = async (email) => {
    try {
      const balanceResult = await wayfare_backend.getBalance(email);
      if ('ok' in balanceResult) {
        setMessage(`Deposit successful! Your new balance is ${balanceResult.ok} ZMW.`);
      }
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  return (
    <div className="deposit-page">
      <header className="dashboard-header">
        <div className="logo">WayFare</div>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/booking">Book Trip</Link>
          <Link to="/mytickets">My Tickets</Link>
          <Link to="/contactus">Support</Link>
        </nav>
        <div className="user-menu">
          <span>User Name</span>
          <button className="logout-btn" onClick={() => navigate('/')}>
            Logout
          </button>
        </div>
      </header>
      <div className="deposit-container">
        <h1>Deposit Funds</h1>
        <form onSubmit={handleDeposit}>
          <div className="form-group">
            <label htmlFor="amount">Amount (ZMW)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="">Select a payment method</option>
              <option value="mtn">MTN Mobile Money</option>
              <option value="airtel">Airtel Money</option>
              <option value="crypto">Crypto Currency</option>
              <option value="credit">Credit Card</option>
            </select>
          </div>
          <button type="submit" disabled={isLoading || depositStatus === 'pending'}>
            {isLoading ? 'Processing...' : 'Deposit'}
          </button>
        </form>
        {message && <div className={`message ${depositStatus}`}>{message}</div>}
        {depositStatus === 'pending' && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Verifying deposit...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Deposit;