import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-dark-900/50 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 text-dark-900 dark:text-dark-100 rounded-xl shadow-2xl max-w-md w-full animate-scale-in transition-colors"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-dark-100 dark:border-dark-800">
          <h2 className="text-xl font-bold text-dark-900 dark:text-white">{title}</h2>
          <button 
            onClick={onClose}
            className="text-dark-400 hover:text-dark-600 dark:hover:text-dark-200 transition-smooth"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
