import './Schedule.scss';
import DashboardHeader from './DashboardHeader';
import React, { useState, useEffect } from 'react';
import { wayfare_backend } from 'declarations/wayfare_backend';
import { useNavigate, Link } from 'react-router-dom';


const cities = ['Lusaka', 'Ndola', 'Kitwe', 'Livingstone', 'Kabwe', 'Mukushi', 'Mongu', 'Solwezi', 'Luapula', 'Chipata'];
const busProviders = ['Power Tools', 'UBZ', 'Likili Mt'];
const departureTimes = ['05:00', '07:00', '11:00', '14:00'];


const generateSchedule = (numItems) => {
  const schedule = [];
  const startDate = new Date('2024-08-01');

  for (let k = 0; k < numItems; k++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + Math.floor(Math.random() * 60)); // Random date within the 2-month range
    const fromIndex = Math.floor(Math.random() * cities.length);
    let toIndex = Math.floor(Math.random() * cities.length);
    while (toIndex === fromIndex) {
      toIndex = Math.floor(Math.random() * cities.length);
    }
    const depTime = departureTimes[Math.floor(Math.random() * departureTimes.length)];
    const arrivalHours = Math.floor(Math.random() * (12 - 5 + 1)) + 5;
    const departureDate = new Date(date);
    departureDate.setHours(depTime.split(':')[0], depTime.split(':')[1]);
    const arrivalDate = new Date(departureDate.getTime() + arrivalHours * 60 * 60 * 1000);
    
    schedule.push({
      date: date.toISOString().split('T')[0],
      from: cities[fromIndex],
      to: cities[toIndex],
      departureTime: depTime,
      arrivalTime: `${arrivalDate.getHours().toString().padStart(2, '0')}:${arrivalDate.getMinutes().toString().padStart(2, '0')}`,
      provider: busProviders[Math.floor(Math.random() * busProviders.length)]
    });
  }
  return schedule;
};

const BusSchedule = () => {
  const schedule = generateSchedule(30);
  const [userData, setUserData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    // Implement logout logic here
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="bus-schedule">
      <DashboardHeader
        userData={userData}
        handleLogout={handleLogout}
        toggleMobileMenu={toggleMobileMenu}
        mobileMenuOpen={mobileMenuOpen}
      />    
      <h1>Bus Schedule: August 2024 - September 2024</h1>
      <div className="schedule-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>From</th>
              <th>To</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Provider</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((trip, index) => (
              <tr key={index}>
                <td>{trip.date}</td>
                <td>{trip.from}</td>
                <td>{trip.to}</td>
                <td>{trip.departureTime}</td>
                <td>{trip.arrivalTime}</td>
                <td>{trip.provider}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusSchedule;
