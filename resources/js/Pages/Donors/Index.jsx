import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import DonorModal from './DonorModal';
import RecordDonationModal from './RecordDonationModal';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function DonorsIndex() {
    const { t } = useTranslation();
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRecordDonationModalOpen, setIsRecordDonationModalOpen] = useState(false);
    const [currentDonor, setCurrentDonor] = useState(null);

    const fetchDonors = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/donors');
            // Handle if response.data is array or response.data.data is array (Laravel resource/pagination)
            const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
            setDonors(data);
        } catch (error) {
            console.error('Error fetching donors:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonors();
    }, []);

    const handleDelete = async (id) => {
        if (confirm(t('confirm_delete_donor'))) {
            try {
                await axios.delete(`/api/donors/${id}`);
                setDonors(donors.filter(d => d.id !== id));
            } catch (error) {
                console.error('Error deleting donor:', error);
            }
        }
    };

    const openModal = (donor = null) => {
        setCurrentDonor(donor);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setCurrentDonor(null);
        setIsModalOpen(false);
    };

    const handleSave = () => {
        fetchDonors(); // Refresh list after save
    };

    const filteredDonors = Array.isArray(donors) ? donors.filter(donor => {
        const searchLower = search.toLowerCase();
        const nameMatch = donor.name ? donor.name.toLowerCase().includes(searchLower) : false;
        const phoneMatch = donor.phone ? donor.phone.includes(search) : false;
        const typeMatch = donor.blood_type ? donor.blood_type.toLowerCase().includes(searchLower) : false;

        return nameMatch || phoneMatch || typeMatch;
    }) : [];

    return (
        <AuthenticatedLayout>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{t('donors')}</h1>
                    <p className="text-gray-600 mt-1">{t('manage_donors_registry')}</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="mt-4 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm flex items-center"
                >
                    <svg className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    {t('add_new_donor')}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder={t('search_donors_placeholder')}
                            className="pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">{t('name')}</th>
                                <th className="px-6 py-3">{t('blood_type')}</th>
                                <th className="px-6 py-3">{t('age')}</th>
                                <th className="px-6 py-3">{t('phone')}</th>
                                <th className="px-6 py-3">{t('total_donations')}</th>
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
                            ) : filteredDonors.length > 0 ? (
                                filteredDonors.map((donor) => (
                                    <tr key={donor.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{donor.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                {donor.blood_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{donor.age}</td>
                                        <td className="px-6 py-4 text-gray-600">{donor.phone || '-'}</td>
                                        <td className="px-6 py-4 text-gray-600 font-semibold">{donor.donations_count || 0}</td>
                                        <td className="px-6 py-4 text-right rtl:text-left space-x-2 rtl:space-x-reverse">
                                            <button
                                                onClick={() => openModal(donor)}
                                                className="text-blue-600 hover:text-blue-900 font-medium text-sm"
                                            >
                                                {t('edit')}
                                            </button>
                                            {/* Show Record Donation for everyone, or maybe just staff? Allowing for all for now */}
                                            <button
                                                onClick={() => {
                                                    setCurrentDonor(donor);
                                                    setIsRecordDonationModalOpen(true);
                                                }}
                                                className="text-green-600 hover:text-green-900 font-medium text-sm"
                                            >
                                                {t('donate')}
                                            </button>

                                            {/* Only Admin can delete */}
                                            {JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' && (
                                                <button
                                                    onClick={() => handleDelete(donor.id)}
                                                    className="text-red-600 hover:text-red-900 font-medium text-sm"
                                                >
                                                    {t('delete')}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                        {t('no_donors_found')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <DonorModal
                isOpen={isModalOpen}
                onClose={closeModal}
                donor={currentDonor}
                onSave={handleSave}
            />

            {/* Record Donation Modal */}
            <RecordDonationModal
                isOpen={isRecordDonationModalOpen}
                onClose={() => {
                    setIsRecordDonationModalOpen(false);
                    setCurrentDonor(null);
                }}
                donor={currentDonor}
                onSave={handleSave}
            />
        </AuthenticatedLayout>
    );
}
