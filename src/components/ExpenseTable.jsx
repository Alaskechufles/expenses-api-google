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
 * @file ExpenseTable.jsx
 * @description Tabla de gastos e ingresos con funcionalidades avanzadas.
 *              Incluye filtrado, búsqueda, paginación y confirmación de eliminación.
 * @author Alaskechufles
 * @version 1.0.0
 * @since 2025-07-22
 * @license MIT
 */

import { useState } from 'react';
import { formatCurrency, parseAmount, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/expenseConstants';
import ConfirmModal from './ConfirmModal';

/**
 * Tabla de gastos e ingresos con funcionalidades completas
 * @param {Object} props - Props del componente
 * @param {Array} props.data - Datos de gastos e ingresos
 * @param {Function} props.onEdit - Función para editar registro
 * @param {Function} props.onDelete - Función para eliminar registro
 * @param {boolean} props.loading - Estado de carga
 * @returns {JSX.Element} Tabla con funcionalidades avanzadas
 */
const ExpenseTable = ({ data, onEdit, onDelete, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchColumn, setSearchColumn] = useState('Description');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState(''); // 'income', 'expense', ''
    const [monthFilter, setMonthFilter] = useState(() => {
        // Por defecto, mes actual
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const recordsPerPage = 10;

    // Generar lista de meses disponibles desde los datos
    const currentMonth = (() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    })();
    
    const availableMonths = [...new Set([
        currentMonth,
        ...data.map(row => {
            if (row.data['Date']) {
                const date = new Date(row.data['Date']);
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            }
            return null;
        }).filter(Boolean)
    ])].sort().reverse();

    // Ordenar datos por fecha (más reciente primero) y luego por índice descendente
    const sortedData = [...data].sort((a, b) => {
        // Si hay fechas, ordenar por fecha descendente
        if (a.data['Date'] && b.data['Date']) {
            return new Date(b.data['Date']) - new Date(a.data['Date']);
        }
        // Si no hay fechas, ordenar por índice descendente (último registro primero)
        return b.rowIndex - a.rowIndex;
    });

    // Filtrar datos
    const filteredData = sortedData.filter(row => {
        // Filtro de mes
        if (monthFilter) {
            const date = row.data['Date'] ? new Date(row.data['Date']) : null;
            if (date) {
                const rowMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (rowMonth !== monthFilter) return false;
            } else {
                return false; // Si no tiene fecha, no mostrar cuando hay filtro de mes
            }
        }

        // Filtro de búsqueda
        if (searchTerm) {
            const value = row.data[searchColumn];
            if (!value || !value.toString().toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }
        }

        // Filtro de categoría
        if (categoryFilter && row.data['Category'] !== categoryFilter) {
            return false;
        }

        // Filtro de tipo (ingreso/gasto)
        if (typeFilter) {
            const amount = parseAmount(row.data['How Much?']);
            if (typeFilter === 'income' && amount <= 0) return false;
            if (typeFilter === 'expense' && amount >= 0) return false;
        }

        return true;
    });

    // Resetear página a 1 cuando cambian los filtros
    const resetPageWhenFiltering = (value, setter) => {
        setter(value);
        setCurrentPage(1);
    };

    // Manejar modal de confirmación para eliminar
    const handleDeleteClick = (row) => {
        setRecordToDelete(row);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (recordToDelete) {
            onDelete(recordToDelete.rowIndex);
        }
        setShowDeleteModal(false);
        setRecordToDelete(null);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setRecordToDelete(null);
    };

    // Paginación
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // Calcular totales (de todos los datos filtrados, no solo la página actual)
    const totals = filteredData.reduce((acc, row) => {
        const amount = parseAmount(row.data['How Much?']);
        if (amount > 0) {
            acc.income += amount;
        } else {
            acc.expenses += Math.abs(amount);
        }
        return acc;
    }, { income: 0, expenses: 0 });

    const searchableColumns = ['Description', 'Category', 'What payment method?', 'who recorded'];
    const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].sort();

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Cargando datos...</span>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg shadow">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay datos</h3>
                <p className="text-gray-500">¡Agrega tu primer gasto o ingreso!</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Resumen de totales */}
            <div className="bg-gradient-to-r from-green-500 to-purple-600 text-white p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold">{formatCurrency(totals.income)}</div>
                        <div className="text-green-100">💰 Total Ingresos</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">{formatCurrency(totals.expenses)}</div>
                        <div className="text-green-100">💸 Total Gastos</div>
                    </div>
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${totals.income - totals.expenses >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                            {formatCurrency(totals.income - totals.expenses)}
                        </div>
                        <div className="text-green-100">📈 Balance</div>
                    </div>
                </div>
            </div>

            {/* Botón de filtros y filtros */}
            <div className="p-6 bg-gray-50 border-b">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="bg-green-500 hover:bg-green-600 hover:scale-110 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                    >
                        {showFilters ? '🔍 Ocultar Filtros' : '🔍 Mostrar Filtros'}
                    </button>

                    <span className="text-sm text-gray-600">
                        Total: {filteredData.length} registro{filteredData.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 animate-fadeIn">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mes:</label>
                            <select
                                value={monthFilter}
                                onChange={(e) => resetPageWhenFiltering(e.target.value, setMonthFilter)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Todos los meses</option>
                                {availableMonths.map(month => {
                                    const [year, m] = month.split('-');
                                    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                                                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                                    return (
                                        <option key={month} value={month}>
                                            {monthNames[parseInt(m) - 1]} {year}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar en:</label>
                            <select
                                value={searchColumn}
                                onChange={(e) => resetPageWhenFiltering(e.target.value, setSearchColumn)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                {searchableColumns.map(column => (
                                    <option key={column} value={column}>{column}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Término:</label>
                            <input
                                type="text"
                                placeholder={`Buscar en ${searchColumn}...`}
                                value={searchTerm}
                                onChange={(e) => resetPageWhenFiltering(e.target.value, setSearchTerm)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría:</label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => resetPageWhenFiltering(e.target.value, setCategoryFilter)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Todas las categorías</option>
                                {allCategories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo:</label>
                            <select
                                value={typeFilter}
                                onChange={(e) => resetPageWhenFiltering(e.target.value, setTypeFilter)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Todos</option>
                                <option value="income">💰 Solo Ingresos</option>
                                <option value="expense">💸 Solo Gastos</option>
                            </select>
                        </div>

                        
                    </div>
                )}

                {(searchTerm || categoryFilter || typeFilter || monthFilter) && (
                    <div className="mt-4">
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setCategoryFilter('');
                                setTypeFilter('');
                                setMonthFilter('');
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 hover:scale-110 transition-all duration-200"
                        >
                            🔄 Limpiar Filtros
                        </button>
                    </div>
                )}
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.map((row, index) => {
                            const amount = parseAmount(row.data['How Much?']);
                            const isIncome = amount > 0;

                            return (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {row.data['Date']}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="max-w-xs truncate" title={row.data['Description']}>
                                            {row.data['Description']}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${INCOME_CATEGORIES.includes(row.data['Category'])
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {row.data['Category']}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <span className={isIncome ? 'text-green-600' : 'text-red-600'}>
                                            {isIncome ? '+' : ''}{formatCurrency(Math.abs(amount))}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {row.data['What payment method?']}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {row.data['who recorded']}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => onEdit(row)}
                                                className="text-green-600 hover:text-green-900 transition-colors duration-200 hover:scale-110 transform"
                                                title="Editar registro (Modal)"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(row)}
                                                className="text-purple-600 hover:text-purple-900 transition-colors duration-200 hover:scale-110 transform"
                                                title="Eliminar registro"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Footer con paginación */}
            <div className="px-6 py-4 bg-gray-50 border-t">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-600">
                        <span>
                            Mostrando {startIndex + 1}-{Math.min(endIndex, filteredData.length)} de {filteredData.length} registros
                        </span>
                        <span className="block sm:inline sm:ml-4">
                            Balance filtrado:
                            <span className={`ml-2 font-medium ${totals.income - totals.expenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(totals.income - totals.expenses)}
                            </span>
                        </span>
                    </div>

                    {/* Controles de paginación */}
                    {totalPages > 1 && (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                ← Anterior
                            </button>

                            <div className="flex space-x-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(page => {
                                        // Mostrar solo páginas cercanas a la actual
                                        if (totalPages <= 7) return true;
                                        if (page === 1 || page === totalPages) return true;
                                        if (Math.abs(page - currentPage) <= 1) return true;
                                        return false;
                                    })
                                    .map((page, index, array) => {
                                        // Añadir puntos suspensivos si hay saltos
                                        const prevPage = array[index - 1];
                                        const showEllipsis = prevPage && page - prevPage > 1;

                                        return (
                                            <div key={page} className="flex items-center">
                                                {showEllipsis && (
                                                    <span className="px-2 py-1 text-gray-500">...</span>
                                                )}
                                                <button
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`px-3 py-1 rounded-md transition-all duration-200 hover:scale-110 ${currentPage === page
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            </div>
                                        );
                                    })}
                            </div>

                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                Siguiente →
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de confirmación para eliminar */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="⚠️ Confirmar Eliminación"
                message="¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer."
                confirmText="🗑️ Eliminar Registro"
                cancelText="❌ Cancelar"
                confirmButtonClass="bg-purple-500 hover:bg-purple-600"
                data={recordToDelete?.data}
            />
        </div>
    );
};

export default ExpenseTable;
