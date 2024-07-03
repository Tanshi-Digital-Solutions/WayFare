import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';  // Import routing components
import App from './App';
import Dashboard from './Dashboard';  // Import your Dashboard component
import './index.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>  {/* Wrap the App component with BrowserRouter */}
      <Routes>
        <Route path="/" element={<App />} />  {/* Define the route for the main App component */}
        <Route path="/dashboard" element={<Dashboard />} />  {/* Define the route for the Dashboard component */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
