/**
 * Copyright (c) 2025 Alaskechufles
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * @file ExpenseForm.jsx
 * @description Formulario principal para crear y editar registros de gastos e ingresos.
 *              Incluye validación, manejo de errores, tipos de transacción y integración con modales.
 * @author Alaskechufles
 * @version 1.0.0
 * @since 2025-07-22
 * @license MIT
 */

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

/**
 * Componente de formulario para crear y editar registros de gastos e ingresos.
 * 
 * @component
 * @param {Object} props - Las propiedades del componente
 * @param {Function} props.onSubmit - Función callback que se ejecuta al enviar el formulario
 * @param {Object|null} props.initialData - Datos iniciales para editar un registro existente
 * @param {Function} [props.onCancel] - Función callback para cancelar la operación (opcional)
 * @param {boolean} [props.isModal=false] - Indica si el formulario se muestra dentro de un modal
 * 
 * @returns {JSX.Element} El componente de formulario renderizado
 * 
 * @example
 * // Crear nuevo registro
 * <ExpenseForm onSubmit={handleCreateExpense} />
 * 
 * @example
 * // Editar registro existente
 * <ExpenseForm 
 *   onSubmit={handleUpdateExpense}
 *   initialData={expenseData}
 *   onCancel={handleCancel}
 *   isModal={true}
 * />
 */
const ExpenseForm = ({ onSubmit, initialData = null, onCancel, isModal = false }) => {
    // Estado para almacenar los datos del formulario
    const [formData, setFormData] = useState({
        'Date': formatDate(),
        'Description': '',
        'Category': '',
        'How Much?': '',
        'What payment method?': '',
        'payment manager': '',
        'who recorded': ''
    });

    // Estado para el tipo de transacción (Gasto/Ingreso)
    const [transactionType, setTransactionType] = useState(TRANSACTION_TYPES.EXPENSE);

    // Estado para manejar errores de validación
    const [errors, setErrors] = useState([]);

    /**
     * Efecto para cargar datos iniciales cuando se edita un registro existente
     */

    useEffect(() => {
        if (initialData) {
            // Para el monto, asegurémonos de mostrar solo el valor absoluto
            const rawAmount = initialData['How Much?'] || '';
            const absoluteAmount = Math.abs(parseAmount(rawAmount)).toString();

            setFormData({
                'Date': formatDate(initialData['Date']),
                'Description': initialData['Description'] || '',
                'Category': initialData['Category'] || '',
                'How Much?': absoluteAmount,
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

    /**
     * Maneja los cambios en los campos del formulario
     * @param {Event} e - Evento de cambio del input
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar errores cuando el usuario empiece a escribir
        if (errors.length > 0) {
            setErrors([]);
        }
    };

    /**
     * Maneja el cambio de tipo de transacción (Gasto/Ingreso)
     * @param {string} type - Tipo de transacción seleccionado
     */
    const handleTransactionTypeChange = (type) => {
        setTransactionType(type);
        // Limpiar categoría cuando cambia el tipo
        setFormData(prev => ({
            ...prev,
            'Category': ''
        }));
        // Limpiar errores
        if (errors.length > 0) {
            setErrors([]);
        }
    };

    /**
     * Maneja el envío del formulario, incluyendo validación de datos
     * @param {Event} e - Evento de envío del formulario
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        // Limpiar errores previos
        setErrors([]);
        const newErrors = [];

        // Validaciones
        if (!formData['Description'].trim()) {
            newErrors.push('La descripción es obligatoria');
        }

        if (!formData['Category']) {
            newErrors.push('La categoría es obligatoria');
        }

        const amount = parseAmount(formData['How Much?']);
        if (!formData['How Much?'] || amount <= 0) {
            newErrors.push('El monto debe ser mayor a 0');
        }

        // Si hay errores, mostrarlos y no enviar el formulario
        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        // Formatear los datos antes de enviar
        const finalData = {
            ...formData,
            'How Much?': transactionType === TRANSACTION_TYPES.EXPENSE ? `-${amount}` : `${amount}`
        };

        onSubmit(finalData);
    };

    // Variables derivadas para la renderización
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

            {/* Mostrar errores de validación */}
            {errors.length > 0 && (
                <div className="mb-4 sm:mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <span className="text-xl">⚠️</span>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                Por favor corrige los siguientes errores:
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                <ul className="list-disc list-inside space-y-1">
                                    {errors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                            min="0.01"
                            id="How Much?"
                            name="How Much?"
                            value={Math.abs(parseFloat(formData['How Much?']) || 0) || ''}
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
