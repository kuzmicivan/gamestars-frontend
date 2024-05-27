import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded shadow-lg max-w-md w-full">
        <button
          onClick={onClose}
          className="text-white absolute top-2 right-2"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
