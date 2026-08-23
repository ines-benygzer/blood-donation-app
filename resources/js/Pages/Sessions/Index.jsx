import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function SessionsIndex() {
    const { t } = useTranslation();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        location: ''
    });

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/sessions');
            setSessions(response.data);
        } catch (error) {
            console.error('Error fetching sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/sessions', formData);
            setIsModalOpen(false);
            setFormData({ date: new Date().toISOString().split('T')[0], location: '' });
            fetchSessions();
        } catch (error) {
            console.error('Error creating session:', error);
            alert(t('failed_to_create_session'));
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{t('donation_sessions')}</h1>
                    <p className="text-gray-600 mt-1">{t('manage_sessions_description')}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm flex items-center"
                >
                    <svg className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    {t('create_session')}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">{t('date')}</th>
                                <th className="px-6 py-3">{t('location')}</th>
                                <th className="px-6 py-3 text-right rtl:text-left">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-10 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                    </td>
                                </tr>
                            ) : sessions.length > 0 ? (
                                sessions.map((session) => (
                                    <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {new Date(session.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {session.location}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(session.location)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 px-2 py-1 rounded-md transition-colors"
                                            >
                                                {t('view_on_map')}
                                                <svg className="w-3 h-3 ml-1 rtl:mr-1 rtl:ml-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-10 text-center text-gray-500">
                                        {t('no_sessions_found')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Session Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" onClick={() => setIsModalOpen(false)}>
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        {t('create_new_session')}
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">{t('date')}</label>
                                            <input
                                                type="date"
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">{t('location_event_name')}</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g., City Hospital, Community Center"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        {t('create_session')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        {t('cancel')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
