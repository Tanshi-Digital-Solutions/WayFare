import React from 'react';
import './Dashboard.scss';  // Import the corresponding CSS file

const Dashboard = () => {
  return (
    <div className='dashboard-container'>
      <header className='dashboard-header'>
        <h1>Welcome to Your Dashboard</h1>
      </header>
      <main className='dashboard-content'>
        <section className='dashboard-section'>
          <div className='section-header'>
            <h2>Upcoming Tickets</h2>
            <button className='button'>View All</button>
          </div>
          <div className='tickets-list'>
            {/* Example tickets */}
            <div className='ticket'>
              <div className='ticket-details'>
                <span className='ticket-route'>Route: A to B</span>
                <span className='ticket-date'>Date: 2024-07-10</span>
                <span className='ticket-time'>Time: 14:00</span>
              </div>
              <button className='button cancel-button'>Cancel</button>
            </div>
            <div className='ticket'>
              <div className='ticket-details'>
                <span className='ticket-route'>Route: C to D</span>
                <span className='ticket-date'>Date: 2024-07-15</span>
                <span className='ticket-time'>Time: 09:00</span>
              </div>
              <button className='button cancel-button'>Cancel</button>
            </div>
          </div>
        </section>
        <section className='dashboard-section'>
          <div className='section-header'>
            <h2>Recent Activities</h2>
            <button className='button'>View All</button>
          </div>
          <ul className='activities-list'>
            <li>Booked a ticket from A to B on 2024-07-01.</li>
            <li>Cancelled a ticket from C to D on 2024-06-28.</li>
          </ul>
        </section>
        <section className='dashboard-section'>
          <div className='section-header'>
            <h2>User Profile</h2>
          </div>
          <div className='user-profile'>
            <p><strong>Name:</strong> John Doe</p>
            <p><strong>Email:</strong> john.doe@example.com</p>
            <button className='button edit-button'>Edit Profile</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
