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
 * @file ExpensesPage.jsx
 * @description Página principal para gestión de gastos e ingresos.
 *              Coordina formularios, tabla de datos y operaciones CRUD.
 * @author Alaskechufles
 * @version 1.0.0
 * @since 2025-07-22
 * @license MIT
 */

import { useState } from 'react';
import ExpenseFormModal from '../components/ExpenseFormModal';
import ExpenseTable from '../components/ExpenseTable';

/**
 * Página principal de gestión de gastos e ingresos
 * @param {Object} props - Props del componente
 * @param {Array} props.data - Datos de gastos e ingresos
 * @param {Array} props.headers - Encabezados de las columnas
 * @param {boolean} props.loading - Estado de carga
 * @param {string|null} props.error - Mensaje de error si existe
 * @param {Function} props.createRow - Función para crear nuevo registro
 * @param {Function} props.updateRow - Función para actualizar registro
 * @param {Function} props.deleteRow - Función para eliminar registro
 * @param {Function} props.loadData - Función para recargar datos
 * @returns {JSX.Element} Página de gestión de gastos
 */
const ExpensesPage = ({
    data,
    headers,
    loading,
    error,
    createRow,
    updateRow,
    deleteRow,
    loadData
}) => {
    const [showForm, setShowForm] = useState(false);
    const [editingRow, setEditingRow] = useState(null);

    // Manejar envío del formulario
    const handleFormSubmit = async (formData) => {
        try {
            let success;
            if (editingRow) {
                success = await updateRow(editingRow.rowIndex, formData);
            } else {
                success = await createRow(formData);
            }

            if (success) {
                setShowForm(false);
                setEditingRow(null);
                return true; // Indicar éxito para cerrar el modal
            }
            return false;
        } catch (err) {
            console.error('Error en formulario:', err);
            return false;
        }
    };

    // Manejar edición
    const handleEdit = (row) => {
        setEditingRow(row);
        setShowForm(true);
    };

    // Manejar eliminación
    const handleDelete = async (rowIndex) => {
        await deleteRow(rowIndex);
    };

    // Cancelar formulario
    const handleCancel = () => {
        setShowForm(false);
        setEditingRow(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">💰 Gastos e Ingresos</h1>
                            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Gestiona tus finanzas personales</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <button
                                onClick={() => setShowForm(true)}
                                disabled={loading || headers.length === 0}
                                className="bg-green-500 hover:bg-green-600 hover:scale-110 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                                ➕ Nuevo Registro
                            </button>
                            <button
                                onClick={loadData}
                                disabled={loading}
                                className="bg-purple-500 hover:bg-purple-600 hover:scale-110 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 text-sm sm:text-base"
                            >
                                🔄 Recargar
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 sm:mb-6 bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-3 rounded-lg text-sm sm:text-base">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <span className="text-xl">❌</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="mb-6 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg">
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-3"></div>
                            <p className="text-sm">Procesando...</p>
                        </div>
                    </div>
                )}

                {showForm && (
                    <ExpenseFormModal
                        isOpen={showForm}
                        onClose={handleCancel}
                        onSubmit={handleFormSubmit}
                        initialData={editingRow?.data}
                    />
                )}

                <ExpenseTable
                    data={data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default ExpensesPage;
