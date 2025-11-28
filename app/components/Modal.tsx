import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <>

      <div
        className="fixed inset-0 z-40 bg-black/50 cursor-pointer"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto pointer-events-auto">

          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 font-bold text-2xl hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
          </div>


          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
