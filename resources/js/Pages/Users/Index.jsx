import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import UserModal from './UserModal';

export default function UsersIndex() {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm(t('confirm_delete_user'))) return;

        try {
            await axios.delete(`/api/users/${id}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const openCreateModal = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    return (
        <AuthenticatedLayout>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{t('user_management')}</h1>
                    <p className="text-gray-600 mt-1">{t('manage_staff_members')}</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm font-bold"
                >
                    <svg className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {t('add_new_staff')}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">{t('name')}</th>
                                <th className="px-6 py-3">{t('email')}</th>
                                <th className="px-6 py-3">{t('role')}</th>
                                <th className="px-6 py-3 text-right rtl:text-left">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                                    </td>
                                </tr>
                            ) : users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {t(user.role === 'admin' ? 'admin' : 'staff_member')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right rtl:text-left space-x-3 rtl:space-x-reverse">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="text-indigo-600 hover:text-indigo-900 font-medium"
                                            >
                                                {t('edit')}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-600 hover:text-red-900 font-medium"
                                            >
                                                {t('delete')}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                        {t('no_users_found')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={selectedUser}
                onSave={fetchUsers}
            />
        </AuthenticatedLayout>
    );
}
