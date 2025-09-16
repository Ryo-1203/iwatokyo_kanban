
import React, { useMemo } from 'react';
import { Employee } from '../types';
import { StatusColumn } from './StatusColumn';
import { BOARD_STATUS } from '../constants';

interface KanbanBoardProps {
  employees: Employee[];
  onSelectEmployee: (employee: Employee) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ employees, onSelectEmployee }) => {
  const { inOfficeEmployees, awayEmployees } = useMemo(() => {
    const inOffice: Employee[] = [];
    const away: Employee[] = [];
    employees.forEach(emp => {
      if (emp.returnTime || emp.destination) {
        away.push(emp);
      } else {
        inOffice.push(emp);
      }
    });
    return { inOfficeEmployees: inOffice, awayEmployees: away };
  }, [employees]);

  return (
    <div className="flex flex-col h-full space-y-4 overflow-y-auto">
      <StatusColumn 
        title={BOARD_STATUS.IN_OFFICE}
        employees={inOfficeEmployees}
        onSelectEmployee={onSelectEmployee}
      />
      <StatusColumn 
        title={BOARD_STATUS.AWAY}
        employees={awayEmployees}
        onSelectEmployee={onSelectEmployee}
      />
    </div>
  );
};
