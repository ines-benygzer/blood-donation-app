import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        total_donors: 0,
        monthly_donations: 0,
        blood_stock: [],
        recent_donations: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/dashboard-stats');
                if (response.data && response.data.stats) {
                    setStats({
                        ...response.data.stats,
                        urgent_hospital_requests: response.data.stats.urgent_hospital_requests || []
                    });
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <AuthenticatedLayout>
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
                </div>
            </AuthenticatedLayout>
        );
    }

    if (!stats) return null; // Safety render

    return (
        <AuthenticatedLayout>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{t('dashboard')}</h1>
                    <p className="text-gray-600 mt-1">{t('overview_activities')}</p>
                </div>
            </div>

            {/* Urgent Hospital Requests Banner */}
            {stats.urgent_hospital_requests && stats.urgent_hospital_requests.length > 0 && (
                <div className="mb-8 grid grid-cols-1 gap-4">
                    {stats.urgent_hospital_requests.map((request) => (
                        <div key={request.id} className="bg-red-600 border border-red-700 rounded-xl p-4 flex items-center shadow-lg animate-pulse relative z-10">
                            <div className="flex-shrink-0 bg-white rounded-full p-2 mr-4">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="flex-1 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg leading-tight uppercase">{t('urgent')}: {request.blood_type} {t('needed')}</h3>
                                        <p className="text-red-100 text-sm font-medium">{t('hospital_requires_immediately', { hospital: request.hospital_name, quantity: request.quantity })}</p>
                                    </div>
                                    <a
                                        href="/hospital-requests"
                                        className="inline-flex items-center px-4 py-2 bg-white text-red-600 text-sm font-bold rounded-lg hover:bg-red-50 transition-colors shadow-sm ml-4 rtl:mr-4 rtl:ml-0"
                                    >
                                        {t('view_details')}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 rtl:border-l-0 rtl:border-r-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('total_donors')}</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.total_donors}</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-full text-red-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 rtl:border-l-0 rtl:border-r-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('donations_month')}</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.monthly_donations}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 rtl:border-l-0 rtl:border-r-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('critical_stock')}</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">
                                {stats.blood_stock.filter(s => s.is_critical).length} <span className="text-sm font-normal text-gray-500">{t('types')}</span>
                            </p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Blood Stock Grid */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">{t('blood_stock_levels')}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {stats.blood_stock.map((stock) => (
                            <div key={stock.blood_type} className="relative p-4 rounded-lg bg-gray-50 border border-gray-100 flex flex-col items-center">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2 drop-shadow-md ${stock.is_critical ? 'bg-red-500 animate-pulse' : 'bg-red-600'}`}>
                                    {stock.blood_type}
                                </div>
                                <span className="text-2xl font-bold text-gray-800">{stock.quantity}</span>
                                <span className="text-xs text-gray-500">{t('units')}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Donations List */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">{t('recent_donations')}</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg rtl:rounded-l-none rtl:rounded-r-lg">{t('donor')}</th>
                                    <th className="px-4 py-3">{t('type')}</th>
                                    <th className="px-4 py-3">{t('units')}</th>
                                    <th className="px-4 py-3 rounded-r-lg rtl:rounded-r-none rtl:rounded-l-lg">{t('date')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.recent_donations.length > 0 ? (
                                    stats.recent_donations.map((donation) => (
                                        <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-gray-800">{donation.donor_name}</td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                    {donation.blood_type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{donation.quantity}</td>
                                            <td className="px-4 py-3 text-gray-500 text-sm">
                                                {new Date(donation.date).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                                            {t('no_recent_donations')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
