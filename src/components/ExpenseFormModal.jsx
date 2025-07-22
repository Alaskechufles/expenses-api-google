import Modal from './Modal';
import ExpenseForm from './ExpenseForm';

const ExpenseFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const handleSubmit = async (formData) => {
        const success = await onSubmit(formData);
        if (success) {
            onClose();
        }
    };

    const isEditing = !!initialData;
    const title = isEditing ? '✏️ Editar Registro' : '➕ Nuevo Registro';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="lg"
        >
            <ExpenseForm
                onSubmit={handleSubmit}
                initialData={initialData}
                onCancel={onClose}
                isModal={true}
            />
        </Modal>
    );
};

export default ExpenseFormModal;
