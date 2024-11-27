import React from 'react';

const QuitConfirmation = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg mt-8 w-1/3">
        <h2 className="text-lg font-semibold mb-4">Are you sure you want to quit?</h2>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuitConfirmation;
