import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function HospitalRequestsIndex() {
    const { t } = useTranslation();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/hospital-requests');
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleFulfill = async (id) => {
        if (!confirm(t('confirm_fulfill_request'))) return;

        try {
            setActionLoading(id);
            await axios.post(`/api/hospital-requests/${id}/fulfill`);
            alert(t('request_fulfilled_successfully'));
            fetchRequests();
        } catch (error) {
            console.error('Error fulfilling request:', error);
            alert(error.response?.data?.message || t('failed_to_fulfill_request'));
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{t('hospital_requests')}</h1>
                    <p className="text-gray-600 mt-1">{t('manage_hospital_requests_description')}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden relative z-10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3">{t('hospital_name')}</th>
                                <th className="px-6 py-3">{t('blood_type')}</th>
                                <th className="px-6 py-3 text-center">{t('quantity')}</th>
                                <th className="px-6 py-3">{t('urgency')}</th>
                                <th className="px-6 py-3">{t('status')}</th>
                                <th className="px-6 py-3 text-right rtl:text-left">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                    </td>
                                </tr>
                            ) : requests.length > 0 ? (
                                requests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {request.hospital_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded">
                                                {request.blood_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-700 font-semibold">
                                            {request.quantity} {t('units')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {request.is_urgent ? (
                                                <span className="flex items-center text-red-600 font-bold text-xs uppercase animate-pulse">
                                                    <svg className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                    {t('urgent')}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-xs uppercase">{t('normal')}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${request.status === 'fulfilled'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {t(request.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {request.status === 'pending' && isAdmin && (
                                                <button
                                                    onClick={() => handleFulfill(request.id)}
                                                    disabled={actionLoading === request.id}
                                                    className={`inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm ${actionLoading === request.id ? 'opacity-50 cursor-not-allowed' : ''
                                                        }`}
                                                >
                                                    {actionLoading === request.id ? t('fulfilling') : t('fulfill_request')}
                                                </button>
                                            )}
                                            {request.status === 'pending' && !isAdmin && (
                                                <span className="text-xs text-gray-400 italic">{t('admin_only')}</span>
                                            )}
                                            {request.status === 'fulfilled' && (
                                                <span className="text-green-600 font-bold text-xs">{t('completed')}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500 italic text-sm">
                                        {t('no_hospital_requests')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Simulated Banner for Urgent Requests */}
            {requests.some(r => r.status === 'pending' && r.is_urgent) && (
                <div className="mt-6 bg-red-600 border border-red-700 rounded-xl p-4 flex items-center shadow-lg animate-pulse relative z-10">
                    <div className="flex-shrink-0 bg-white rounded-full p-2 mr-4 rtl:ml-4 rtl:mr-0">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="flex-1 text-white">
                        <h3 className="font-bold text-lg">{t('urgent_action_required')}</h3>
                        <p className="text-red-100 text-sm">{t('partner_hospitals_urgent_needs')}</p>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
