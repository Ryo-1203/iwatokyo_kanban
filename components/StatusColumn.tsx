import React from 'react';
import { Employee } from '../types';
import { EmployeeCard } from './EmployeeCard';

interface StatusColumnProps {
  title: string;
  employees: Employee[];
  onSelectEmployee: (employee: Employee) => void;
}

export const StatusColumn: React.FC<StatusColumnProps> = ({ title, employees, onSelectEmployee }) => {
  return (
    <div className="bg-brand-secondary rounded-lg shadow-md flex-1 flex flex-col min-h-[45%] border border-brand-accent">
      <div className="p-4 border-b border-brand-accent">
        <h3 className="text-lg font-bold flex items-center text-brand-text">
          {title}
          <span className="ml-2 bg-brand-accent text-brand-subtle text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {employees.length}
          </span>
        </h3>
      </div>
      <div className="p-4 space-y-3 overflow-y-auto flex-1">
        {employees.length > 0 ? (
          employees.map(employee => (
            <EmployeeCard 
              key={employee.id} 
              employee={employee} 
              onSelect={() => onSelectEmployee(employee)}
            />
          ))
        ) : (
          <div className="text-center text-brand-subtle pt-8">誰もいません。</div>
        )}
      </div>
    </div>
  );
};