import { useState } from 'react';
import { formatCurrency, parseAmount, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/expenseConstants';

const ExpenseTable = ({ data, onEdit, onDelete, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchColumn, setSearchColumn] = useState('Description');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState(''); // 'income', 'expense', ''

    // Filtrar datos
    const filteredData = data.filter(row => {
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

    // Calcular totales
    const totals = filteredData.reduce((acc, row) => {
        const amount = parseAmount(row.data['How Much?']);
        if (amount > 0) {
            acc.income += amount;
        } else {
            acc.expenses += Math.abs(amount);
        }
        return acc;
    }, { income: 0, expenses: 0 });

    const searchableColumns = ['Description', 'Category', 'What payment method?', 'payment manager', 'who recorded'];
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
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold">{formatCurrency(totals.income)}</div>
                        <div className="text-blue-100">💰 Total Ingresos</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">{formatCurrency(totals.expenses)}</div>
                        <div className="text-blue-100">💸 Total Gastos</div>
                    </div>
                    <div className="text-center">
                        <div className={`text-2xl font-bold ${totals.income - totals.expenses >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                            {formatCurrency(totals.income - totals.expenses)}
                        </div>
                        <div className="text-blue-100">📈 Balance</div>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="p-6 bg-gray-50 border-b">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Buscar en:</label>
                        <select
                            value={searchColumn}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría:</label>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos</option>
                            <option value="income">💰 Solo Ingresos</option>
                            <option value="expense">💸 Solo Gastos</option>
                        </select>
                    </div>
                </div>

                {(searchTerm || categoryFilter || typeFilter) && (
                    <div className="mt-4">
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setCategoryFilter('');
                                setTypeFilter('');
                            }}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gestor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredData.map((row, index) => {
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
                                        {row.data['payment manager']}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {row.data['who recorded']}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => onEdit(row)}
                                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                                title="Editar"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => onDelete(row.rowIndex)}
                                                className="text-red-600 hover:text-red-900 transition-colors"
                                                title="Eliminar"
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

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t">
                <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>
                        Mostrando {filteredData.length} de {data.length} registros
                    </span>
                    <span>
                        Balance filtrado:
                        <span className={`ml-2 font-medium ${totals.income - totals.expenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(totals.income - totals.expenses)}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ExpenseTable;
