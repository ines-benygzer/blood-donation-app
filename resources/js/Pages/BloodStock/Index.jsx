import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import UpdateStockModal from './UpdateStockModal';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function BloodStockIndex() {
    const { t } = useTranslation();
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStock, setCurrentStock] = useState(null);

    const fetchStocks = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/blood-stocks');
            setStocks(response.data);
        } catch (error) {
            console.error('Error fetching blood stocks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStocks();
    }, []);

    const handleUpdateClick = (stock) => {
        setCurrentStock(stock);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        fetchStocks();
    };

    const getStockStatus = (quantity) => {
        if (quantity < 5) return { color: 'red', label: t('critical') };
        if (quantity < 15) return { color: 'yellow', label: t('low') };
        return { color: 'green', label: t('good') };
    };

    return (
        <AuthenticatedLayout>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{t('blood_stock')}</h1>
                    <p className="text-gray-600 mt-1">{t('monitor_inventory_levels')}</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button
                        onClick={fetchStocks}
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                        title={t('refresh_data')}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stocks.map((stock) => {
                        const status = getStockStatus(stock.quantity);
                        const statusColors = {
                            red: 'bg-red-50 border-red-200 text-red-700',
                            yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
                            green: 'bg-green-50 border-green-200 text-green-700',
                        };
                        const iconColors = {
                            red: 'bg-red-100 text-red-600',
                            yellow: 'bg-yellow-100 text-yellow-600',
                            green: 'bg-green-100 text-green-600',
                        };

                        return (
                            <div
                                key={stock.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative"
                            >
                                <div className={`absolute top-0 inset-x-0 h-1 ${status.color === 'red' ? 'bg-red-500' : status.color === 'yellow' ? 'bg-yellow-400' : 'bg-green-500'}`}></div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${iconColors[status.color]}`}>
                                            {stock.blood_type}
                                        </div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[status.color]}`}>
                                            {status.label}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-4xl font-bold text-gray-800">
                                            {stock.quantity}
                                            <span className="text-sm font-normal text-gray-500 ml-1 rtl:mr-1 rtl:ml-0">{t('units')}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleUpdateClick(stock)}
                                        className="w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                    >
                                        {t('update_stock')}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <UpdateStockModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                stock={currentStock}
                onSave={handleSave}
            />
        </AuthenticatedLayout>
    );
}
