import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function RecordDonationModal({ isOpen, onClose, donor, onSave }) {
    const { t } = useTranslation();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        session_id: '',
        quantity: 1,
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (isOpen) {
            // Fetch active sessions
            axios.get('/api/sessions')
                .then(res => {
                    setSessions(res.data);
                    // Default to first session if available
                    if (res.data.length > 0 && !formData.session_id) {
                        setFormData(prev => ({ ...prev, session_id: res.data[0].id }));
                    }
                })
                .catch(err => console.error("Error fetching sessions", err));
        }
    }, [isOpen]);

    if (!isOpen || !donor) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('/api/donations', {
                donor_id: donor.id,
                session_id: formData.session_id,
                quantity: formData.quantity,
                date: formData.date
            });
            onSave();
            onClose();
        } catch (error) {
            console.error("Error recording donation", error);
            alert(t('recording_donation_failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" onClick={onClose}>
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                {t('record_donation_for')} <span className="text-red-600">{donor.name}</span>
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{t('donation_session_event')}</label>
                                    <select
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                        value={formData.session_id}
                                        onChange={(e) => setFormData({ ...formData, session_id: e.target.value })}
                                    >
                                        <option value="">{t('select_a_session')}</option>
                                        {sessions.map(session => (
                                            <option key={session.id} value={session.id}>
                                                {session.location} ({new Date(session.date).toLocaleDateString()})
                                            </option>
                                        ))}
                                    </select>
                                    {sessions.length === 0 && (
                                        <p className="text-xs text-red-500 mt-1">{t('no_sessions_found_error')}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{t('quantity_units')}</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                    />
                                </div>

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
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                disabled={loading || sessions.length === 0}
                                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${loading || sessions.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading ? t('saving') : t('record_donation')}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                {t('cancel')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
