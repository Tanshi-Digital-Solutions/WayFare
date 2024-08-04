import React, { useState, useEffect } from 'react';
import { wayfare_backend } from 'declarations/wayfare_backend';
import DashboardHeader from './DashboardHeader';
import { useNavigate, Link } from 'react-router-dom';
import './Deposit.scss';


const Deposit = () => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [depositStatus, setDepositStatus] = useState('');
  const [userData, setUserData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const handleLogout = () => {
    // Implement logout logic here
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="deposit-page">
      <DashboardHeader
        userData={userData}
        handleLogout={handleLogout}
        toggleMobileMenu={toggleMobileMenu}
        mobileMenuOpen={mobileMenuOpen}
      />
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