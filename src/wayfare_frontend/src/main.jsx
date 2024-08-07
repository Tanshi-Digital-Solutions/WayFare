import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';  
import App from './App';
import Dashboard from './Dashboard';  
import './index.scss';
import Ticket from './Ticket';
import BookingForm from './BookingForm';
import SeatSelection from './SeatSelection';
import MyTickets from './MyTickets';
import ContactUs from './ContactUs';
import Deposit from './Deposit';
import Schedule from './Schedule';
import Providers from './Providers';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import LinkII from './Users';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>  {/* Wrap the App component with BrowserRouter */}
      <Routes>
        <Route path="/" element={<App />} />  
        <Route path="/dashboard" element={<Dashboard />} />  
        <Route path="/ticket/:ticketCode" element={<Ticket />} /> 
        <Route path="/booking" element={<BookingForm />} />  
        <Route path="/seatselection" element={<SeatSelection />} />
        <Route path="/mytickets" element={<MyTickets />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/link-identity" element={<LinkII />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
