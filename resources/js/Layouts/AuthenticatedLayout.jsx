import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../Components/LanguageSwitcher';

export default function AuthenticatedLayout({ children }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            navigate('/');
        } catch (error) {
            console.error('Logout failed', error);
            // Force logout on error
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
        }
    };

    const navLinks = [
        { name: t('dashboard'), path: '/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { name: t('donors'), path: '/donors', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { name: t('blood_stock'), path: '/blood-stock', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
        { name: t('sessions'), path: '/sessions', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { name: t('donations'), path: '/donations', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { name: t('hospital_requests'), path: '/hospital-requests', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        ...(user.role === 'admin' ? [{ name: t('staff'), path: '/staff', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' }] : [])
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-red-950 text-white hidden md:block flex-shrink-0 relative overflow-hidden group">
                {/* CSS Animation for Blood Flooding */}
                <style>
                    {`
                    @keyframes wave {
                      0% { transform: translateX(0) translateZ(0) scaleY(1); }
                      50% { transform: translateX(-25%) translateZ(0) scaleY(0.8); }
                      100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
                    }
                    .blood-wave {
                      animation: wave 10s linear infinite;
                    }
                    `}
                </style>

                {/* Blood Flooding Effect Container */}
                <div className="absolute inset-x-0 bottom-0 z-0 pointer-events-none h-3/4">
                    {/* Background Blood Fill */}
                    <div className="absolute inset-x-0 bottom-0 bg-red-800 h-1/2 opacity-60"></div>

                    {/* Layered Waves */}
                    <div className="absolute inset-x-0 bottom-[45%] h-32 opacity-40">
                        <svg className="blood-wave w-[200%] h-full block" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path d="M0 10 Q 12.5 0 25 10 T 50 10 T 75 10 T 100 10 V 20 H 0 Z" fill="#b91c1c" />
                            <path d="M100 10 Q 112.5 0 125 10 T 150 10 T 175 10 T 200 10 V 20 H 100 Z" fill="#b91c1c" />
                        </svg>
                    </div>

                    <div className="absolute inset-x-0 bottom-[48%] h-32 opacity-30">
                        <svg className="blood-wave w-[200%] h-full block" style={{ animationDuration: '7s', animationDirection: 'reverse' }} viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path d="M0 10 Q 12.5 20 25 10 T 50 10 T 75 10 T 100 10 V 20 H 0 Z" fill="#991b1b" />
                            <path d="M100 10 Q 112.5 20 125 10 T 150 10 T 175 10 T 200 10 V 20 H 100 Z" fill="#991b1b" />
                        </svg>
                    </div>
                </div>

                <div className="relative z-10 h-full flex flex-col">
                    <div className="p-6 flex items-center justify-center border-b border-red-800/50">
                        <span className="text-2xl font-bold tracking-wider">BLOOD APP</span>
                    </div>
                    <nav className="mt-8 px-4 space-y-2 flex-grow">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 relative group overflow-hidden ${location.pathname === link.path
                                    ? 'bg-red-800/80 text-white shadow-lg'
                                    : 'text-red-100 hover:bg-red-800/40 hover:text-white'
                                    }`}
                            >
                                <svg className="w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                                </svg>
                                <span className="relative z-10">{link.name}</span>
                            </Link>
                        ))}
                    </nav>
                    <div className="p-4 border-t border-red-800/50">
                        <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-sm text-red-100 hover:bg-red-700/50 rounded-lg transition-colors">
                            <svg className="w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            {t('logout')}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
                {/* Background elements (Behind content) */}
                <div className="absolute top-0 left-0 w-full h-full bg-gray-50 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-red-500 rounded-full opacity-10 blur-xl"></div>
                    <div className="absolute bottom-[-100px] right-[-50px] w-64 h-64 bg-red-600 rounded-full opacity-10 blur-2xl"></div>
                    <div className="absolute top-[20%] right-[10%] w-32 h-32 bg-red-400 rounded-full opacity-10 blur-xl"></div>
                </div>

                {/* Top Desktop Navigation */}
                <div className="hidden md:flex items-center justify-end px-6 py-4 relative z-20">
                    <LanguageSwitcher />
                </div>

                {/* Mobile Header */}
                <header className="bg-white shadow md:hidden relative z-10">
                    <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-xl font-bold text-red-800">BLOOD APP</span>
                        <div className="flex items-center space-x-2">
                            <LanguageSwitcher />
                            <button onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)} className="text-gray-500 focus:outline-none">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                        </div>
                    </div>
                    {showingNavigationDropdown && (
                        <nav className="bg-white px-2 pt-2 pb-4 space-y-1 border-t">
                            {navLinks.map((link) => (
                                <Link key={link.name} to={link.path} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">{link.name}</Link>
                            ))}
                            <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">{t('logout')}</button>
                        </nav>
                    )}
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 relative z-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
