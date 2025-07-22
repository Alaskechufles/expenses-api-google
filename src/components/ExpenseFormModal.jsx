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
 * @file ExpenseFormModal.jsx
 * @description Modal que contiene el formulario de gastos e ingresos.
 *              Wrapper para ExpenseForm con funcionalidad de modal.
 * @author Alaskechufles
 * @version 1.0.0
 * @since 2025-07-22
 * @license MIT
 */

import Modal from './Modal';
import ExpenseForm from './ExpenseForm';

/**
 * Modal para formulario de gastos e ingresos
 * @param {Object} props - Props del componente
 * @param {boolean} props.isOpen - Estado de visibilidad del modal
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Function} props.onSubmit - Función para manejar envío del formulario
 * @param {Object|null} [props.initialData=null] - Datos iniciales para edición
 * @returns {JSX.Element} Modal con formulario de gastos
 */
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
