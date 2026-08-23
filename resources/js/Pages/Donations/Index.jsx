import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function DonationsIndex() {
    const { t } = useTranslation();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDonations = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/donations');
            setDonations(response.data);
        } catch (error) {
            console.error('Error fetching donations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    return (
        <AuthenticatedLayout>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{t('donation_history')}</h1>
                    <p className="text-gray-600 mt-1">{t('log_donations_description')}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">{t('date')}</th>
                                <th className="px-6 py-3">{t('donor')}</th>
                                <th className="px-6 py-3">{t('blood_type')}</th>
                                <th className="px-6 py-3">{t('quantity')}</th>
                                <th className="px-6 py-3">{t('session_location')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                    </td>
                                </tr>
                            ) : donations.length > 0 ? (
                                donations.map((donation) => (
                                    <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-900">
                                            {new Date(donation.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {donation.donor ? donation.donor.name : t('unknown_donor')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800`}>
                                                {donation.donor ? donation.donor.blood_type : '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{donation.quantity} {t('unit_s')}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {donation.session ? donation.session.location : t('unknown_session')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                        {t('no_donations_recorded')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
