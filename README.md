WayFare Bus Ticketing System
Welcome to the WayFare Bus Ticketing System! This project aims to revolutionize bus ticketing by leveraging blockchain technology and Web3 principles to create a seamless and secure user experience.

Table of Contents
Introduction
Features
Tech Stack
Getting Started
File Structure
Usage
Contributing
License
Introduction
WayFare is a bus ticketing system built with modern web technologies and decentralized principles. By integrating blockchain and Web3, we ensure secure, transparent, and efficient transactions. This system allows users to book, view, and manage bus tickets with ease.

Features
User Registration and Authentication: Secure sign-up and login functionality using traditional and Web3 methods.
Ticket Booking: Users can book bus tickets by selecting routes, dates, and seats.
Payment Integration: Supports payments through various methods, including blockchain-based transactions.
View Past Tickets: Users can view their past tickets with detailed information.
Agent Management: Agents can be created and managed with specific privileges.
Deposit and Balance Management: Users can initiate deposits and check their account balance.
Ticket Validation: Validate tickets to ensure they are used only once.
Tech Stack
Frontend: React, Jetpack Compose, Kotlin
Backend: Motoko (running on the Internet Computer), Node.js proxy server
Blockchain: Web3, Internet Computer
Styling: SCSS
Icons: Lucide-react
Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js
DFX (Dfinity SDK)
npm or yarn
Installation
Clone the repo
sh
Copy code
git clone https://github.com/Tanshi-Digital-Solutions/WayFare.git
Install NPM packages
sh
Copy code
npm install
Start the backend
sh
Copy code
dfx start
Deploy the canisters
sh
Copy code
dfx deploy
Start the proxy server
sh
Copy code
node proxy-server.js
Start the frontend
sh
Copy code
npm start
File Structure
plaintext
Copy code

Usage
User Registration
To register a new user, use the createUser function. The system ensures each user has a unique code for identification.

Booking a Ticket
Users can book tickets through the booking page by providing trip details and selecting a payment method. The backend handles ticket creation and updates the user's account.

Viewing Past Tickets
Users can view their past tickets in the MyTickets page. The MyTicket component displays minimal ticket information, and clicking on a ticket shows detailed information using the TicketDetail component.

Agent Management
Agents can be created and managed with the createAgent and agentLogin functions. These functions ensure only authorized agents can access the system.

Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project
Create your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)
Open a Pull Request

Thank you for checking out the WayFare Bus Ticketing System! We hope you find this project useful and look forward to your contributions. If you have any questions or feedback, feel free to open an issue or contact us.

Happy coding! 🚀