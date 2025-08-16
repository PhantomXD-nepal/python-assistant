'use client';

import { X } from 'lucide-react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailModal = ({ isOpen, onClose }: EmailModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <p className="mb-4">To select a plan, please send an email to:</p>
        <a href="mailto:saraswoti.ai@example.com" className="text-blue-500 font-bold">saraswoti.ai@example.com</a>
        <p className="mt-4 text-sm text-gray-600">Please include the plan you are interested in in the subject line.</p>
      </div>
    </div>
  );
};

export default EmailModal;
