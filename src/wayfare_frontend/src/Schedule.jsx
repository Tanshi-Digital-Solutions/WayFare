import './Schedule.scss';
import DashboardHeader from './DashboardHeader';
import React, { useState, useEffect } from 'react';
import { wayfare_backend } from 'declarations/wayfare_backend';
import { useNavigate, Link } from 'react-router-dom';


const cities = ['Lusaka', 'Ndola', 'Kitwe', 'Livingstone', 'Kabwe', 'Mukushi', 'Mongu', 'Solwezi', 'Luapula', 'Chipata'];
const busProviders = ['Power Tools', 'UBZ', 'Likili Mt'];
const departureTimes = ['05:00', '07:00', '11:00', '14:00'];


const generateSchedule = () => {
  const schedule = [];
  const startDate = new Date('2024-08-01');
  const endDate = new Date('2024-09-30');

  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    for (let i = 0; i < cities.length; i++) {
      for (let j = 0; j < cities.length; j++) {
        if (i !== j) {
          departureTimes.forEach(depTime => {
            const arrivalHours = Math.floor(Math.random() * (12 - 5 + 1)) + 5;
            const departureDate = new Date(date);
            departureDate.setHours(depTime.split(':')[0], depTime.split(':')[1]);
            const arrivalDate = new Date(departureDate.getTime() + arrivalHours * 60 * 60 * 1000);
            
            schedule.push({
              date: date.toISOString().split('T')[0],
              from: cities[i],
              to: cities[j],
              departureTime: depTime,
              arrivalTime: `${arrivalDate.getHours().toString().padStart(2, '0')}:${arrivalDate.getMinutes().toString().padStart(2, '0')}`,
              provider: busProviders[Math.floor(Math.random() * busProviders.length)]
            });
          });
        }
      }
    }
  }
  return schedule;
};

const BusSchedule = () => {
  const schedule = generateSchedule();
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