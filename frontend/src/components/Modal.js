import React from 'react';

const Modal = ({ isOpen, onClose, title, children, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto">
        <div className="flex justify-between items-center border-b pb-3 mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>
        <div className="text-gray-700 mb-4">
          {children}
        </div>
        {(onConfirm || onClose) && (
          <div className="flex justify-end space-x-3">
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
              >
                {cancelText}
              </button>
            )}
            {onConfirm && (
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
