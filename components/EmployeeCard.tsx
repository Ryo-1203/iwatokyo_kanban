import React from 'react';
import { Employee } from '../types';

interface EmployeeCardProps {
  employee: Employee;
  onSelect: () => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onSelect }) => {
  const isAway = !!(employee.returnTime || employee.destination);

  return (
    <button 
      onClick={onSelect}
      className="w-full text-left p-3 bg-brand-secondary border border-brand-accent rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start">
        <span className={`flex-shrink-0 w-3 h-3 rounded-full mt-1.5 mr-3 ${isAway ? 'bg-red' : 'bg-lime'}`}></span>
        <div className="flex-grow">
          <p className="font-bold text-brand-text">{employee.name}</p>
          {isAway && (
            <div className="mt-1 text-sm text-brand-subtle">
              {employee.returnTime && <p>戻り: {employee.returnTime}</p>}
              {employee.destination && <p>行き先: {employee.destination}</p>}
            </div>
          )}
        </div>
      </div>
    </button>
  );
};