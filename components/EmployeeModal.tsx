import React, { useState, useEffect } from 'react';
import { Employee } from '../types';
import { CloseIcon } from './icons';

interface EmployeeModalProps {
  employee: Employee;
  onSave: (id: string, returnTime: string, destination: string) => void;
  onClose: () => void;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({ employee, onSave, onClose }) => {
  const [returnTime, setReturnTime] = useState(employee.returnTime || '');
  const [destination, setDestination] = useState(employee.destination || '');
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleSave = () => {
    onSave(employee.id, returnTime, destination);
  };
  
  const handleClear = () => {
    setReturnTime('');
    setDestination('');
    onSave(employee.id, '', '');
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-brand-secondary rounded-lg shadow-2xl p-6 w-full max-w-md relative animate-fade-in-up border border-brand-accent"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-subtle hover:text-brand-text">
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-brand-text">{employee.name}のステータスを更新</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="returnTime" className="block text-sm font-medium text-brand-subtle">戻り時間</label>
            <input
              type="time"
              id="returnTime"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              className="mt-1 block w-full bg-brand-primary border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-brand-text"
            />
          </div>
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-brand-subtle">行き先・理由</label>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="例：クライアントとの会議、昼食"
              className="mt-1 block w-full bg-brand-primary border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-brand-text"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
           <button
            onClick={handleClear}
            className="px-4 py-2 text-sm font-medium rounded-md text-brand-text bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-secondary focus:ring-gray-400 transition-colors"
          >
            ステータスをクリア (在席)
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-secondary focus:ring-indigo-500 transition-colors"
          >
            ステータスを保存
          </button>
        </div>
      </div>
    </div>
  );
};