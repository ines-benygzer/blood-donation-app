import './bootstrap';
import '../css/app.css';
import './i18n';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import DonorsIndex from './Pages/Donors/Index';
import BloodStockIndex from './Pages/BloodStock/Index';
import SessionsIndex from './Pages/Sessions/Index';
import DonationsIndex from './Pages/Donations/Index';
import HospitalRequestsIndex from './Pages/HospitalRequests/Index';
import UsersIndex from './Pages/Users/Index';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/donors" element={<DonorsIndex />} />
                <Route path="/blood-stock" element={<BloodStockIndex />} />
                <Route path="/sessions" element={<SessionsIndex />} />
                <Route path="/donations" element={<DonationsIndex />} />
                <Route path="/hospital-requests" element={<HospitalRequestsIndex />} />
                <Route path="/staff" element={<UsersIndex />} />
            </Routes>
        </Router>
    );
}

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
