import Modal from './Modal';
import { formatCurrency, parseAmount } from '../constants/expenseConstants';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmar Acción",
    message = "¿Estás seguro de que deseas continuar?",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    confirmButtonClass = "bg-red-500 hover:bg-red-600",
    data = null
}) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    // Si hay datos del registro, mostrar información del mismo
    const renderRecordInfo = () => {
        if (!data) return null;

        const amount = parseAmount(data['How Much?']);
        const isIncome = amount > 0;

        return (
            <div className="bg-gray-50 rounded-lg p-4 my-4 space-y-2">
                <h4 className="font-medium text-gray-900 mb-3">📋 Información del registro:</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                        <span className="font-medium text-gray-700">📅 Fecha:</span>
                        <span className="ml-2 text-gray-600">{data['Date']}</span>
                    </div>

                    <div>
                        <span className="font-medium text-gray-700">💰 Monto:</span>
                        <span className={`ml-2 font-medium ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                            {isIncome ? '+' : ''}{formatCurrency(Math.abs(amount))}
                        </span>
                    </div>

                    <div className="sm:col-span-2">
                        <span className="font-medium text-gray-700">📝 Descripción:</span>
                        <span className="ml-2 text-gray-600">{data['Description']}</span>
                    </div>

                    <div>
                        <span className="font-medium text-gray-700">🏷️ Categoría:</span>
                        <span className="ml-2 text-gray-600">{data['Category']}</span>
                    </div>

                    <div>
                        <span className="font-medium text-gray-700">💳 Método:</span>
                        <span className="ml-2 text-gray-600">{data['What payment method?'] || 'No especificado'}</span>
                    </div>

                    <div>
                        <span className="font-medium text-gray-700">🏦 Gestor:</span>
                        <span className="ml-2 text-gray-600">{data['payment manager'] || 'No especificado'}</span>
                    </div>

                    <div>
                        <span className="font-medium text-gray-700">👤 Registrado por:</span>
                        <span className="ml-2 text-gray-600">{data['who recorded'] || 'No especificado'}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center mb-4">
                    <div className="text-3xl mr-3">⚠️</div>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>

                {/* Message */}
                <p className="text-gray-600 mb-4">{message}</p>

                {/* Record Information */}
                {renderRecordInfo()}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                        onClick={handleConfirm}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 hover:scale-105 ${confirmButtonClass}`}
                    >
                        {confirmText}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 hover:scale-105 transition-all duration-200 font-medium"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
