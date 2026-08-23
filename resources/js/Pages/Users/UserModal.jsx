import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function UserModal({ isOpen, onClose, user, onSave }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'staff'
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '', // Don't pre-fill password
                role: user.role || 'staff'
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'staff'
            });
        }
        setErrors({});
    }, [user, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            if (user) {
                // For update, password might be empty if not changing
                const data = { ...formData };
                if (!data.password) delete data.password;
                await axios.put(`/api/users/${user.id}`, data);
            } else {
                await axios.post('/api/users', formData);
            }
            onSave();
            onClose();
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Error saving user:', error);
            }
        } finally {
            setProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            {user ? t('edit_user') : t('add_user')}
                        </h3>
                        {errors && Object.keys(errors).length > 0 && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">{t('whoops')}</strong>
                                <span className="block sm:inline"> {t('input_problems')}</span>
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    {t('name')}
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={processing}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:bg-gray-100"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-xs italic">{errors.name[0]}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    {t('email')}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={processing}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:bg-gray-100"
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-xs italic">{errors.email[0]}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    {t('password')} {user && `(${t('leave_blank_to_keep_current')})`}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={processing}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:bg-gray-100"
                                    required={!user}
                                />
                                {errors.password && <p className="text-red-500 text-xs italic">{errors.password[0]}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                                    {t('role')}
                                </label>
                                <select
                                    name="role"
                                    id="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    disabled={processing}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:bg-gray-100"
                                >
                                    <option value="staff">{t('staff_member')}</option>
                                    <option value="admin">{t('admin')}</option>
                                </select>
                                {errors.role && <p className="text-red-500 text-xs italic">{errors.role[0]}</p>}
                            </div>

                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse -mx-6 -mb-6 mt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                >
                                    {processing ? t('saving') : t('save')}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={processing}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                >
                                    {t('cancel')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
