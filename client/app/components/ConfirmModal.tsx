import React from 'react';

interface ConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

const ConfirmModal = ({ open, onConfirm, onCancel, message }: ConfirmModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
   
      <div
        className="absolute inset-0 backdrop-blur-sm bg-white/30 dark:bg-neutral-800/50"
        onClick={onCancel} // click outside closes
      ></div>

      {/* Modal content */}
      <div className="relative bg-white dark:bg-neutral-800 h-40 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center z-10">
        <p className="mb-6 mt-3 text-gray-800 dark:text-gray-200 text-lg font-medium">
          {message}
        </p>
        <div className="flex justify-center gap-6">
          <button
            onClick={onConfirm}
            className="px-5 py-2  bg-red-500 hover:bg-red-600  hover:scale-110 dark:bg-red-500  dark:hover:bg-red-500/80 cursor-pointer text-white rounded-lg transition-all duration-200 ">
            Delete
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg shadow hover:bg-neutral-300 cursor-pointer dark:hover:bg-neutral-600 transition hover:scale-110 "
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
