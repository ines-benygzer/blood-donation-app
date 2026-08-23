import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../Components/LanguageSwitcher';

export default function Login() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/login', {
                email,
                password
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user)); // Contains role
                // Add default header for future requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                navigate('/dashboard'); // Or wherever you want to go after login
            }
        } catch (err) {
            setError(err.response?.data?.message || t('login_failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-white relative overflow-hidden font-sans">
            {/* Background elements to match the design style */}
            <div className="absolute top-0 left-0 w-full h-full bg-white z-0">
                {/* Simulated red blood cells / shapes */}
                <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-red-500 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute bottom-[-100px] right-[-50px] w-64 h-64 bg-red-600 rounded-full opacity-30 blur-2xl"></div>
            </div>

            {/* Language Switcher at Top Right */}
            <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20">
                <LanguageSwitcher />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 max-h-[850px] mx-auto my-auto">
                {/* Text Content */}
                <div className="mb-8 text-center mt-10">
                    <h1 className="text-4xl font-extrabold text-[#b91c1c] tracking-tight leading-tight">
                        {t('hero_slogan_part1')}
                        <br />
                        {t('hero_slogan_part2')}
                    </h1>
                    <p className="mt-2 text-gray-600 text-sm font-medium tracking-wide">
                        {t('saving_lives_spreading_smiles')}
                    </p>

                    {/* Progress bar graphic simulation */}
                    <div className="mt-4 w-12 h-3 bg-red-100 rounded-full mx-auto overflow-hidden relative border border-red-200">
                        <div className="absolute left-0 top-0 h-full w-1/2 bg-red-500 rounded-full"></div>
                    </div>
                </div>

                {/* Illustration Placeholder - Using CSS Shapes to mimic hands connecting pieces */}
                <div className="my-6 relative w-full h-64 flex justify-center items-center">
                    {/* This is a simplified abstract representation because I cannot load the exact asset. */}
                    <div className="relative w-64 h-64 opacity-90">
                        {/* Hand 1 (Left) */}
                        <div className="absolute left-4 top-10 w-24 h-32 bg-gray-400 rounded-full rotate-45 blur-[1px] opacity-20"></div>
                        {/* Hand 2 (Right) */}
                        <div className="absolute right-4 bottom-10 w-24 h-32 bg-gray-400 rounded-full -rotate-45 blur-[1px] opacity-20"></div>

                        {/* Red Connection Line */}
                        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 200 200">
                            <path d="M 40 80 Q 90 120 100 130 T 160 160" fill="none" stroke="#b91c1c" strokeWidth="2" />
                            <circle cx="95" cy="125" r="4" fill="#b91c1c" />
                            <rect x="85" y="115" width="20" height="20" fill="rgba(185, 28, 28, 0.1)" />
                        </svg>

                        {/* Blood Grid at bottom */}
                        <div className="absolute bottom-0 w-full flex flex-wrap justify-center gap-1 opacity-50">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className={`w-8 h-8 rounded-sm flex items-center justify-center text-[8px] font-bold text-white ${i % 2 === 0 ? 'bg-red-600' : 'bg-red-800'}`}>
                                    {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'][i % 8]}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Login Form / Button Area */}
                <div className="w-full max-w-xs mt-auto mb-10">
                    {error && (
                        <div className="mb-4 text-xs text-red-600 bg-red-50 p-2 rounded text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="flex flex-col gap-3">
                        {/* Input fields hidden by default? User asked for button. I will add minimal fields above. */}
                        <div className="space-y-2">
                            <input
                                type="email"
                                placeholder={t('email')}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder={t('password')}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 mt-2 bg-white text-[#b91c1c] font-bold rounded-full shadow-lg border border-red-100 hover:bg-gray-50 transition-all transform active:scale-95 ${loading ? 'opacity-70' : ''}`}
                            style={{ boxShadow: '0 4px 14px 0 rgba(185, 28, 28, 0.15)' }}
                        >
                            {loading ? t('logging_in') : t('login')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
