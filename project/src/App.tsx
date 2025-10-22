import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { HotelBooking } from './pages/HotelBooking';
import { FlightBooking } from './pages/FlightBooking';
import { CarBooking } from './pages/CarBooking';
import { TrainBooking } from './pages/TrainBooking';
import { BusBooking } from './pages/BusBooking';
import { MetroBooking } from './pages/MetroBooking';
import { BookingsPage } from './pages/BookingsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'hotels':
        return <HotelBooking />;
      case 'flights':
        return <FlightBooking />;
      case 'cars':
        return <CarBooking />;
      case 'trains':
        return <TrainBooking />;
      case 'buses':
        return <BusBooking />;
      case 'metro':
        return <MetroBooking />;
      case 'bookings':
        return <BookingsPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
        {renderPage()}
      </div>
    </AuthProvider>
  );
}

export default App;
