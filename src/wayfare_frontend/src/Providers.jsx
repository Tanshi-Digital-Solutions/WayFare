
import './BusProviders.scss';
import DashboardHeader from './DashboardHeader';
import React, { useState, useEffect } from 'react';
import { wayfare_backend } from 'declarations/wayfare_backend';
import { useNavigate, Link } from 'react-router-dom';


const busProviders = [
  {
    name: 'Power Tools Coach Services',
    logo: 'https://placehold.co/200x100?text=Power+Tools',
    image: 'https://placehold.co/600x400?text=Power+Tools+Bus',
    features: [
      'USB Ports in every seat',
      'Reclining seats with extra legroom',
      'On-board entertainment system',
      'Complimentary snacks and beverages',
      'Climate control'
    ],
    description: 'Experience luxury on wheels with Power Tools Coach Services. Our modern fleet ensures a comfortable and enjoyable journey across Zambia.',
    facts: [
      'Founded in 1995',
      'Fleet of 50 luxury coaches',
      '24/7 customer support',
      'GPS tracking for all buses'
    ]
  },
  {
    name: 'Likili Motors',
    logo: 'https://placehold.co/200x100?text=Likili+Motors',
    image: 'https://placehold.co/600x400?text=Likili+Motors+Bus',
    features: [
      'Free high-speed Wi-Fi',
      'Spacious seating arrangement',
      'On-board cafe',
      'Luggage tracking system',
      'Eco-friendly hybrid buses'
    ],
    description: 'Likili Motors combines modern technology with comfort to provide an unparalleled travel experience. Stay connected while you travel in style.',
    facts: [
      'Established in 2005',
      '100% Wi-Fi coverage on all routes',
      'Award-winning customer service',
      'Loyalty program for frequent travelers'
    ]
  },
  {
    name: 'United Bus Services Zambia (UBZ)',
    logo: 'https://placehold.co/200x100?text=UBZ',
    image: 'https://placehold.co/600x400?text=UBZ+Bus',
    features: [
      'Portable toilet facilities',
      'Extra-wide seats',
      'On-board first aid professional',
      '24-hour CCTV surveillance',
      'Wheelchair accessible'
    ],
    description: 'UBZ prioritizes your comfort and safety. With our extensive network and reliable service, we connect all corners of Zambia.',
    facts: [
      'Operating since 1970',
      'Largest bus network in Zambia',
      'Regular safety inspections',
      'Eco-friendly initiatives to reduce carbon footprint'
    ]
  }
];

const BusProviders = () => {
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
    <div className="bus-providers">
      <DashboardHeader
        userData={userData}
        handleLogout={handleLogout}
        toggleMobileMenu={toggleMobileMenu}
        mobileMenuOpen={mobileMenuOpen}
      />
      <h1>Our Bus Providers</h1>
      <div className="provider-cards">
        {busProviders.map((provider, index) => (
          <div key={index} className="provider-card">
            <div className="provider-header">
              <img src={provider.logo} alt={`${provider.name} logo`} className="provider-logo" />
              <h2>{provider.name}</h2>
            </div>
            <img src={provider.image} alt={`${provider.name} bus`} className="provider-image" />
            <p className="provider-description">{provider.description}</p>
            <div className="provider-features">
              <h3>Key Features:</h3>
              <ul>
                {provider.features.map((feature, fIndex) => (
                  <li key={fIndex}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="provider-facts">
              <h3>Quick Facts:</h3>
              <ul>
                {provider.facts.map((fact, fIndex) => (
                  <li key={fIndex}>{fact}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusProviders;