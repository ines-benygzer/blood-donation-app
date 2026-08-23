import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function UpdateStockModal({ isOpen, onClose, stock, onSave }) {
    const { t } = useTranslation();
    const [quantity, setQuantity] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (stock) {
            setQuantity(stock.quantity);
        }
    }, [stock]);

    if (!isOpen || !stock) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.put(`/api/blood-stocks/${stock.id}`, {
                quantity: parseInt(quantity)
            });
            onSave();
            onClose();
        } catch (err) {
            console.error('Error updating stock:', err);
            setError(t('failed_to_update_stock'));
        } finally {
            setLoading(false);
        }
    };

    const adjustQuantity = (amount) => {
        setQuantity(prev => Math.max(0, parseInt(prev || 0) + amount));
    };

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${stock.quantity < 5 ? 'bg-red-100' : 'bg-blue-100'}`}>
                                <span className={`text-lg font-bold ${stock.quantity < 5 ? 'text-red-600' : 'text-blue-600'}`}>
                                    {stock.blood_type}
                                </span>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    {t('update_stock_level')}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 mb-4">
                                        {t('update_inventory_description', { type: stock.blood_type })}
                                    </p>

                                    {error && (
                                        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                                            <p className="text-sm text-red-700">{error}</p>
                                        </div>
                                    )}

                                    <form id="update-stock-form" onSubmit={handleSubmit}>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                                    {t('quantity_units')}
                                                </label>
                                                <div className="mt-1 flex rounded-md shadow-sm">
                                                    <input
                                                        type="number"
                                                        name="quantity"
                                                        id="quantity"
                                                        min="0"
                                                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border-gray-300 focus:ring-red-500 focus:border-red-500 sm:text-sm border"
                                                        value={quantity}
                                                        onChange={(e) => setQuantity(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Adjustment Buttons */}
                                        <div className="mt-4 flex gap-2 justify-center sm:justify-start">
                                            <button
                                                type="button"
                                                onClick={() => adjustQuantity(-1)}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium transition-colors"
                                            >
                                                -1
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => adjustQuantity(1)}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium transition-colors"
                                            >
                                                +1
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => adjustQuantity(5)}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium transition-colors"
                                            >
                                                +5
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="submit"
                            form="update-stock-form"
                            disabled={loading}
                            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${loading ? 'opacity-75 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? t('saving') : t('save_changes')}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            {t('cancel')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
