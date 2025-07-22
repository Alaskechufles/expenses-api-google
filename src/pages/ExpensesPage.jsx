import { useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseTable from '../components/ExpenseTable';

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
            }
        } catch (err) {
            console.error('Error en formulario:', err);
        }
    };

    // Manejar edición
    const handleEdit = (row) => {
        setEditingRow(row);
        setShowForm(true);
    };

    // Manejar eliminación
    const handleDelete = async (rowIndex) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
            await deleteRow(rowIndex);
        }
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
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                                ➕ Nuevo Registro
                            </button>
                            <button
                                onClick={loadData}
                                disabled={loading}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors disabled:opacity-50 text-sm sm:text-base"
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
                    <ExpenseForm
                        onSubmit={handleFormSubmit}
                        initialData={editingRow?.data}
                        onCancel={handleCancel}
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
