import { useState, useEffect } from 'react';
import {
    TRANSACTION_TYPES,
    EXPENSE_CATEGORIES,
    INCOME_CATEGORIES,
    PAYMENT_METHODS,
    PAYMENT_MANAGERS,
    RECORDERS,
    SHEET_HEADERS,
    formatDate,
    parseAmount
} from '../constants/expenseConstants';

const ExpenseForm = ({ onSubmit, initialData = null, onCancel, isModal = false }) => {
    const [formData, setFormData] = useState({
        'Date': formatDate(),
        'Description': '',
        'Category': '',
        'How Much?': '',
        'What payment method?': '',
        'payment manager': '',
        'who recorded': ''
    });

    const [transactionType, setTransactionType] = useState(TRANSACTION_TYPES.EXPENSE);

    useEffect(() => {
        if (initialData) {
            setFormData({
                'Date': formatDate(initialData['Date']),
                'Description': initialData['Description'] || '',
                'Category': initialData['Category'] || '',
                'How Much?': initialData['How Much?'] || '',
                'What payment method?': initialData['What payment method?'] || '',
                'payment manager': initialData['payment manager'] || '',
                'who recorded': initialData['who recorded'] || ''
            });

            // Determinar el tipo de transacción basado en la categoría
            if (INCOME_CATEGORIES.includes(initialData['Category'])) {
                setTransactionType(TRANSACTION_TYPES.INCOME);
            } else {
                setTransactionType(TRANSACTION_TYPES.EXPENSE);
            }
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTransactionTypeChange = (type) => {
        setTransactionType(type);
        // Limpiar categoría cuando cambia el tipo
        setFormData(prev => ({
            ...prev,
            'Category': ''
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validaciones
        if (!formData['Description'].trim()) {
            alert('La descripción es obligatoria');
            return;
        }

        if (!formData['Category']) {
            alert('La categoría es obligatoria');
            return;
        }

        const amount = parseAmount(formData['How Much?']);
        if (amount <= 0) {
            alert('El monto debe ser mayor a 0');
            return;
        }

        // Formatear los datos antes de enviar
        const finalData = {
            ...formData,
            'How Much?': transactionType === TRANSACTION_TYPES.EXPENSE ? `-${amount}` : `${amount}`
        };

        onSubmit(finalData);
    };

    const isEditing = initialData !== null;
    const categories = transactionType === TRANSACTION_TYPES.EXPENSE ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

    // Contenedor diferente si es modal o no
    const containerClasses = isModal
        ? "" // Sin estilos adicionales cuando es modal
        : "bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6";

    const titleElement = isModal
        ? null // No mostrar título en modal (ya está en el header del modal)
        : (
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                {isEditing ? '✏️ Editar Registro' : '➕ Nuevo Registro'}
            </h3>
        );

    return (
        <div className={containerClasses}>
            {titleElement}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Tipo de Transacción */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Transacción
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                        <button
                            type="button"
                            onClick={() => handleTransactionTypeChange(TRANSACTION_TYPES.EXPENSE)}
                            className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${transactionType === TRANSACTION_TYPES.EXPENSE
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            💸 Gasto
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTransactionTypeChange(TRANSACTION_TYPES.INCOME)}
                            className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${transactionType === TRANSACTION_TYPES.INCOME
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            💰 Ingreso
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Fecha */}
                    <div>
                        <label htmlFor="Date" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                            📅 Fecha *
                        </label>
                        <input
                            type="date"
                            id="Date"
                            name="Date"
                            value={formData['Date']}
                            onChange={handleChange}
                            className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                            required
                        />
                    </div>

                    {/* Monto */}
                    <div>
                        <label htmlFor="How Much?" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                            � Monto * ({transactionType === TRANSACTION_TYPES.EXPENSE ? 'Gasto' : 'Ingreso'})
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            id="How Much?"
                            name="How Much?"
                            value={formData['How Much?'].toString().replace('-', '')}
                            onChange={handleChange}
                            placeholder="0.00"
                            className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                            required
                        />
                    </div>
                </div>

                {/* Descripción */}
                <div>
                    <label htmlFor="Description" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        📝 Descripción *
                    </label>
                    <input
                        type="text"
                        id="Description"
                        name="Description"
                        value={formData['Description']}
                        onChange={handleChange}
                        placeholder="Ej: Compra en supermercado, Salario mensual..."
                        className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                        required
                    />
                </div>

                {/* Categoría */}
                <div>
                    <label htmlFor="Category" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        🏷️ Categoría *
                    </label>
                    <select
                        id="Category"
                        name="Category"
                        value={formData['Category']}
                        onChange={handleChange}
                        className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                        required
                    >
                        <option value="">Selecciona una categoría</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Método de Pago */}
                    <div>
                        <label htmlFor="What payment method?" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                            💳 Método de Pago
                        </label>
                        <select
                            id="What payment method?"
                            name="What payment method?"
                            value={formData['What payment method?']}
                            onChange={handleChange}
                            className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                        >
                            <option value="">Selecciona método</option>
                            {PAYMENT_METHODS.map(method => (
                                <option key={method} value={method}>{method}</option>
                            ))}
                        </select>
                    </div>

                    {/* Gestor de Pago */}
                    <div>
                        <label htmlFor="payment manager" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                            🏦 Gestor de Pago
                        </label>
                        <select
                            id="payment manager"
                            name="payment manager"
                            value={formData['payment manager']}
                            onChange={handleChange}
                            className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                        >
                            <option value="">Selecciona gestor</option>
                            {PAYMENT_MANAGERS.map(manager => (
                                <option key={manager} value={manager}>{manager}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Quien Registró */}
                <div>
                    <label htmlFor="who recorded" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        👤 Quien Registró
                    </label>
                    <select
                        id="who recorded"
                        name="who recorded"
                        value={formData['who recorded']}
                        onChange={handleChange}
                        className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                    >
                        <option value="">Selecciona usuario</option>
                        {RECORDERS.map(recorder => (
                            <option key={recorder} value={recorder}>{recorder}</option>
                        ))}
                    </select>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                        type="submit"
                        className={`flex-1 px-4 sm:px-6 py-3 sm:py-3 rounded-lg font-medium text-white transition-colors text-sm sm:text-base ${transactionType === TRANSACTION_TYPES.EXPENSE
                            ? 'bg-purple-500 hover:bg-purple-600'
                            : 'bg-green-500 hover:bg-green-600'
                            }`}
                    >
                        {isEditing ? '✅ Actualizar' : '💾 Guardar'} {transactionType}
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 sm:px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base sm:flex-shrink-0"
                        >
                            ❌ Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ExpenseForm;
