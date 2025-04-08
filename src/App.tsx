
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GamificationDashboard from './pages/dashboard/GamificationDashboard';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gamification" element={<GamificationDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
